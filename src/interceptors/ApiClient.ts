import { useUserStore } from "@/store/UserStore";
import axios, { AxiosError } from "axios";

const ApiClient = axios.create({
    baseURL: process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000'
        : process.env.NEXT_PUBLIC_API_URL,
    timeout: 10000,
    withCredentials: true,
});

let isRefreshing = false;
let failedQueue: { resolve: () => void; reject: (err: unknown) => void }[] = [];

const processQueue = (error: unknown = null) => {
    failedQueue.forEach(prom => error ? prom.reject(error) : prom.resolve());
    failedQueue = [];
};

const handleLogout = () => {
    const publicPaths = [
        '/login',
        '/signup',
        '/',
        '/products',
        '/stores',
        '/about',
        '/contact'
    ];
    const isAlreadyPublic = publicPaths.some(
        (p) => window.location.pathname === p || window.location.pathname.startsWith(p + "/")
    );

    // Clear Zustand store AND its persisted localStorage key
    useUserStore.getState().clearUser();
    
    if (!isAlreadyPublic) {
        window.location.href = "/login";
    }
};

// Request interceptor
ApiClient.interceptors.request.use(
    (config) => config,
    (error) => Promise.reject(error)
);

// Response interceptor
ApiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as typeof error.config & { _retry?: boolean };

        // Network error (no response from server)
        if (!error.response) {
            console.error('Network error:', error.message);
            return Promise.reject(error);
        }

        const status = error.response.status;
        const url = originalRequest?.url || "";

        // Case 1: 403 — Refresh token missing or expired, must logout
        if (status === 403) {
            handleLogout();
            return Promise.reject(error);
        }

        // Case 2: 401 — Access token expired, attempt refresh
        if (status === 401 && !originalRequest?._retry) {
            // Skip refresh loop for the refresh endpoint itself
            if (url.includes('/api/auth/refreshToken') || url.includes('/api/auth/sessionCookies')) {
                handleLogout();
                return Promise.reject(error);
            }

            // Queue requests while refresh is in progress
            if (isRefreshing) {
                return new Promise<void>((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(() => ApiClient(originalRequest!))
                    .catch(err => Promise.reject(err));
            }

            originalRequest!._retry = true;
            isRefreshing = true;

            try {
                // Attempt token refresh
                await axios.post('/api/auth/refreshToken', {}, { withCredentials: true });
                
                // After successful refresh, re-sync Zustand store
                try {
                    const sessionRes = await axios.get("/api/auth/sessionCookies", {
                        withCredentials: true,
                    });
                    if (sessionRes.data?.user) {
                        useUserStore.getState().setUser(sessionRes.data.user);
                    }
                } catch {
                    // Non-critical — store sync failed but request can still retry
                }

                processQueue();
                return ApiClient(originalRequest!);
            } catch (err) {
                console.log('Refresh token invalid or expired, logging out', err);
                processQueue(err);
                handleLogout();
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default ApiClient;