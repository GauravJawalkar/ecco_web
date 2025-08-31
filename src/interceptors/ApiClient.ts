import axios from "axios";
import jwt from 'jsonwebtoken';


const ApiClient = axios.create({
    baseURL: process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000'
        : process.env.NEXT_PUBLIC_API_URL,
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

// Function to check if token is expired
const isTokenExpired = (token: string) => {
    try {
        const decoded: any = jwt.decode(token);
        return decoded.exp * 1000 < Date.now();
    } catch {
        return true;
    }
};

// Request interceptor
ApiClient.interceptors.request.use(
    async (config) => {
        const accessToken = document.cookie
            .split('; ')
            .find(row => row.startsWith('accessToken='))
            ?.split('=')[1];

        if (accessToken && isTokenExpired(accessToken)) {
            if (!isRefreshing) {
                isRefreshing = true;
                try {
                    await axios.post('/api/refresh');
                    processQueue();
                } catch (error) {
                    processQueue(error);
                    window.location.href = '/login';
                } finally {
                    isRefreshing = false;
                }
            }
            return new Promise((resolve) => {
                failedQueue.push({ resolve: () => resolve(config) });
            });
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for handling token refresh
ApiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // Queue the requests if a refresh is already in progress
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(() => {
                        return ApiClient(originalRequest);
                    })
                    .catch(err => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;
            try {
                console.log("Refreshing token...");
                await axios.post('/api/refreshToken');
                processQueue();
                console.log("Token refreshed, retrying original request...");

                return ApiClient(originalRequest)
            } catch (error) {
                processQueue(error);
                window.location.href = '/login';
                return Promise.reject(error);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
)

export default ApiClient;