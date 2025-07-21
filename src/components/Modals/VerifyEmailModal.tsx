"use client"
import React, { useState } from 'react'
import Loader from '../Loaders/Loader';
import { CircleX, X } from 'lucide-react';
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
        <section className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40'>
            <div className='relative w-full max-w-md p-8 bg-white shadow-lg dark:bg-neutral-800 rounded-xl'>
                <button title="close" className="absolute text-2xl text-gray-500 top-4 right-4 hover:text-gray-700 dark:hover:text-white" onClick={onClose} aria-label="Close" >
                    <X className="w-5 h-5" />
                </button>
                <form onSubmit={(e) => { e.preventDefault(); handelSubmit() }} className='flex flex-col items-center justify-center min-w-full space-y-5 text-sm'>
                    <h1 className='text-2xl font-semibold text-center capitalize'>Verify Your Email</h1>
                    <div className='w-full space-y-1'>
                        <label>OTP :</label>
                        <input type="text" className='w-full px-3 py-2 text-sm font-normal text-black border rounded' placeholder='Enter OTP' required onChange={(e) => setOTP(e.target.value)} />
                    </div>
                    <button type='submit' className='w-full px-4 py-2 font-semibold text-white transition bg-green-600 rounded hover:bg-green-700 disabled:cursor-not-allowed'>
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