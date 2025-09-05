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
        <section className='flex items-center justify-center min-h-screen '>
            <div className='w-[500px] flex items-center justify-center px-10 py-16 rounded-xl dark:bg-white/5 bg-slate-600/5 backdrop-blur-md'>
                <form onSubmit={(e) => { e.preventDefault(); handelSubmit() }} className='flex flex-col items-center justify-center min-w-full gap-5'>
                    <h1 className='text-3xl font-semibold text-center uppercase'>Sign Up</h1>
                    <div className='w-full'>
                        <label className='text-sm'>Name :</label>
                        <input type="text" className='w-full p-2 text-sm text-black rounded' placeholder='Name' required onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className='w-full'>
                        <label className='text-sm'>Email :</label>
                        <input type="email" className='w-full p-2 text-sm text-black rounded' placeholder='Email' required onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className='w-full relative'>
                        <label className='text-sm'>Password :</label>
                        <input type={showPassword ? "text" : "password"} className='w-full p-2 text-sm text-black rounded' placeholder='Password' required onChange={(e) => setPassword(e.target.value)} />
                        <button type='button' disabled={password.trim() === ""} onClick={() => { setShowPassword(!showPassword) }} className='absolute top-1/2 right-0 -translate-x-1/2 -translate-y-1/2 mt-3 text-gray-500 dark:text-gray-400 disabled:cursor-not-allowed'>
                            {showPassword ? < Eye size={20} /> : <EyeClosed size={20} />}
                        </button>
                    </div>
                    <div className='w-full'>
                        <label className='text-sm'>Avatar :</label>
                        <div className='flex items-center justify-center gap-2'>
                            <input type="file" className='w-full p-2 text-sm text-black bg-white rounded' placeholder='Choose File' required
                                onChange={(e: any) => setAvatar(e.target.files[0])} />
                            {avatar && <img src={URL.createObjectURL(avatar)} alt='user-image' height={400} width={400} className='h-12 w-12 border rounded-full' />}
                        </div>
                    </div>
                    <button type='submit' className='w-full py-3 text-sm text-white uppercase transition-all duration-200 ease-linear rounded bg-neutral-950 dark:hover:bg-neutral-900 hover:bg-neutral-950/80'>
                        {
                            loading ?
                                <Loader title='Creating...' /> :
                                "Create Account"
                        }
                    </button>
                    <span className='text-sm'>Already have an account ? <Link href={'/login'} className='text-blue-500 hover:text-blue-700'>Login</Link> </span>
                </form>
            </div >
        </section>
    )
}

export default Signup