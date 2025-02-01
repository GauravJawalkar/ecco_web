"use client"
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { MouseEvent } from 'react'

const Home = () => {
    const router = useRouter();

    const handleLogout = async (e: MouseEvent) => {
        e.preventDefault()
        try {
            const response = await axios.get('/api/logout');
            if (!response) {
                return `Unable to logout`
            }
            router.push('/login')
        } catch (error) {
            console.log("Logout Failed", error)
            throw new Error("Failed to logout")
        }
    }
    return (
        <>
            <div>Home</div>
            <button onClick={handleLogout}>Logout</button>
        </>
    )
}

export default Home