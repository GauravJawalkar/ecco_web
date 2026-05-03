'use client';

import { useEffect, useRef } from 'react';
import { useUserStore } from '@/store/UserStore';
import ApiClient from '@/interceptors/ApiClient';

/**
 * PROBLEM: No cleanup, no dependency array check
 * This causes:
 * 1. Multiple simultaneous API calls
 * 2. Memory leak from pending promises
 * 3. Zustand subscriber memory accumulation
 */
export default function SessionInitializer() {
    const { setUser } = useUserStore();
    const initAttempted = useRef(false);

    useEffect(() => {
        // FIXED: Prevent re-initialization
        if (initAttempted.current) return;
        initAttempted.current = true;

        let isMounted = true;

        const initializeSession = async () => {
            try {
                const response = await ApiClient.get('/api/auth/sessionCookies');

                if (isMounted && response.data?.user) {
                    setUser(response.data.user);
                }
            } catch (error: any) {
                if (!isMounted) return;

                if (error.response?.status === 401 || error.response?.status === 403) {
                    useUserStore.getState().clearUser();
                }
            }
        };

        initializeSession();

        // FIXED: Cleanup function
        return () => {
            isMounted = false;
        };
    }, []); // FIXED: Empty dependency array

    return null;
}