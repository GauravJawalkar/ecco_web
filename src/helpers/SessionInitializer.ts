'use client';

import { useEffect } from 'react';
import { useUserStore } from '@/store/UserStore';
import ApiClient from '@/interceptors/ApiClient';

/**
 * Runs once on app mount to check if user has valid tokens
 * If accessToken missing but refreshToken valid → triggers refresh
 * If both invalid → clears Zustand store
 */
export default function SessionInitializer() {
    useEffect(() => {
        const initializeSession = async () => {
            try {
                // Check session via cookies (backend will validate tokens)
                const response = await ApiClient.get('/api/auth/sessionCookies');

                if (response.data?.user) {
                    // ✅ User is logged in with valid tokens
                    useUserStore.getState().setUser(response.data.user);
                }
            } catch (error: any) {
                // 403 = refresh token missing/expired → logout
                // 401 = access token missing (will be handled by interceptor)
                if (error.response?.status === 403) {
                    useUserStore.getState().clearUser();
                }
                // Other errors are non-critical during initialization
            }
        };

        initializeSession();
    }, []);

    return null; // This component renders nothing
}