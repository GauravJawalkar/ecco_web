"use client"
import axios from "axios"
import toast from "react-hot-toast";
import { create } from "zustand"
import { persist, createJSONStorage } from 'zustand/middleware';
import Cookies from 'js-cookie';
import { userProps } from "@/interfaces/commonInterfaces";

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
                        const response = await axios.post('/api/login', user);
                        set(
                            () => ({ data: response.data.user })
                        );
                    } catch (error) {
                        toast.error("Invalid Credentials");
                        console.log("Error logging in : ", error)
                        throw new Error("Error logging in")
                    }
                },
                logOut: async () => {
                    try {
                        await axios.get('/api/logout');
                        localStorage.removeItem('userLogin');
                        Cookies.remove('accessToken');
                        Cookies.remove('user');
                        set(
                            () => ({ data: {} as userProps })
                        );
                    } catch (error) {
                        console.error("Error logging out : ", error)
                        throw new Error("Error logging out")
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
                        const response = await axios.get('/api/logInDetails');
                        set(
                            {
                                data: response.data.user
                            }
                        )
                    } catch (error) {
                        throw new Error("Error getting login details")
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