"use client"

import toast from "react-hot-toast";
import { create } from "zustand"
import { persist, createJSONStorage } from 'zustand/middleware';
import { userProps } from "@/interfaces/commonInterfaces";
import ApiClient from "@/interceptors/ApiClient";

interface UserStore {
    data: userProps;
    isAuthenticated: boolean;
    login: (user: any) => Promise<void>;
    logOut: () => Promise<void>;
    clearUser: () => void;
    loginDetails: () => Promise<void>;
    googleLogin: () => void;
    setUser: (user: userProps) => void;
}

export const useUserStore = create<UserStore>()(
    persist(
        (set, get) => ({
            data: {} as userProps,
            isAuthenticated: false,

            login: async (user) => {
                try {
                    const response = await ApiClient.post('/api/auth/login', user);
                    if (response.data?.user) {
                        set({ data: response.data.user, isAuthenticated: true });
                        toast.success("Logged in successfully");
                    }
                } catch (error) {
                    toast.error("Invalid Credentials");
                    console.error("Error logging in : ", error);
                    throw error;
                }
            },

            logOut: async () => {
                try {
                    await ApiClient.get('/api/auth/logout');
                    set({ data: {} as userProps, isAuthenticated: false });
                } catch (error) {
                    console.error("Error logging out : ", error)
                }
            },

            clearUser: () => {
                // Called on confirmed logout (403 - refresh token expired/missing)
                set({ data: {} as userProps, isAuthenticated: false });
            },

            loginDetails: async () => {
                try {
                    const response = await ApiClient.get('/api/auth/logInDetails');
                    if (response.data?.user) {
                        set({ data: response.data.user, isAuthenticated: true });
                    }
                } catch (error) {
                    console.error("Error getting login details")
                }
            },

            googleLogin: async () => {
                window.location.href = '/api/auth/google';
            },

            // FIXED: Replaces redundant loginDetails with smarter setUser
            setUser: (user: userProps) => {
                // Prevent unnecessary updates (memory leak prevention)
                const currentData = get().data;

                // Skip if user data hasn't changed
                if (JSON.stringify(currentData) === JSON.stringify(user)) {
                    return;
                }

                // Only update if user has valid _id
                if (user?._id) {
                    set({ data: user, isAuthenticated: true });
                } else {
                    console.warn("Invalid user data provided to setUser");
                }
            },
        }),
        {
            name: 'userLogin',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ data: state.data, isAuthenticated: state.isAuthenticated })
        }
    )
)