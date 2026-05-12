"use client"
import Loader from '@/components/Loaders/Loader';
import ApiClient from '@/interceptors/ApiClient';
import { useMutation } from '@tanstack/react-query';
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
    const [showPassword, setShowPassword] = useState(false);
    const [getOTP, setGetOTP] = useState(false);

    const handelSubmit = async () => {
        try {
            setLoading(true)
            const response = await ApiClient.post('/api/auth/resetPassword', { email, newPassword, OTP });
            if (response.data.data) {
                toast.success("Password Reset SuccessFully");
                setLoading(false)
                router.push('/login')
            }
        } catch (error) {
            toast.error("Error resetting password");
            console.log("Error resetting password : ", error);
            setLoading(false);
        }
    }

    async function getOtp() {
        if (email.trim() === "") {
            return;
        }
        try {
            const res = await ApiClient.post('/api/otpValidation', { email })
            if (res.data.data) {
                toast.success("Check email for OTP");
                setGetOTP(true);
            }
        } catch (error) {
            console.error("error sending OTP in", error)
        }
    }

    const handelOTPMutation = useMutation(
        {
            mutationFn: getOtp,
            onError: (error) => {
                toast.error("Something Went Wrong!");
                console.error(error);
            }
        }
    )

    const handelOTP = async () => {
        handelOTPMutation.mutate();
    }
    return (
        <section className='flex items-center justify-center min-h-screen p-4 bg-gray-50/50 dark:bg-[#1a1a1a]'>
            <div className='w-full max-w-[440px] flex flex-col px-6 py-8 sm:px-10 sm:py-10 bg-white dark:bg-neutral-900/50 border border-gray-200 dark:border-neutral-800/60 rounded-[28px] shadow-sm dark:shadow-2xl backdrop-blur-xl'>
                <div className="mb-8 text-center">
                    <h1 className='text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight'>Reset Password</h1>
                    <p className="text-gray-500 dark:text-neutral-400 mt-2 text-[13px] sm:text-sm">
                        {!getOTP ? "Enter your email to receive a One Time Password." : "Enter your OTP and choose a new password."}
                    </p>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handelSubmit() }} className='flex flex-col w-full gap-5'>

                    <div className='flex flex-col space-y-2'>
                        <label className='text-[13px] font-medium text-gray-700 dark:text-neutral-300 ml-1'>Registered Email</label>
                        <input
                            type="email"
                            className='w-full h-12 px-4 text-[15px] text-gray-900 dark:text-white bg-gray-50/50 dark:bg-neutral-800/40 border border-gray-200 dark:border-neutral-700/60 rounded-2xl placeholder:text-gray-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-4 focus:ring-black/5 dark:focus:ring-white/5 focus:border-gray-400 dark:focus:border-neutral-500 transition-all'
                            placeholder='name@example.com'
                            required
                            readOnly={getOTP}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    {getOTP && (
                        <div className='flex flex-col space-y-2 animate-in fade-in slide-in-from-top-4 duration-300'>
                            <label className='text-[13px] font-medium text-gray-700 dark:text-neutral-300 ml-1'>OTP</label>
                            <input
                                type="text"
                                className='w-full h-12 px-4 text-[15px] tracking-widest text-gray-900 dark:text-white bg-gray-50/50 dark:bg-neutral-800/40 border border-gray-200 dark:border-neutral-700/60 rounded-2xl placeholder:text-gray-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-4 focus:ring-black/5 dark:focus:ring-white/5 focus:border-gray-400 dark:focus:border-neutral-500 transition-all'
                                placeholder='••••••'
                                required
                                onChange={(e) => setOTP(e.target.value)}
                            />
                        </div>
                    )}

                    {getOTP && (
                        <div className='flex flex-col space-y-2 relative animate-in fade-in slide-in-from-top-4 duration-300'>
                            <label className='text-[13px] font-medium text-gray-700 dark:text-neutral-300 ml-1'>New Password</label>
                            <div className="relative w-full">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className='w-full h-12 pl-4 pr-12 text-[15px] text-gray-900 dark:text-white bg-gray-50/50 dark:bg-neutral-800/40 border border-gray-200 dark:border-neutral-700/60 rounded-2xl placeholder:text-gray-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-4 focus:ring-black/5 dark:focus:ring-white/5 focus:border-gray-400 dark:focus:border-neutral-500 transition-all'
                                    placeholder='Create a new password'
                                    required
                                    onChange={(e) => setnewPassword(e.target.value)}
                                />
                                <button
                                    type='button'
                                    onClick={() => { setShowPassword(!showPassword) }}
                                    className='absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-neutral-300 transition-colors outline-none rounded-xl hover:bg-gray-100 dark:hover:bg-neutral-700/50 touch-manipulation'>
                                    {showPassword ? <Eye size={18} strokeWidth={1.5} /> : <EyeClosed size={18} strokeWidth={1.5} />}
                                </button>
                            </div>
                        </div>
                    )}

                    <button
                        type={getOTP ? 'submit' : 'button'}
                        onClick={!getOTP ? (e) => { e.preventDefault(); e.stopPropagation(); handelOTP() } : undefined}
                        className='w-full h-12 mt-4 bg-green-700 dark:bg-white text-white dark:text-gray-900 font-medium rounded-2xl text-[15px] hover:bg-green-800 dark:hover:bg-gray-200 active:scale-[0.98] transition-all flex items-center justify-center shadow-md shadow-gray-900/10 dark:shadow-white/5'>
                        {getOTP ? (
                            loading ? <Loader title='Setting...' /> : "Reset Password"
                        ) : (
                            handelOTPMutation.isPending ? <Loader title='Sending OTP...' /> : "Get OTP"
                        )}
                    </button>
                </form>
            </div>
        </section>
    )
}

export default ForgotPassword