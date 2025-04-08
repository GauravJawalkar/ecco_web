"use client"
import axios from "axios"
import toast from "react-hot-toast";
import { create } from "zustand"
import { persist, createJSONStorage } from 'zustand/middleware';
import Cookies from 'js-cookie';


interface User {
    name: string,
    email: string,
    password: string
}

export const useUserStore = create(
    persist(
        (set) => (
            {
                data: {},
                login: async (user: User) => {
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
                        await axios.get('/api/logout')
                        localStorage.clear();
                        Cookies.remove('accessToken')
                        set(
                            () => ({ data: {} })
                        )
                    } catch (error) {
                        throw new Error("Error logging out")
                    }
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
                }
            }
        ),
        {
            name: 'userLogin',
            storage: createJSONStorage(() => localStorage)
        }
    )
)