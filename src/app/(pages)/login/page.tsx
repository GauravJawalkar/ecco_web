"use client"

import Loader from '@/components/Loaders/Loader';
import { useUserStore } from '@/store/UserStore';
import axios from 'axios';
import { LoaderCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import toast from 'react-hot-toast';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [forgotLoading, setForgotLoading] = useState(false)
    const [required, setRequired] = useState(true);
    const { login, googleLogin }: any = useUserStore()
    const router = useRouter()

    const handelSubmit = async () => {
        setLoading(true)
        try {
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
            console.log("Error logging in", error)
        } finally {
            setLoading(false)
        }
    }

    const handelOTP = async () => {
        setForgotLoading(true)
        setRequired(false);
        try {
            const res = await axios.post('/api/otpValidation', { email })
            if (res.data.data) {
                toast.success("Check email for OTP");
            }
            setForgotLoading(false)
            router.push('/forgot-password');
        } catch (error) {
            setForgotLoading(false)
            console.log("error sending OTP in", error)
        }
    }

    const handelGoogleLogin = async () => {
        try {
            await googleLogin();
        } catch (error) {

        }
    }

    return (
        <section className='flex items-center justify-center min-h-screen '>
            <div className='w-[500px] flex items-center flex-col justify-center px-10 py-16 rounded-xl dark:bg-white/5 bg-slate-600/5 backdrop-blur-md'>
                <form onSubmit={(e) => { e.preventDefault(); handelSubmit() }} className='flex items-center justify-center gap-5 flex-col min-w-full'>
                    <h1 className='text-center text-4xl uppercase font-semibold'>Login</h1>
                    <div className='w-full'>
                        <label>Email :</label>
                        <input type="email" className='text-black px-3 py-2 w-full rounded' placeholder='Email' required onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className='w-full'>
                        <label>Password :</label>
                        <input type="password" className='text-black px-3 py-2 w-full rounded' placeholder='Password' required={required} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div className='w-full'>
                        <button onClick={() => { setLoading(false); handelOTP() }} className='text-gray-500 hover:text-gray-700 transition-all ease-linear duration-200 flex items-center justify-center gap-3'>
                            Forgot Password {
                                forgotLoading ? <LoaderCircle className='animate-spin h-5 w-5' /> : "?"
                            }</button>
                    </div>
                    <button type='submit' className='w-full bg-[#0a0a0a] text-[#ededed] py-2 rounded text-lg hover:bg-[#1a1a1a] transition-all ease-linear duration-200'>
                        {
                            loading ?
                                <Loader title='Logging In' /> :
                                "Login In"
                        }
                    </button>
                </form>
                <div className='my-4'>
                    <button className='py-2 px-4 gap-3 rounded border flex items-center justify-center'
                        onClick={handelGoogleLogin}
                    >
                        <span> Continue with Google</span>
                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" className='h-8 w-8 ' viewBox="0 0 48 48">
                            <path fill="#fbc02d" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12	s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20	s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#e53935" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039	l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4caf50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36	c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1565c0" d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571	c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                        </svg>
                    </button>
                </div>
                <div >
                    <span>Create an account ? <Link href={'/signup'} className='text-blue-500 hover:text-blue-700'>Signup</Link> </span>
                </div>
            </div >
        </section >
    )
}

export default Login