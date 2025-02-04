"use client"
import axios from "axios"
import { create } from "zustand"


interface User {
    name: string,
    email: string,
    password: string
}

export const useUserStore = create((set) => (
    {
        data: null,
        login: async (user: User) => {
            try {
                const response = await axios.post('/api/login', user);
                set(
                    {
                        data: response.data?.user
                    }
                );
            } catch (error) {
                throw new Error("Error logging in")
            }
        },

        logout: async () => {
            try {
                const response = await axios.get('/api/logout')
                set(
                    {
                        data: response.data?.user
                    }
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
))