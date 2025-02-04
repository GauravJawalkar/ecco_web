"use client"

import axios from "axios"
import { ListCollapse, LogOut, MoonStar, ShoppingCart, Sun, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

const Navbar = () => {

    const [userName, setUserName] = useState("");
    const [userAvatar, setUserAvatar] = useState("");
    const [isSeller, setIsSeller] = useState(false);
    const [dark, setDark] = useState(false);
    const [email, setEmail] = useState("");
    const [cookie, setCookie] = useState("");

    (async () => {
        const response = await axios.get('/api/sessionCookies');
        return setCookie(response.data.user);
    })();

    async function getProfile() {
        const response: any = await axios.get('/api/logInDetails');
        if (!response) {
            return new Error("Failed to fetch your data")
        }
        const loggedUser = [response.data.user];
        setUserName(loggedUser[0]?.name);
        setUserAvatar(loggedUser[0]?.avatar);
        setIsSeller(loggedUser[0]?.isSeller)
        setEmail(loggedUser[0]?.email);
    }

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
            const response = await axios.get('/api/logout');

            if (!response) {
                return toast.error("Unable to logout")
            }

            setUserName("");
            setUserAvatar("");
            setIsSeller(false);
            setEmail("");

            toast.success('Logged Out');
        } catch (error) {
            toast.error("Failed to logout the user")
            throw new Error('Error Logging out the user')
        }
    }

    useEffect(() => {
        getProfile();
    }, [])

    return (
        <section className='flex items-center justify-between py-5 border-b-[0.1px] dark:border-zinc-700'>

            {/* Logo or name */}
            <div className='w-[10%] flex items-center justify-start'>
                <Link href={'/'} className="uppercase font-bold text-xl">
                    Ecomm_Store
                </Link>
            </div>

            {/* Search Bar */}
            <div className='w-[55%]'>
                <input type="search" name="" id="" className='w-full py-2 px-4 rounded border-2' placeholder='Search For Plants Decoratables And More' />
            </div>

            {/* Account details ,Orders and Cart */}
            <div className='w-[25%] flex items-center justify-center gap-5'>
                {isSeller ? <Link href={'/'} className="dark:text-neutral-300">Dashboard</Link> : "Become Seller"}
                <Link href={'/orders'} className="dark:text-neutral-300">Orders</Link>
                <div className="text-neutral-300 group relative flex items-center justify-center">
                    <span>
                        {userAvatar.length > 3 ? < Image src={userAvatar} height={10} width={10} alt="Pro-Img" className="h-10 w-10 object-contain rounded-full border border-neutral-800" title={userName} /> : <Link href={'/login'} className="text-[#1a1a1a] dark:text-slate-300">Login</Link>}
                    </span>
                    <div className={`inset-0 absolute top-10 w-fit hidden group-hover:block ${email.length <= 0 ? "group-hover:hidden" : "block"}`}>
                        <div className="border-b-[0.1px] backdrop-blur-md dark:bg-white/5 bg-slate-300/1 rounded border dark:border-zinc-700 p-2">
                            <li className="py-1 flex items-center justify-start gap-2 hover:bg-gray-100 dark:hover:bg-[#5a5a5a] px-2 rounded">
                                <User className="text-[#1a1a1a] dark:text-slate-200 h-5 w-5" />
                                <h1 className="capitalize text-[#5a5a5a] dark:text-[#ededed]">{userName.split(" ")[0]}</h1>
                            </li>
                            <Link href={'/profile'} className="py-1 flex items-center justify-start gap-2 hover:bg-gray-100 dark:hover:bg-[#5a5a5a] px-2 rounded text-[#1a1a1a] dark:text-slate-200"> <ListCollapse className="h-5 w-5" />Details</Link>
                            <div>
                                <p>{ }</p>
                                <button className="py-1 flex items-center justify-start gap-2 hover:bg-gray-100 dark:hover:bg-[#5a5a5a] px-2 rounded text-[#1a1a1a] dark:text-slate-200" onClick={() => { handelLogout() }}>
                                    <LogOut className="h-5 w-5" />
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <Link href={'/cart'} className="text-neutral-300 relative">
                    <span className="absolute -top-3 right-0 px-1 text-xs font-normal bg-red-500 text-white rounded-full">{email.length <= 0 ? "?" : 9}</span>
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

export default Navbar