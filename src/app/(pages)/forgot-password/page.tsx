"use client"
import Loader from '@/components/Loaders/Loader';
import axios from 'axios';
import { Eye, EyeClosed } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import toast from 'react-hot-toast';

const ForgotPassword = () => {

    const [email, setEmail] = useState("");
    const [newPassword, setnewPassword] = useState("");
    const [OTP, setOTP] = useState("");
    const [loading, setLoading] = useState(false)
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false)

    const handelSubmit = async () => {
        try {
            const response = await axios.post('/api/resetPassword', { email, newPassword, OTP });

            if (response.data.data) {
                toast.success("Password Reset SuccessFully");
                router.push('/login')
            }
        } catch (error) {
            toast.error("Error resetting password");
            console.log("Error resetting password : ", error)
        }
    }
    return (
        <section className='flex items-center justify-center min-h-screen '>
            <div className='w-[500px] flex items-center justify-center px-10 py-16 rounded-xl dark:bg-white/5 bg-slate-600/5 backdrop-blur-md'>
                <form onSubmit={(e) => { e.preventDefault(); handelSubmit() }} className='flex flex-col items-center justify-center min-w-full gap-5'>
                    <h1 className='text-2xl font-semibold text-center uppercase'>RESET Password</h1>
                    <div className='w-full space-y-2 text-sm'>
                        <label>Registered Email :</label>
                        <input type="text" className='w-full px-3 py-2 text-black rounded' placeholder='Email' required onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className='w-full space-y-2 text-sm relative'>
                        <label>New Password :</label>
                        <input type={showPassword ? "text" : "password"} className='w-full px-3 py-2 text-black rounded' placeholder='Password' required onChange={(e) => setnewPassword(e.target.value)} />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute pt-3 text-gray-500 -translate-y-1/2 outline-none cursor-pointer top-1/2 right-3 dark:text-gray-400">
                            {showPassword ? <Eye size={20} /> : <EyeClosed size={20} />}
                        </button>
                    </div>
                    <div className='w-full space-y-2 text-sm'>
                        <label>OTP :</label>
                        <input type="number" className='w-full px-3 py-2 text-black rounded ' placeholder='One Time Password' required onChange={(e) => setOTP(e.target.value)} />
                    </div>
                    <button type='submit' className='w-full bg-[#0a0a0a] text-[#ededed] rounded text-sm py-3 hover:bg-[#1a1a1a] transition-all ease-linear duration-200 uppercase '>
                        {
                            loading ?
                                <Loader title='Setting...' /> :
                                "Reset Password"
                        }
                    </button>
                </form>
            </div >
        </section>
    )
}

export default ForgotPassword