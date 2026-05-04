"use client"

import { Home, LayoutGrid, ShoppingCart, Store, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useUserStore } from "@/store/UserStore"
import { useQuery } from "@tanstack/react-query"
import ApiClient from "@/interceptors/ApiClient"
import { userProps } from "@/interfaces/commonInterfaces"

interface UserStoreProps {
    data: userProps;
}

export const BottomNav = () => {
    const pathname = usePathname();
    const { data } = useUserStore() as UserStoreProps;

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

    const navItems = [
        { name: 'Home', href: '/', icon: Home },
        { name: 'Products', href: '/products', icon: LayoutGrid },
        { name: 'Stores', href: '/stores', icon: Store },
        { name: 'Cart', href: '/cart', icon: ShoppingCart, badge: cartCount },
        { name: 'Profile', href: dataLength !== 0 ? '/profile' : '/login', icon: User },
    ];

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border-t border-gray-200 dark:border-neutral-800 pb-[env(safe-area-inset-bottom)]">
            <div className="flex items-center justify-around px-2 h-16">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="relative flex flex-col items-center justify-center w-full h-full space-y-1 min-w-[44px] min-h-[44px] touch-manipulation"
                        >
                            <div className={`relative flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${isActive ? 'bg-black/5 dark:bg-white/10' : 'bg-transparent'}`}>
                                <Icon
                                    className={`w-5 h-5 transition-colors duration-300 ${isActive
                                        ? 'text-black dark:text-white fill-black/10 dark:fill-white/10'
                                        : 'text-gray-500 dark:text-neutral-400'
                                        }`}
                                />
                                {item.badge !== undefined && item.badge > 0 && (
                                    <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[16px] h-4 px-1 text-[9px] font-bold text-white dark:text-black bg-black dark:bg-white rounded-full ring-2 ring-white dark:ring-neutral-900">
                                        {item.badge > 99 ? '99+' : item.badge}
                                    </span>
                                )}
                            </div>
                            <span className={`text-[10px] font-medium transition-colors duration-300 ${isActive ? 'text-black dark:text-white' : 'text-gray-500 dark:text-neutral-400'
                                }`}>
                                {item.name}
                            </span>
                        </Link>
                    )
                })}
            </div>
        </nav>
    )
}
