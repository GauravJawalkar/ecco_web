"use client"

import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

const Login = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")
    const router = useRouter();

    const handelSubmit = async () => {
        try {
            const user = {
                name: name,
                email: email,
                password: password
            }

            const response = await axios.post('/api/login', user)

            if (!response) {
                return new Error('Failed to login')
            }

            router.push('/home')

            console.log("Logged in ", response.data)

        } catch (error) {
            console.log("error logging in", error)
        }
    }


    return (
        <div>
            <form onSubmit={(e) => { e.preventDefault(); handelSubmit() }}>
                <input type="text" className='text-black' placeholder='name' required
                    onChange={(e) => setName(e.target.value)} />
                <input type="email" className='text-black' placeholder='email' required
                    onChange={(e) => setEmail(e.target.value)} />
                <input type="password" className='text-black' placeholder='password' required
                    onChange={(e) => setPassword(e.target.value)} />
                <button type='submit'>Login</button>
            </form>
        </div >
    )
}

export default Login