"use client"

import toast from "react-hot-toast";
import { create } from "zustand"
import { persist, createJSONStorage } from 'zustand/middleware';
import Cookies from 'js-cookie';
import { userProps } from "@/interfaces/commonInterfaces";
import ApiClient from "@/interceptors/ApiClient";

interface UserStore {
    data: userProps;
    login: (user: userProps) => Promise<void>;
    logOut: () => Promise<void>;
    clearUser: () => void;
    loginDetails: () => Promise<void>;
    googleLogin: () => void;
    setUser: (user: userProps) => void;
}

export const useUserStore = create<UserStore>()(
    persist(
        (set) => (
            {
                data: {} as userProps,
                login: async (user) => {
                    try {
                        const response = await ApiClient.post('/api/auth/login', user);
                        localStorage.setItem("userLogin", "true");
                        Cookies.set('accessToken', response.data.accessToken, { expires: 1 });
                        set(
                            () => ({ data: response.data.user })
                        );
                    } catch (error) {
                        toast.error("Invalid Credentials");
                        console.error("Error logging in : ", error)
                    }
                },
                logOut: async () => {
                    try {
                        await ApiClient.get('/api/auth/logout');
                        localStorage.removeItem('userLogin');
                        set(
                            () => ({ data: {} as userProps })
                        );
                    } catch (error) {
                        console.error("Error logging out : ", error)
                    }
                },
                clearUser: () => {
                    localStorage.removeItem("userLogin");
                    Cookies.remove("accessToken");
                    set(
                        () => ({ data: {} as userProps })
                    );
                },
                loginDetails: async () => {
                    try {
                        const response = await ApiClient.get('/api/auth/logInDetails');
                        set(
                            {
                                data: response.data.user
                            }
                        )
                    } catch (error) {
                        console.error("Error getting login details")
                    }
                },
                googleLogin: async () => {
                    window.location.href = '/api/auth/google';
                },
                setUser: (user) => set({ data: user })
            }
        ),
        {
            name: 'userLogin',
            storage: createJSONStorage(() => localStorage)
        }
    )
)