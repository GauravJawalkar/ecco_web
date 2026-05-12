"use client"
import React, { useState } from 'react'
import Loader from '../Loaders/Loader';
import { CircleX, X } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useUserStore } from '@/store/UserStore';
import ApiClient from '@/interceptors/ApiClient';

const VerifyEmailModal = ({ isVisible, onClose, id }: { isVisible: boolean, onClose: () => void, id: string }) => {
    const [OTP, setOTP] = useState("")
    const [loading, setLoading] = useState(false);
    const setUser = useUserStore((state) => state.setUser);

    const handelSubmit = async () => {
        try {
            setLoading(true)
            const response = await ApiClient.post('/api/verifyEmail', { id, OTP });
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
        <section className='fixed inset-0 z-50 flex items-center justify-center bg-[#0a0a0a]/40 backdrop-blur-sm transition-opacity p-4'>
            <div className='relative w-full max-w-[400px] p-6 sm:p-8 bg-white dark:bg-[#1a1a1a] shadow-2xl rounded-2xl border border-gray-200 dark:border-neutral-800 animate-in zoom-in-95 duration-200'>
                <button 
                    title="close" 
                    className="absolute p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors rounded-md hover:bg-gray-100 dark:hover:bg-neutral-800 top-4 right-4 outline-none" 
                    onClick={onClose} 
                    aria-label="Close" 
                >
                    <X className="w-4 h-4" />
                </button>
                
                <div className="flex flex-col items-center text-center mb-6 mt-2">
                    <div className="w-12 h-12 bg-green-50 dark:bg-green-500/10 rounded-full flex items-center justify-center mb-4 border border-green-100 dark:border-green-500/20">
                        <svg className="w-6 h-6 text-green-600 dark:text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Verify Your Email</h2>
                    <p className="text-sm text-gray-500 dark:text-neutral-400 mt-2 leading-relaxed">
                        We've sent a verification code to your email. Please enter the OTP to continue.
                    </p>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handelSubmit() }} className='flex flex-col space-y-5'>
                    <div className='space-y-2'>
                        <label className="text-sm font-medium text-gray-700 dark:text-neutral-300">One-Time Password</label>
                        <input 
                            type="text" 
                            className="w-full h-11 px-4 text-center tracking-widest text-lg font-semibold bg-transparent border rounded-lg border-gray-200 dark:border-neutral-800 dark:text-white placeholder:font-normal placeholder:tracking-normal placeholder:text-gray-400 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all outline-none" 
                            placeholder='• • • • • •' 
                            required 
                            maxLength={6}
                            onChange={(e) => setOTP(e.target.value)} 
                        />
                    </div>
                    <button 
                        type='submit' 
                        disabled={loading || OTP.length < 4}
                        className='w-full h-11 flex items-center justify-center px-4 font-medium text-white transition-all bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] shadow-sm'
                    >
                        {loading ? <Loader title='Verifying...' /> : "Verify Email"}
                    </button>
                </form>
            </div >
        </section >
    )
}

export default VerifyEmailModal