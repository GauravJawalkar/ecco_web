"use client"

import Loader from '@/components/Loader';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import toast from 'react-hot-toast';

const Login = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const router = useRouter();

    const handelSubmit = async () => {
        try {

            setLoading(true)

            const user = {
                name: name,
                email: email,
                password: password
            }

            const response = await axios.post('/api/login', user)

            if (!response) {
                setLoading(false)
                return new Error('Failed to login')
            }

            toast.success("Logged in")

            setLoading(false)
            setName("");
            setEmail("");
            setPassword("");

            router.push('/profile')

        } catch (error) {
            console.log("error logging in", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <section className='flex items-center justify-center min-h-screen '>
            <div className='w-[500px] flex items-center justify-center px-10 py-16 rounded-xl bg-white/5 backdrop-blur-md'>
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
                    <button type='submit' className='w-full bg-[#0a0a0a] py-2 rounded text-lg hover:bg-[#1a1a1a] transition-all ease-linear duration-200'>
                        {
                            loading ?
                                <Loader title='Logging In' /> :
                                "Login In"
                        }
                    </button>
                    <span>Already have an account ? <Link href={'/signup'} className='text-blue-500 hover:text-blue-700'>Signup</Link> </span>
                </form>
            </div >
        </section>
    )
}

export default Login