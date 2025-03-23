"use client"
import Loader from '@/components/Loaders/Loader';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import toast from 'react-hot-toast';

const ForgotPassword = () => {

    const [email, setEmail] = useState("");
    const [newPassword, setnewPassword] = useState("");
    const [OTP, setOTP] = useState("");
    const [loading, setLoading] = useState(false)
    const router = useRouter();

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
                <form onSubmit={(e) => { e.preventDefault(); handelSubmit() }} className='flex items-center justify-center gap-5 flex-col min-w-full'>
                    <h1 className='text-center text-4xl uppercase font-semibold'>RESET PASS</h1>
                    <div className='w-full'>
                        <label>Registered Email :</label>
                        <input type="text" className='text-black px-3 py-2 w-full rounded' placeholder='Email' required onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className='w-full'>
                        <label>New Password :</label>
                        <input type="text" className='text-black px-3 py-2 w-full rounded' placeholder='Password' required onChange={(e) => setnewPassword(e.target.value)} />
                    </div>
                    <div className='w-full'>
                        <label>OTP :</label>
                        <input type="number" className='text-black px-3 py-2 w-full rounded ' placeholder='One Time Password' required onChange={(e) => setOTP(e.target.value)} />
                    </div>
                    <button type='submit' className='w-full bg-[#0a0a0a] text-[#ededed] py-2 rounded text-lg hover:bg-[#1a1a1a] transition-all ease-linear duration-200'>
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