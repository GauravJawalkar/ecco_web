"use client"

import Loader from '@/components/Loaders/Loader';
import ApiClient from '@/interceptors/ApiClient';
import axios from 'axios';
import { Eye, EyeClosed } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import toast from 'react-hot-toast';

const Signup = () => {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [avatar, setAvatar] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handelSubmit = async () => {
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('password', password);
            if (avatar) {
                formData.append('avatar', avatar);
            } else {
                return toast.error("Please Select Avatar Image")
            }

            const response = await ApiClient.post('/api/auth/signup', formData)

            if (!response.data) {
                setLoading(false)
                toast.error('Error Registering')
            }
            toast.success("User registered Successfully")
            setName("");
            setEmail("")
            setPassword("")
            setAvatar(null);
            router.push('/login')
        } catch (error) {
            console.error("Error registering the user:", error);
        }
    }
    return (
        <section className='flex items-center justify-center min-h-screen p-4 bg-gray-50/50 dark:bg-[#1a1a1a]'>
            <div className='w-full max-w-[440px] flex flex-col px-6 py-8 sm:px-10 sm:py-10 bg-white dark:bg-neutral-900/50 border border-gray-200 dark:border-neutral-800/60 rounded-[28px] shadow-sm dark:shadow-2xl backdrop-blur-xl'>
                <div className="mb-8 text-center">
                    <h1 className='text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight'>Create account</h1>
                    <p className="text-gray-500 dark:text-neutral-400 mt-2 text-[13px] sm:text-sm">Enter your details to get started.</p>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handelSubmit() }} className='flex flex-col w-full gap-5'>

                    <div className='flex flex-col space-y-2'>
                        <label className='text-[13px] font-medium text-gray-700 dark:text-neutral-300 ml-1'>Full Name</label>
                        <input
                            type="text"
                            className='w-full h-12 px-4 text-[15px] text-gray-900 dark:text-white bg-gray-50/50 dark:bg-neutral-800/40 border border-gray-200 dark:border-neutral-700/60 rounded-2xl placeholder:text-gray-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-4 focus:ring-black/5 dark:focus:ring-white/5 focus:border-gray-400 dark:focus:border-neutral-500 transition-all'
                            placeholder='John Doe'
                            required
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className='flex flex-col space-y-2'>
                        <label className='text-[13px] font-medium text-gray-700 dark:text-neutral-300 ml-1'>Email address</label>
                        <input
                            type="email"
                            className='w-full h-12 px-4 text-[15px] text-gray-900 dark:text-white bg-gray-50/50 dark:bg-neutral-800/40 border border-gray-200 dark:border-neutral-700/60 rounded-2xl placeholder:text-gray-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-4 focus:ring-black/5 dark:focus:ring-white/5 focus:border-gray-400 dark:focus:border-neutral-500 transition-all'
                            placeholder='name@example.com'
                            required
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className='flex flex-col space-y-2 relative'>
                        <label className='text-[13px] font-medium text-gray-700 dark:text-neutral-300 ml-1'>Password</label>
                        <div className="relative w-full">
                            <input
                                type={showPassword ? "text" : "password"}
                                className='w-full h-12 pl-4 pr-12 text-[15px] text-gray-900 dark:text-white bg-gray-50/50 dark:bg-neutral-800/40 border border-gray-200 dark:border-neutral-700/60 rounded-2xl placeholder:text-gray-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-4 focus:ring-black/5 dark:focus:ring-white/5 focus:border-gray-400 dark:focus:border-neutral-500 transition-all'
                                placeholder='Create a password'
                                required
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type='button'
                                disabled={password.trim() === ""}
                                onClick={() => { setShowPassword(!showPassword) }}
                                className='absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-neutral-300 transition-colors outline-none rounded-xl hover:bg-gray-100 dark:hover:bg-neutral-700/50 touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed'>
                                {showPassword ? <Eye size={18} strokeWidth={1.5} /> : <EyeClosed size={18} strokeWidth={1.5} />}
                            </button>
                        </div>
                    </div>

                    <div className='flex flex-col space-y-2'>
                        <label className='text-[13px] font-medium text-gray-700 dark:text-neutral-300 ml-1'>Avatar</label>
                        <div className='flex items-center gap-4 bg-gray-50/50 dark:bg-neutral-800/40 border border-gray-200 dark:border-neutral-700/60 p-2 pl-4 rounded-2xl'>
                            <input
                                type="file"
                                className='w-full text-[13px] text-gray-500 dark:text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-[13px] file:font-semibold file:bg-gray-200 file:text-gray-700 dark:file:bg-neutral-700 dark:file:text-neutral-200 hover:file:bg-gray-300 dark:hover:file:bg-neutral-600 file:transition-all cursor-pointer file:cursor-pointer outline-none'
                                required
                                onChange={(e: any) => setAvatar(e.target.files[0])}
                            />
                            {avatar && (
                                <div className="flex-shrink-0 relative w-10 h-10 border-2 border-white dark:border-neutral-800 rounded-full shadow-sm overflow-hidden bg-gray-100 dark:bg-neutral-900 mr-1">
                                    <img src={URL.createObjectURL(avatar)} alt='preview' className='object-cover w-full h-full' />
                                </div>
                            )}
                        </div>
                    </div>

                    <button type='submit' className='w-full h-12 mt-4 bg-green-700 dark:bg-white text-white dark:text-gray-900 font-medium rounded-2xl text-[15px] hover:bg-green-800 dark:hover:bg-gray-100 active:scale-[0.98] transition-all flex items-center justify-center shadow-md shadow-gray-900/10 dark:shadow-white/5'>
                        {loading ? <Loader title='Creating...' /> : "Create Account"}
                    </button>
                </form>

                <div className='mt-8 text-center text-[13px] sm:text-sm text-gray-500 dark:text-neutral-400'>
                    Already have an account? <Link href={'/login'} className='font-semibold text-gray-900 dark:text-white hover:underline decoration-gray-300 dark:decoration-neutral-600 underline-offset-4 transition-all ml-1'>Sign in</Link>
                </div>
            </div>
        </section>
    )
}

export default Signup