"use client"

import { Box, Home, Info, LayoutDashboard, LayoutGrid, LogOut, ShoppingCart, Store, User } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useUserStore } from "@/store/UserStore"
import { useQuery } from "@tanstack/react-query"
import ApiClient from "@/interceptors/ApiClient"
import { userProps } from "@/interfaces/commonInterfaces"
import { useState } from "react"
import toast from "react-hot-toast"

interface UserStoreProps {
    data: userProps;
    logOut: () => void;
}

export const BottomNav = () => {
    const pathname = usePathname();
    const router = useRouter();
    const { data, logOut } = useUserStore() as UserStoreProps;
    const [showAccountMenu, setShowAccountMenu] = useState(false);

    const cartOwnerId = data?._id;

    async function getCartItems() {
        try {
            const response = await ApiClient.get(`/api/getCart/${cartOwnerId}`);
            if (response.data?.data) {
                return response.data.data;
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

    const dataLength = data ? Object.keys(data).length : 0;
    const cartCount = dataLength !== 0 ? (userCart?.cartItems?.length || 0) : 0;

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

    const navItems = [
        { name: 'Home', href: '/', icon: Home },
        { name: 'Products', href: '/products', icon: LayoutGrid },
        { name: 'Stores', href: '/stores', icon: Store },
        { name: 'Cart', href: '/cart', icon: ShoppingCart, badge: cartCount },
        { name: 'Account', href: dataLength !== 0 ? '/profile' : '/login', icon: User, isMenu: true },
    ];

    return (
        <>
            {/* Overlay for Account Menu (moved outside nav to catch clicks properly) */}
            {showAccountMenu && (
                <div
                    className="fixed inset-0 z-40 bg-black/5 dark:bg-black/40 backdrop-blur-sm transition-opacity"
                    onClick={() => setShowAccountMenu(false)}
                ></div>
            )}

            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border-t border-gray-200 dark:border-neutral-800 pb-[env(safe-area-inset-bottom)]">
                <div className="flex items-center justify-around px-2 h-16 relative">
                    {navItems.map((item) => {
                        const isActive = item.isMenu
                            ? showAccountMenu || pathname === '/profile' || pathname === '/orders' || pathname === '/dashboard'
                            : pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
                        const Icon = item.icon;

                        const Content = (
                            <>
                                <div className={`relative flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${isActive ? 'bg-black/5 dark:bg-white/10' : 'bg-transparent'}`}>
                                    <Icon
                                        className={`w-5 h-5 transition-colors duration-300 ${isActive
                                            ? 'text-black dark:text-white fill-black/10 dark:fill-white/10'
                                            : 'text-gray-500 dark:text-neutral-400'
                                            }`}
                                    />
                                    {item.badge !== undefined && item.badge > 0 && (
                                        <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[16px] h-4 px-1 text-[9px] font-bold text-white dark:text-white bg-green-600 dark:bg-green-600 rounded-full ring-2 ring-white dark:ring-neutral-900">
                                            {item.badge > 99 ? '99+' : item.badge}
                                        </span>
                                    )}
                                </div>
                                <span className={`text-[10px] font-medium transition-colors duration-300 ${isActive ? 'text-black dark:text-white' : 'text-gray-500 dark:text-neutral-400'
                                    }`}>
                                    {item.name}
                                </span>
                            </>
                        );

                        if (item.isMenu) {
                            return (
                                <div key={item.name} className="relative flex flex-col items-center justify-center w-full h-full space-y-1 min-w-[44px] min-h-[44px] touch-manipulation">
                                    <button
                                        onClick={() => setShowAccountMenu(!showAccountMenu)}
                                        className="relative flex flex-col items-center justify-center w-full h-full space-y-1 outline-none"
                                    >
                                        {Content}
                                    </button>

                                    {/* Dropup Menu - Sleek & Compact */}
                                    {showAccountMenu && (
                                        <div className="absolute bottom-[calc(100%+16px)] right-0 sm:-right-4 w-[140px] bg-white/95 dark:bg-neutral-900/95 backdrop-blur-2xl border border-black/[0.04] dark:border-white/[0.05] rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] z-50 origin-bottom-right animate-in zoom-in-95 fade-in duration-200">
                                            <div className="flex flex-col p-1.5">
                                                {dataLength === 0 ? (
                                                    <Link href="/login" onClick={() => setShowAccountMenu(false)} className="flex items-center gap-3 px-3 py-2.5 text-[13px] font-medium text-gray-700 dark:text-neutral-200 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-all">
                                                        <User className="w-4 h-4 text-gray-500 dark:text-neutral-400" strokeWidth={1.5} /> Login
                                                    </Link>
                                                ) : (
                                                    <>
                                                        <Link href="/profile" onClick={() => setShowAccountMenu(false)} className="flex items-center gap-3 px-3 py-2.5 text-[13px] font-medium text-gray-700 dark:text-neutral-200 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-all">
                                                            <Info className="w-4 h-4 text-gray-500 dark:text-neutral-400" strokeWidth={1.5} /> Profile
                                                        </Link>
                                                        <Link href="/orders" onClick={() => setShowAccountMenu(false)} className="flex items-center gap-3 px-3 py-2.5 text-[13px] font-medium text-gray-700 dark:text-neutral-200 hover:bg-black/5 dark:hover:bg-white/10 rounded-xl transition-all">
                                                            <Box className="w-4 h-4 text-gray-500 dark:text-neutral-400" strokeWidth={1.5} /> Orders
                                                        </Link>
                                                        {data?.isSeller ? (
                                                            <Link href="/dashboard" onClick={() => setShowAccountMenu(false)} className="flex items-center gap-3 px-3 py-2.5 text-[13px] font-medium text-gray-700 dark:text-neutral-200 hover:bg-black/5 dark:hover:bg-white/10 rounded-xl transition-all">
                                                                <LayoutDashboard className="w-4 h-4 text-gray-500 dark:text-neutral-400" strokeWidth={1.5} /> Dashboard
                                                            </Link>
                                                        ) : (
                                                            <button onClick={() => { setShowAccountMenu(false); handelBecomeSeller(); }} className="w-full flex items-center gap-3 px-3 py-2.5 text-[13px] font-medium text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-xl transition-all">
                                                                <Store className="w-4 h-4" strokeWidth={1.5} /> Become Seller
                                                            </button>
                                                        )}
                                                        <div className="bg-black/5 dark:bg-white/5 mx-2"></div>
                                                        <button
                                                            onClick={() => {
                                                                setShowAccountMenu(false);
                                                                handelLogout();
                                                            }}
                                                            className="w-full flex items-center gap-3 px-3 py-2.5 text-[13px] font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all">
                                                            <LogOut className="w-4 h-4" strokeWidth={1.5} /> Logout
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )
                        }

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="relative flex flex-col items-center justify-center w-full h-full space-y-1 min-w-[44px] min-h-[44px] touch-manipulation outline-none"
                            >
                                {Content}
                            </Link>
                        )
                    })}
                </div>
            </nav>
        </>
    )
}
