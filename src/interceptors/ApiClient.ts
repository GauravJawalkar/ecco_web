import axios, { AxiosError } from "axios";

const ApiClient = axios.create({
    baseURL: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : process.env.NEXT_PUBLIC_API_URL,
    timeout: 10000,
    withCredentials: true,
})
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any = null) => {
    failedQueue.forEach(prom => {
        if (error) prom.reject(error);
        else prom.resolve();
    });
    failedQueue = [];
};

// Helper function to handle logout
const handleLogout = () => {
    // Clearing client-side state if needed
    localStorage.clear();
    sessionStorage.clear();
    // Redirect to login page
    window.location.href = '/login';
};

// Request interceptor
ApiClient.interceptors.request.use(
    async (config) => { return config },
    (error) => { return Promise.reject(error) }
)

// Response interceptor
ApiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        console.log('API Error:', {
            status: error.response?.status,
            url: originalRequest?.url,
            isRetry: originalRequest?._retry
        });

        // Case 1: 403 status - No refresh token, immediate logout
        if (error.response?.status === 403) {
            console.log("No refresh token available - logging out");
            handleLogout();
            return Promise.reject(error);
        }

        // Case 2: 401 status - Try to refresh token
        if (error.response?.status === 401 && !originalRequest?._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(() => {
                        return ApiClient(originalRequest)
                    })
                    .catch(err => {
                        return Promise.reject(err)
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const response = await axios.post(`/api/refreshToken`, {}, { withCredentials: true });

                if (response.status === 200) {
                    processQueue();
                    return ApiClient(originalRequest);
                }
            } catch (err: AxiosError | any) {
                processQueue(err);

                // Check if refresh failed due to invalid/expired refresh token
                if (err.response?.status === 403 ||
                    err.response?.status === 401) {
                    handleLogout();
                }

                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default ApiClient;