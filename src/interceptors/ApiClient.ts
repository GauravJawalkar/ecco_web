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

    // Reset refresh state
    isRefreshing = false;
    failedQueue = [];

    // Redirect to login page
    window.location.href = '/login';
};

// Helper function to check if 403 is auth-related
const isAuthRelated403 = (error: any, originalRequest: any) => {
    const errorMessage = error.response?.data?.error?.toLowerCase() || "";
    const url = originalRequest?.url || "";

    // Check for auth-related keywords in error message
    const authKeywords = ['token', 'login', 'refresh', 'authentication', 'logout', 'loginDetails', 'refreshToken', 'resetPassword', 'sessionCookies', 'signup'];
    const hasAuthKeywords = authKeywords.some(keyword => errorMessage.includes(keyword));

    // Check if URL is auth-related
    const isAuthEndpoint = url.includes('/api/auth/') ||
        url.includes('/sessionCookies') ||
        url.includes('/refreshToken');

    return hasAuthKeywords || isAuthEndpoint;

}

// Request interceptor
ApiClient.interceptors.request.use(
    async (config) => { return config },
    (error) => { return Promise.reject(error) }
)

// Response interceptor
ApiClient.interceptors.response.use(
    (response) => { return response },
    async (error) => {
        const originalRequest = error.config;

        // Handleling network errors (no response)
        if (!error.response) {
            console.error('Network error:', error.message);
            return Promise.reject(error);
        }

        console.log('API Error:', {
            status: error.response?.status,
            url: originalRequest?.url,
            isRetry: originalRequest?._retry,
            message: error.response?.data?.error
        });

        // Case 1: 403 status - No refresh token, immediate logout
        if (error.response?.status === 403) {
            if (isAuthRelated403(error, originalRequest)) {
                handleLogout();
                return Promise.reject(error);
            } else {
                return Promise.reject(error);
            }
        }

        // Case 2: 401 status - Try to refresh token
        if (error.response?.status === 401 && !originalRequest?._retry) {
            // If already refreshing, queue the request
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
                const response = await axios.post(`/api/auth/refreshToken`, {}, { withCredentials: true });
                if (response.status === 200) {
                    processQueue();
                    return ApiClient(originalRequest);
                } else {
                    console.warn(`Unexpected refresh response status: ${response.status}`);
                    throw new Error(`Refresh returned ${response.status}`);
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