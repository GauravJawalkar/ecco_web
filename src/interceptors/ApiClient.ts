import { useUserStore } from "@/store/UserStore";
import axios, { AxiosError } from "axios";

const ApiClient = axios.create({
    baseURL: process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : process.env.NEXT_PUBLIC_API_URL,
    timeout: 10000,
    withCredentials: true,
});

let isRefreshing = false;
let failedQueue: { resolve: () => void; reject: (err: unknown) => void }[] = [];

const processQueue = (error: unknown = null) => {
    failedQueue.forEach((prom) => (error ? prom.reject(error) : prom.resolve()));
    failedQueue = [];
};

const handleLogout = () => {
    failedQueue = [];
    isRefreshing = false;
    useUserStore.getState().clearUser();

    const publicPaths = ["/login", "/signup", "/", "/products", "/stores", "/about", "/contact"];
    const isAlreadyPublic = typeof window !== "undefined" &&
        publicPaths.some((p) =>
            window.location.pathname === p ||
            window.location.pathname.startsWith(p + "/")
        );

    if (!isAlreadyPublic && typeof window !== "undefined") {
        window.location.href = "/login";
    }
};

// Response interceptor
ApiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as typeof error.config & { _retry?: boolean };

        if (!error.response) {
            console.error("Network error:", error.message);
            return Promise.reject(error);
        }

        const status = error.response.status;
        const url = originalRequest?.url || "";

        // Never retry these endpoints — break the loop immediately
        const isAuthEndpoint =
            url.includes("/api/auth/refreshToken") ||
            url.includes("/api/auth/sessionCookies") ||
            url.includes("/api/auth/login");

        if (isAuthEndpoint) {
            handleLogout();
            return Promise.reject(error);
        }

        // 401 — access token expired → refresh then retry
        if ((status === 401 || status === 403) && !originalRequest?._retry) {

            // Queue concurrent requests while refresh is in progress
            if (isRefreshing) {
                return new Promise<void>((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(() => ApiClient(originalRequest!))
                    .catch((err) => Promise.reject(err));
            }

            originalRequest!._retry = true;
            isRefreshing = true;

            try {
                // ONLY call refreshToken here — dedicated rotation endpoint
                await axios.post("/api/auth/refreshToken", {}, {
                    withCredentials: true,
                });

                processQueue();
                isRefreshing = false;
                return ApiClient(originalRequest!);

            } catch (err) {
                processQueue(err);
                isRefreshing = false;
                handleLogout();
                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
);

export default ApiClient;