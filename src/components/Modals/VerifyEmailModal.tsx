"use client"
import React, { useState } from 'react'
import Loader from '../Loaders/Loader';
import { CircleX } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useUserStore } from '@/store/UserStore';

const VerifyEmailModal = ({ isVisible, onClose, id }: { isVisible: boolean, onClose: () => void, id: string }) => {
    const [OTP, setOTP] = useState("")
    const [loading, setLoading] = useState(false);
    const setUser = useUserStore((state) => state.setUser);

    const handelSubmit = async () => {
        try {
            setLoading(true)
            const response = await axios.post('/api/verifyEmail', { id, OTP });
            if (response.data?.data) {
                toast.success("Email Verified");
                setUser(response.data?.data);
                setLoading(false);
                onClose();
            } else {
                toast.error("Failed to verify Email")
                setLoading(false)
            }
        } catch (error) {
            toast.error("Failed to verify Email");
            console.error("Error verifying email:", error);
            setLoading(false)
        }
    }
    if (!isVisible) return null;
    return (
        <section className='flex items-center justify-center min-h-screen inset-0 fixed z-10'>
            <div className='w-[500px] flex items-center justify-center p-10 rounded-xl dark:bg-white/5 bg-slate-600/5 backdrop-blur-md'>
                <form onSubmit={(e) => { e.preventDefault(); handelSubmit() }} className='flex items-center justify-center space-y-5 flex-col min-w-full'>
                    <div className='flex items-end justify-end w-full absolute -top-3 -right-3 fill-white dark:fill-[#1a1a1a]'>
                        <button onClick={() => onClose()}><CircleX className='h-7 w-7' /></button>
                    </div>
                    <h1 className='text-center text-2xl capitalize font-semibold'>Verify Your Email</h1>
                    <div className='w-full'>
                        <label>OTP :</label>
                        <input type="text" className='text-black px-3 py-2 w-full rounded text-sm font-normal' placeholder='Enter OTP' required onChange={(e) => setOTP(e.target.value)} />
                    </div>
                    <button type='submit' className='w-full bg-[#0a0a0a] text-[#ededed] py-2 rounded text-sm hover:bg-[#1a1a1a] transition-all ease-linear duration-200'>
                        {
                            loading ?
                                <Loader title='Verifying' /> :
                                "Verify"
                        }
                    </button>
                </form>
            </div >
        </section >
    )
}

export default VerifyEmailModal