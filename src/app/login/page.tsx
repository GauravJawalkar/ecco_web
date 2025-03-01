"use client"

import Loader from '@/components/Loader';
import { useUserStore } from '@/store/UserStore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import toast from 'react-hot-toast';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const router = useRouter();
    const { login }: any = useUserStore()

    const handelSubmit = async () => {
        try {
            setLoading(true)
            const user = {
                email: email,
                password: password
            }

            await login(user)

            toast.success("Logged in")

            setLoading(false)
            setEmail("");
            setPassword("");

            localStorage.setItem("login", "true");

            router.push('/')
        } catch (error) {
            console.log("error logging in", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <section className='flex items-center justify-center min-h-screen '>
            <div className='w-[500px] flex items-center justify-center px-10 py-16 rounded-xl dark:bg-white/5 bg-slate-600/5 backdrop-blur-md'>
                <form onSubmit={(e) => { e.preventDefault(); handelSubmit() }} className='flex items-center justify-center gap-5 flex-col min-w-full'>
                    <h1 className='text-center text-4xl uppercase font-semibold'>Login</h1>
                    <div className='w-full'>
                        <label>Email :</label>
                        <input type="email" className='text-black px-3 py-2 w-full rounded' placeholder='Email' required onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className='w-full'>
                        <label>Password :</label>
                        <input type="password" className='text-black px-3 py-2 w-full rounded' placeholder='Password' required onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div className='w-full'>
                        <button className='text-gray-500 hover:text-gray-700 transition-all ease-linear duration-200'>Forgot Password ?</button>
                    </div>
                    <button type='submit' className='w-full bg-[#0a0a0a] text-[#ededed] py-2 rounded text-lg hover:bg-[#1a1a1a] transition-all ease-linear duration-200'>
                        {
                            loading ?
                                <Loader title='Logging In' /> :
                                "Login In"
                        }
                    </button>
                    <span>Create an account ? <Link href={'/signup'} className='text-blue-500 hover:text-blue-700'>Signup</Link> </span>
                </form>
            </div >
        </section>
    )
}

export default Login