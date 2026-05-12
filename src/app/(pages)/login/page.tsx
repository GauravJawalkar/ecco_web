"use client"

import Loader from '@/components/Loaders/Loader';
import { useUserStore } from '@/store/UserStore';
import { Eye, EyeClosed } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
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
        <section className='flex items-center justify-center min-h-screen p-4 bg-gray-50/50 dark:bg-[#1a1a1a] '>
            <div className='w-full max-w-[440px] flex flex-col px-6 py-8 sm:px-10 sm:py-10 bg-white dark:bg-neutral-900/50 border border-gray-200 dark:border-neutral-800/60 rounded-[28px] shadow-sm dark:shadow-2xl backdrop-blur-xl'>
                <div className="mb-8 text-center">
                    <h1 className='text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight'>Welcome back</h1>
                    <p className="text-gray-500 dark:text-neutral-400 mt-2 text-[13px] sm:text-sm">Enter your details to access your account.</p>
                </div>

                <div className='w-full'>
                    <button className='flex items-center justify-center w-full gap-3 px-4 h-12 text-[13px] sm:text-sm font-medium text-gray-700 dark:text-neutral-200 bg-white dark:bg-neutral-800/80 border border-gray-200 dark:border-neutral-700/80 rounded-2xl hover:bg-gray-50 dark:hover:bg-neutral-700/50 active:scale-[0.98] transition-all shadow-sm'
                        onClick={handelGoogleLogin}>
                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" className='w-5 h-5' viewBox="0 0 48 48">
                            <path fill="#fbc02d" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12	s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20	s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#e53935" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039	l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4caf50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36	c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1565c0" d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571	c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                        </svg>
                        <span>Continue with Google</span>
                    </button>
                </div>

                <div className="flex items-center w-full py-6">
                    <div className="flex-grow h-px bg-gray-100 dark:bg-neutral-800"></div>
                    <span className="px-4 text-[11px] text-gray-400 dark:text-neutral-500 font-semibold uppercase tracking-widest">or</span>
                    <div className="flex-grow h-px bg-gray-100 dark:bg-neutral-800"></div>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handelSubmit() }} className='flex flex-col w-full gap-5'>
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
                        <div className="flex justify-between items-center ml-1">
                            <label className='text-[13px] font-medium text-gray-700 dark:text-neutral-300'>Password</label>
                        </div>
                        <div className="relative w-full">
                            <input
                                type={showPassword ? "text" : "password"}
                                className='w-full h-12 pl-4 pr-12 text-[15px] text-gray-900 dark:text-white bg-gray-50/50 dark:bg-neutral-800/40 border border-gray-200 dark:border-neutral-700/60 rounded-2xl placeholder:text-gray-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-4 focus:ring-black/5 dark:focus:ring-white/5 focus:border-gray-400 dark:focus:border-neutral-500 transition-all'
                                placeholder='Enter your password'
                                required
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-neutral-300 transition-colors outline-none rounded-xl hover:bg-gray-100 dark:hover:bg-neutral-700/50 touch-manipulation">
                                {showPassword ? <Eye size={18} strokeWidth={1.5} /> : <EyeClosed size={18} strokeWidth={1.5} />}
                            </button>
                        </div>
                        <div className='flex justify-end pt-1 pr-1'>
                            <Link href={'/forgot-password'} className='text-[12px] font-medium text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white transition-colors'>
                                Forgot your password?
                            </Link>
                        </div>
                    </div>

                    <button type='submit' className='w-full h-12 mt-4 bg-green-700 dark:bg-white text-white dark:text-gray-900 font-medium rounded-2xl text-[15px] hover:bg-green-800 dark:hover:bg-gray-100 active:scale-[0.98] transition-all flex items-center justify-center shadow-md shadow-gray-900/10 dark:shadow-white/5'>
                        {loading ? <Loader title='Signing in...' /> : "Sign in"}
                    </button>
                </form>

                <div className='mt-8 text-center text-[13px] sm:text-sm text-gray-500 dark:text-neutral-400'>
                    Don't have an account? <Link href={'/signup'} className='font-semibold text-gray-900 dark:text-white hover:underline decoration-gray-300 dark:decoration-neutral-600 underline-offset-4 transition-all ml-1'>Sign up</Link>
                </div>
            </div>
        </section>
    )
}

export default Login