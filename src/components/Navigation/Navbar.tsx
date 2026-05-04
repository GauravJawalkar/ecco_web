"use client"

import { useUserStore } from "@/store/UserStore"
import { Box, Info, LogOut, MoonStar, Search, ShoppingCart, Sun, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import toast from "react-hot-toast"
import { useQuery } from "@tanstack/react-query"
import { userProps } from "@/interfaces/commonInterfaces"
import ApiClient from "@/interceptors/ApiClient"

interface UserStoreProps {
    data: userProps;
    logOut: () => void;
    clearUser: () => void;
    setUser: (user: userProps) => void;
}

export const Navbar = () => {
    const { data, logOut, setUser } = useUserStore() as UserStoreProps;

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

    return (
        <section className="flex flex-col md:flex-row items-center justify-between pt-[env(safe-area-inset-top)] px-4 sm:px-6 lg:px-8 py-4 md:py-5 border-b border-gray-200 dark:border-zinc-800 bg-white/80 dark:bg-neutral-900/80 sticky top-0 z-30 backdrop-blur-xl gap-4 md:gap-0 transition-colors">

            {/* Logo and Mobile Theme Toggle */}
            <div className="w-full md:w-auto md:min-w-[10%] flex items-center justify-between md:justify-start gap-4 pt-4 md:pt-0">
                <Link href={'/'} className="text-lg md:text-xl font-bold uppercase flex items-center min-h-[44px]">
                    Ecomm_Store
                </Link>
                <button
                    onClick={toogleTheme}
                    className="md:hidden flex items-center justify-center w-11 h-11 rounded-full bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors active:scale-95"
                    aria-label="Toggle Theme">
                    {dark ?
                        <MoonStar className="w-5 h-5 text-slate-700 dark:text-slate-200" />
                        :
                        <Sun className="w-5 h-5 text-slate-700 dark:text-slate-200" />
                    }
                </button>
            </div>

            {/* Search Bar */}
            <div className="w-full md:w-[50%] items-center bg-gray-100/80 dark:bg-neutral-800/80 rounded-full border border-transparent focus-within:border-gray-300 dark:focus-within:border-neutral-600 focus-within:bg-white dark:focus-within:bg-neutral-900 px-4 md:px-5 py-2.5 transition-all duration-300 hidden md:flex">
                <Search className="w-5 h-5 mr-3 text-gray-400 shrink-0" />
                <input
                    type="text"
                    placeholder="Search For Plants Decoratables And More"
                    className="w-full text-sm md:text-base text-gray-800 bg-transparent outline-none dark:text-neutral-100 placeholder:text-gray-500 dark:placeholder:text-neutral-400"
                />
            </div>

            {/* Account details ,Orders and Cart */}
            <div className='hidden md:flex w-[35%] items-center justify-center gap-4'>
                {dataLength !== 0 && data.isSeller ?
                    <Link href={'/dashboard'} className="dark:text-neutral-300 flex items-center min-h-[44px]">
                        Dashboard
                    </Link> :
                    <button onClick={handelBecomeSeller} className="dark:text-neutral-300 flex items-center min-h-[44px]">Become Seller</button>}
                <Link href={'/products'} className="dark:text-neutral-300 flex items-center min-h-[44px]">Products</Link>
                <Link href={'/stores'} className="dark:text-neutral-300 flex items-center min-h-[44px]">Stores</Link>
                <div className="relative flex items-center justify-center text-neutral-300 group">
                    <span className="flex items-center min-h-[44px]">
                        {dataLength !== 0 && data?.avatar?.length > 3 ? < Image src={data.avatar || ''} height={500} width={500} sizes="40px" alt="Profile-Img" className="object-cover w-10 h-10 border rounded-full border-neutral-800" title={data.name} /> : <Link href={'/login'} className="text-[#1a1a1a] dark:text-slate-300">Login</Link>}
                    </span>
                    <div className={`absolute top-10  w-fit hidden group-hover:block py-1 
                    ${dataLength !== 0 && data.email.length <= 0 ? "group-hover:hidden" : "block"} 
                    ${dataLength === 0 ? "group-hover:hidden" : "block"}`}>
                        <div className="border-b-[0.1px]  dark:bg-neutral-900 bg-white rounded border dark:border-zinc-700 p-2 text-[#1a1a1a] dark:text-slate-200">
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
                <Link href={'/cart'} className="relative text-neutral-300 flex items-center min-h-[44px]">
                    <span className="absolute top-1.5 -right-2 px-1 text-[10px] font-normal bg-red-500 text-white rounded-full">{dataLength !== 0 ? `${userCart?.cartItems?.length === undefined ? 0 : userCart?.cartItems?.length}` : "?"}</span>
                    <ShoppingCart className="w-6 h-6 text-slate-700 dark:text-slate-200" />
                </Link>
                <button onClick={toogleTheme} className="flex items-center justify-center min-h-[44px] min-w-[44px]">
                    {dark ?
                        <MoonStar className="w-6 h-6 text-slate-700 dark:text-slate-200" />
                        :
                        <Sun className="h-7 w-7 text-slate-700 dark:text-slate-200" />
                    }
                </button>
            </div>
        </section>
    )
}
