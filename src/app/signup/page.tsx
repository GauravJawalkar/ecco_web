"use client"

import Loader from '@/components/Loader';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import toast from 'react-hot-toast';

const Signup = () => {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [avatar, setAvatar] = useState("");
    const [loading, setLoading] = useState(false);


    const handelSubmit = async () => {
        try {
            setLoading(true);

            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('password', password);
            formData.append('avatar', avatar);

            const response = await axios.post('/api/signup', formData)

            if (!response.data) {
                setLoading(false)
                toast.error('Error Registering')
            }

            console.log(response.data)

            toast.success("User registered Successfully")

            setName("");
            setEmail("")
            setPassword("")
            setAvatar("");

            router.push('/login')

        } catch (error) {
            console.log("Error registering the user:", error);
            throw new Error(`Error registering the user: ${error}`)
        }
    }
    return (
        <section className='flex items-center justify-center min-h-screen '>
            <div className='w-[500px] flex items-center justify-center px-10 py-16 rounded-xl dark:bg-white/5 bg-slate-600/5 backdrop-blur-md'>
                <form onSubmit={(e) => { e.preventDefault(); handelSubmit() }} className='flex items-center justify-center gap-5 flex-col min-w-full'>
                    <h1 className='text-center text-4xl uppercase font-semibold'>Sign Up</h1>
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
                    <div className='w-full'>
                        <label>Avatar :</label>
                        <input type="file" className='text-black px-3 bg-white py-2 w-full rounded' placeholder='Choose File' required
                            onChange={(e: any) => setAvatar(e.target.files[0])} />
                    </div>
                    <button type='submit' className='w-full bg-[#0a0a0a] text-[#ededed] py-2 rounded text-lg hover:bg-[#2a2a2a] transition-all ease-linear duration-200'>
                        {
                            loading ?
                                <Loader title='Creating...' /> :
                                "Create Account"
                        }
                    </button>
                    <span>Already have an account ? <Link href={'/login'} className='text-blue-500 hover:text-blue-700'>Login</Link> </span>
                </form>
            </div >
        </section>
    )
}

export default Signup