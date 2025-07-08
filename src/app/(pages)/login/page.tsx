"use client"

import Loader from '@/components/Loaders/Loader';
import { useUserStore } from '@/store/UserStore';
import axios from 'axios';
import { Eye, EyeClosed, EyeOff, LoaderCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [forgotLoading, setForgotLoading] = useState(false)
    const [required, setRequired] = useState(true);
    const { login, googleLogin }: any = useUserStore()
    const router = useRouter()
    const clearUser = useUserStore((state: any) => state.clearUser);
    const [showPassword, setShowPassword] = useState(false);

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



    const handelGoogleLogin = async () => {
        try {
            await googleLogin();
        } catch (error) {
            console.error("Error loggin in with google (OAuth): ", error);
        }
    }

    useEffect(() => {
        clearUser();
    }, [])


    return (
        <section className='flex items-center justify-center min-h-screen '>
            <div className='w-[500px] flex items-center flex-col justify-center px-10 py-16 rounded-xl dark:bg-white/5 bg-slate-600/5 backdrop-blur-md'>
                <div>
                    <h1 className='py-4 text-3xl font-semibold text-center uppercase'>Login</h1>
                </div>


                <div className='flex items-center justify-center w-full py-2'>
                    <button className='flex items-center justify-center min-w-full gap-3 px-4 py-1 text-sm rounded ring-1 ring-gray-200 hover:ring-2 dark:ring-neutral-700'
                        onClick={handelGoogleLogin}>
                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" className='w-8 h-8 ' viewBox="0 0 48 48">
                            <path fill="#fbc02d" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12	s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20	s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#e53935" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039	l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4caf50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36	c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1565c0" d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571	c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                        </svg>
                        <span> Continue with Google</span>
                    </button>
                </div>
                <div className="flex items-center justify-center w-full py-2 space-x-4">
                    <hr className="flex-grow border-t border-gray-300 dark:border-neutral-700" />
                    <span className="text-sm text-gray-500">OR</span>
                    <hr className="flex-grow border-t border-gray-300 dark:border-neutral-700" />
                </div>
                <form onSubmit={(e) => { e.preventDefault(); handelSubmit() }} className='flex flex-col items-center justify-center min-w-full gap-5 py-2'>
                    <div className='w-full'>
                        <label className='text-sm'>Email :</label>
                        <input type="email" className='w-full px-3 py-2 text-sm text-black rounded' placeholder='Enter Your Email' required onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className='relative w-full'>
                        <label className='text-sm'>Password :</label>
                        <input type={showPassword ? "text" : "password"} className='w-full px-3 py-2 text-sm text-black rounded' placeholder='Enter Your Password' required={required} onChange={(e) => setPassword(e.target.value)} />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute mt-3 text-gray-500 -translate-y-1/2 outline-none cursor-pointer top-1/2 right-3 dark:text-gray-400">
                            {showPassword ? <Eye size={20} /> : <EyeClosed size={20} />}
                        </button>
                    </div>

                    <button type='submit' className='w-full bg-neutral-950 text-[#ededed] py-3 rounded text-sm uppercase hover:bg-neutral-900 transition-all ease-linear duration-200 hover:bg-neutral-950/80'>
                        {
                            loading ?
                                <Loader title='Logging In' /> :
                                "Login In"
                        }
                    </button>
                </form>
                <div className='w-full my-2 text-start'>
                    <Link href={'/forgot-password'} type='button' className='gap-3 text-sm transition-all ease-linear cursor-pointer dark:text-gray-300 duration-400 hover:text-gray-700 dark:hover:text-gray-200'>
                        Forgot Password
                    </Link>
                </div>

                <div className='text-sm'>
                    <span>Create an account ? <Link href={'/signup'} className='text-blue-500 hover:text-blue-700'>Signup</Link> </span>
                </div>
            </div >
        </section >
    )
}

export default Login