"use client"

import { useUserStore } from "@/store/UserStore"
import { ListCollapse, LogOut, MoonStar, Search, ShoppingCart, Sun, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import axios from "axios"
import { useQuery } from "@tanstack/react-query"
import { userProps } from "@/interfaces/commonInterfaces"


export const Navbar = () => {
    const { data, logOut, clearUser } = useUserStore() as {
        data: userProps;
        logOut: () => void;
        clearUser: () => void;
    };
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
        try {
            const response = await axios.post('/api/becomeSeller', { sellerId, email, isEmailVerified, avatar })

            if (response.data.data) {
                toast.success("Your request is being reviewed");
                toast.success("Will get back to you shortly");
            } else {
                toast.error("Failed to send request to Admin")
            }

        } catch (error) {
            toast.error("Failed to send request to Admin")
            console.log("Error sending req to superAdmin", error)
        }
    }

    const cartOwnerId = data?._id;

    async function getCartItems() {
        try {
            const response = await axios.get(`../../api/getCart/${cartOwnerId}`);
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
            const response = await axios.get('/api/sessionCookies');
            if (!response.data?.user) {
                clearUser();
            } else {
                toast.success("Logged In");
            }
        } catch (error) {
            console.error("Failed to authenticate the user validity");
        }
    }

    useEffect(() => {
        authenticationValidity();
    }, []);


    return (
        <section className='flex items-center justify-between py-5 border-b-[0.1px] dark:border-zinc-700 sticky top-0 z-20 backdrop-blur-md'>

            {/* Logo or name */}
            <div className='w-[10%] flex items-center justify-start'>
                <Link href={'/'} className="uppercase font-bold text-xl">
                    Ecomm_Store
                </Link>
            </div>

            {/* Search Bar */}
            <div className='w-[50%] flex items-center bg-white dark:bg-neutral-800 rounded-lg border dark:border-neutral-700 px-4 py-2'>
                <Search className="w-5 h-5 text-gray-400 mr-2" />
                <input
                    type="text"
                    placeholder="Search For Plants Decoratables And More"
                    className="w-full bg-transparent outline-none text-gray-700 dark:text-white"
                />
            </div>

            {/* Account details ,Orders and Cart */}
            <div className='w-[30%] flex items-center justify-center gap-4'>
                {dataLength !== 0 && data.isSeller ?
                    <Link href={'/dashboard'} className="dark:text-neutral-300">
                        Dashboard
                    </Link> :
                    <button onClick={handelBecomeSeller}>Become Seller</button>}
                <Link href={'/orders'} className="dark:text-neutral-300">Orders</Link>
                <Link href={'/stores'} className="dark:text-neutral-300">Stores</Link>
                <div className="text-neutral-300 group relative flex items-center justify-center">
                    <span>
                        {dataLength !== 0 && data?.avatar?.length > 3 ? < Image src={data.avatar || ''} height={500} width={500} alt="Profile-Img" className="h-10 w-10 object-cover rounded-full border border-neutral-800" title={data.name} /> : <Link href={'/login'} className="text-[#1a1a1a] dark:text-slate-300">Login</Link>}
                    </span>
                    <div className={` absolute top-10  w-fit hidden group-hover:block py-1
                    ${dataLength !== 0 && data.email.length <= 0 ? "group-hover:hidden" : "block"} 
                    ${dataLength === 0 ? "group-hover:hidden" : "block"}`}>
                        <div className="border-b-[0.1px]  dark:bg-white/5 bg-slate-300/1 rounded border dark:border-zinc-700 p-2">
                            <li className="py-1 flex items-center justify-start gap-2 hover:bg-gray-100 dark:hover:bg-[#5a5a5a] px-2 rounded">
                                <User className="text-[#1a1a1a] dark:text-slate-200 h-5 w-5" />
                                <h1 className="capitalize text-[#5a5a5a] dark:text-[#ededed]">{dataLength !== 0 && data?.name.split(" ")[0]}</h1>
                            </li>
                            <Link href={'/profile'} className="py-1 flex items-center justify-start gap-2 hover:bg-gray-100 dark:hover:bg-[#5a5a5a] px-2 rounded text-[#1a1a1a] dark:text-slate-200"> <ListCollapse className="h-5 w-5" />Details</Link>
                            <div>
                                <button className="py-1 flex items-center justify-start gap-2 hover:bg-gray-100 dark:hover:bg-[#5a5a5a] px-2 rounded text-[#1a1a1a] dark:text-slate-200" onClick={() => { handelLogout() }}>
                                    <LogOut className="h-5 w-5" />
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <Link href={'/cart'} className="text-neutral-300 relative">
                    <span className="absolute -top-2.5 right-0 px-1 text-[10px] font-normal bg-red-500 text-white rounded-full">{dataLength !== 0 ? `${userCart?.cartItems?.length === undefined ? 0 : userCart?.cartItems?.length}` : "?"}</span>
                    <ShoppingCart className="h-6 w-6 text-slate-700 dark:text-slate-200" />
                </Link>
                <button onClick={toogleTheme}>
                    {dark ?
                        <MoonStar className="h-6 w-6 text-slate-700 dark:text-slate-200" />
                        :
                        <Sun className="h-7 w-7 text-slate-700 dark:text-slate-200" />
                    }
                </button>
            </div>
        </section >
    )
}
