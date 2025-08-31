"use client"

import { useUserStore } from "@/store/UserStore"
import { Box, Info, LogOut, MoonStar, Search, ShoppingCart, Sun, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import axios from "axios"
import { useQuery } from "@tanstack/react-query"
import { userProps } from "@/interfaces/commonInterfaces"
import ApiClient from "@/interceptors/ApiClient"

interface UserStoreProps {
    data: userProps;
    logOut: () => void;
    clearUser: () => void;
}

export const Navbar = () => {
    const { data, logOut, clearUser } = useUserStore() as UserStoreProps
    const [dark, setDark] = useState(false);
    const router = useRouter();

    const dataLength = Object.keys(data).length

    const toogleTheme = () => {
        if (document.body.classList.contains('dark')) {
            document.body.classList.remove('dark');
            setDark(false)
        } else {
            document.body.classList.add('dark');
            setDark(true)
        }
    }

    const handelLogout = async () => {
        try {
            logOut();
            router.push('/login')
            toast.success('Logged Out');
            localStorage.removeItem('userLogin');

        } catch (error) {
            toast.error("Failed to logout the user")
            throw new Error('Error Logging out the user')
        }
    }

    const handelBecomeSeller = async () => {
        const sellerId = data?._id;
        const email = data?.email;
        const isEmailVerified = data?.isEmailVerified;
        const avatar = data?.avatar;
        if (!data?._id) {
            toast.error("Please Login");
            return router.push('/login');
        }
        try {
            const response = await ApiClient.post('/api/becomeSeller', { sellerId, email, isEmailVerified, avatar })

            if (response.data?.data) {
                toast.success("Your request is being reviewed");
                setTimeout(() => {
                    toast.success("Will get back to you shortly");
                }, 2000);
            } else {
                toast.error("Failed to send request to Admin")
            }

        } catch (error) {
            toast.error("Failed to send request to Admin")
            console.error("Error sending req to superAdmin", error)
        }
    }

    const cartOwnerId = data?._id;

    async function getCartItems() {
        try {
            const response = await ApiClient.get(`/api/getCart/${cartOwnerId}`);
            if (response.data.data) {
                return response.data.data
            }
            return [];
        } catch (error) {
            console.error("Error getting the cart details :", error);
            return [];
        }
    }

    const { data: userCart = [] } = useQuery({
        queryFn: getCartItems,
        queryKey: ['userCart', cartOwnerId],
        enabled: !!cartOwnerId,
        refetchOnWindowFocus: false,
    });

    async function authenticationValidity() {
        try {
            const response = await ApiClient.get('/api/sessionCookies');
            if (!response.data?.user) {
                return clearUser();
            } else {
                return toast.success("Authenticated");
            }
        } catch (error) {
            return console.error("Failed to authenticate the user validity", error);
        }
    }

    useEffect(() => {
        authenticationValidity();
    }, [])

    return (
        <section className='flex items-center justify-between py-5 border-b-[0.1px] dark:border-zinc-700 sticky top-0 z-20 backdrop-blur-md'>

            {/* Logo or name */}
            <div className='w-[10%] flex items-center justify-start'>
                <Link href={'/'} className="text-xl font-bold uppercase">
                    Ecomm_Store
                </Link>
            </div>

            {/* Search Bar */}
            <div className='w-[50%] flex items-center bg-white dark:bg-neutral-800 rounded-lg border dark:border-neutral-700 px-4 py-2'>
                <Search className="w-5 h-5 mr-2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search For Plants Decoratables And More"
                    className="w-full text-gray-700 bg-transparent outline-none dark:text-white"
                />
            </div>

            {/* Account details ,Orders and Cart */}
            <div className='w-[30%] flex items-center justify-center gap-4'>
                {dataLength !== 0 && data.isSeller ?
                    <Link href={'/dashboard'} className="dark:text-neutral-300">
                        Dashboard
                    </Link> :
                    <button onClick={handelBecomeSeller}>Become Seller</button>}
                <Link href={'/products'} className="dark:text-neutral-300">Products</Link>
                <Link href={'/stores'} className="dark:text-neutral-300">Stores</Link>
                <div className="relative flex items-center justify-center text-neutral-300 group">
                    <span>
                        {dataLength !== 0 && data?.avatar?.length > 3 ? < Image src={data.avatar || ''} height={500} width={500} alt="Profile-Img" className="object-cover w-10 h-10 border rounded-full border-neutral-800" title={data.name} /> : <Link href={'/login'} className="text-[#1a1a1a] dark:text-slate-300">Login</Link>}
                    </span>
                    <div className={`absolute top-10  w-fit hidden group-hover:block py-1 
                    ${dataLength !== 0 && data.email.length <= 0 ? "group-hover:hidden" : "block"} 
                    ${dataLength === 0 ? "group-hover:hidden" : "block"}`}>
                        <div className="border-b-[0.1px]  dark:bg-neutral-900 bg-white rounded border dark:border-zinc-700 p-2">
                            <li className="py-1 flex items-center justify-start gap-2 hover:bg-gray-100 dark:hover:bg-[#5a5a5a] px-2 rounded">
                                <User className="text-[#1a1a1a] dark:text-slate-200 h-4 w-4" />
                                <h1 className="capitalize text-[#5a5a5a] dark:text-[#ededed] text-sm">{dataLength !== 0 && data?.name.split(" ")[0]}</h1>
                            </li>
                            <Link href={'/profile'} className="py-1 flex items-center justify-start gap-2 hover:bg-gray-100 dark:hover:bg-[#5a5a5a] px-2 rounded text-[#1a1a1a] dark:text-slate-200 text-sm"> <Info className="text-[#1a1a1a] dark:text-slate-200 h-4 w-4 text-sm" />Details</Link>
                            <Link href={'/orders'} className="py-1 flex items-center justify-start gap-2 hover:bg-gray-100 dark:hover:bg-[#5a5a5a] px-2 rounded text-[#1a1a1a] dark:text-slate-200 text-sm">
                                <Box className="w-4 h-4" />Orders</Link>
                            <div>
                                <button className="py-1 flex items-center justify-start gap-2 hover:bg-gray-100 dark:hover:bg-[#5a5a5a] px-2 rounded text-[#1a1a1a] dark:text-slate-200 text-sm" onClick={() => { handelLogout() }}>
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <Link href={'/cart'} className="relative text-neutral-300">
                    <span className="absolute -top-2.5 right-0 px-1 text-[10px] font-normal bg-red-500 text-white rounded-full">{dataLength !== 0 ? `${userCart?.cartItems?.length === undefined ? 0 : userCart?.cartItems?.length}` : "?"}</span>
                    <ShoppingCart className="w-6 h-6 text-slate-700 dark:text-slate-200" />
                </Link>
                <button onClick={toogleTheme}>
                    {dark ?
                        <MoonStar className="w-6 h-6 text-slate-700 dark:text-slate-200" />
                        :
                        <Sun className="h-7 w-7 text-slate-700 dark:text-slate-200" />
                    }
                </button>
            </div>
        </section >
    )
}
