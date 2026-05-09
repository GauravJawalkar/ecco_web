"use client";

import { useEffect, useRef } from "react";
import { useUserStore } from "@/store/UserStore";
import ApiClient from "@/interceptors/ApiClient";
import axios from "axios";

export default function SessionInitializer() {
    const { setUser } = useUserStore();
    const initAttempted = useRef(false);

    useEffect(() => {
        if (initAttempted.current) return;
        initAttempted.current = true;

        let isMounted = true;

        const initializeSession = async () => {
            try {
                // Step 1: Check if session is valid
                const response = await ApiClient.get("/api/auth/sessionCookies");
                if (isMounted && response.data?.user) {
                    setUser(response.data.user);
                }
            } catch (error: any) {
                if (!isMounted) return;

                const status = error.response?.status;

                if (status === 401) {
                    // Access token expired — refresh then fetch user
                    try {
                        await axios.post("/api/auth/refreshToken", {}, {
                            withCredentials: true,
                        });
                        // Now fetch user with new access token
                        const retryRes = await ApiClient.get("/api/auth/sessionCookies");
                        if (isMounted && retryRes.data?.user) {
                            setUser(retryRes.data.user);
                        }
                    } catch {
                        // Refresh failed — user stays logged out
                        useUserStore.getState().clearUser();
                    }
                } else if (status === 403) {
                    // No token or fully expired — clear silently
                    useUserStore.getState().clearUser();
                }
            }
        };

        initializeSession();

        return () => {
            isMounted = false;
        };
    }, []);

    return null;
}