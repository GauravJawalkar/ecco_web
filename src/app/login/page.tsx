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

            router.push('/profile')

            console.log("Logged in ", response.data)

        } catch (error) {
            console.log("error logging in", error)
        }
    }

    return (
        <section className='flex items-center justify-center min-h-screen '>
            <div className='w-[500px] flex items-center justify-center border px-10 py-16 rounded-xl border-gray-500'>
                <form onSubmit={(e) => { e.preventDefault(); handelSubmit() }} className='flex items-center justify-center gap-5 flex-col min-w-full'>
                    <h1 className='text-center text-4xl uppercase font-semibold'>Login</h1>
                    <div className='w-full'>
                        <label>Name :</label>
                        <input type="text" className='text-black px-3 py-2 w-full rounded' placeholder='Name' required onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className='w-full'>
                        <label>Email :</label>
                        <input type="email" className='text-black px-3 py-2 w-full rounded' placeholder='Email' required onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className='w-full'>
                        <label>Password :</label>
                        <input type="password" className='text-black px-3 py-2 w-full rounded' placeholder='Password' required onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <button type='submit' className='w-full bg-[#0a0a0a] py-2 rounded text-lg hover:bg-[#2a2a2a] transition-all ease-linear duration-200 border-gray-500 border '>Login</button>
                </form>
            </div >
        </section>
    )
}

export default Login