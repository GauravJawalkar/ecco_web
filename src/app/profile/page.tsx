"use client"
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { MouseEvent, useEffect, useState } from 'react'

const Home = () => {
    const router = useRouter();

    const [user, setUser]: any = useState([]);

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

    async function getDetails() {
        try {
            const response: any = await axios.get('/api/logInDetails');
            if (!response) {
                return new Error("Failed to fetch your data")
            }
            const loggedUser = [response.data.user];
            setUser(loggedUser);
        } catch (error) {
            throw new Error(`Error getting user details : ${error}`)
        }
    }

    useEffect(() => {
        getDetails();
    }, [])

    return (
        <>
            <div>Profile</div>
            <div>User Details</div>
            <div>{user.map(({ _id, name, email }: { _id: string, name: string, email: string }) => {
                return (
                    <div key={_id}>
                        id:{_id}
                        <br />
                        name:{name}
                        <br />
                        email:{email}
                    </div>
                )
            })}</div>
            <button onClick={handleLogout}>Logout</button>
        </>
    )
}

export default Home