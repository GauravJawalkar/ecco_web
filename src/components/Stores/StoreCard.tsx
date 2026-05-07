import { LocateIcon, StarIcon, ShoppingBag, LocateOffIcon, MapPin } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import Loader from '../Loaders/Loader';
import Link from 'next/link';

interface StoreProps {
    _id: string;
    storeName: string;
    storeImage?: string;
    storeCoverImage?: string;
    storeDescription?: string;
    isOpen?: boolean;
    rating?: number;
    reviewCount?: number;
    category?: string;
    location?: string;
}

const StoreCard = ({ store }: { store: StoreProps }) => {
    const slugify = (name: string) => name.toLowerCase().replace(/\s+/g, '-');
    return (
        <>
            <div className="group bg-white dark:bg-neutral-800 rounded-2xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-200 dark:border-neutral-700">
                {/* Cover Image with gradient overlay */}
                <div className="relative w-full h-32 sm:h-40 lg:h-48 overflow-hidden">
                    <Image
                        height={1000}
                        width={1000}
                        sizes="(max-width: 480px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        src={store.storeCoverImage || 'https://via.placeholder.com/800x400?text=Store+Cover'}
                        alt="Store Cover"
                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                {/* Store Logo Container - Now properly positioned */}
                <div className="px-4 sm:px-5 -mt-10 sm:-mt-12 z-10">
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl border-2 border-green-400 dark:border-neutral-700 shadow-lg bg-white dark:bg-neutral-800 flex-shrink-0">
                        <Image
                            height={1000}
                            width={1000}
                            sizes="(max-width: 480px) 64px, 80px"
                            src={store.storeImage || 'https://via.placeholder.com/150?text=Store'}
                            alt="Store Logo"
                            className="w-full h-full object-cover overflow-hidden rounded-lg sm:rounded-xl"
                        />
                        {store && (
                            <div className="absolute -top-2 -right-2 bg-green-500 dark:bg-green-600 rounded-full p-1 overflow-hidden">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                        )}
                    </div>
                </div>

                {/* Store Info - Added padding top to accommodate the store image */}
                <div className="pt-3 sm:pt-5 pb-4 sm:pb-5 px-4 sm:px-5">
                    <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0 flex-1">
                            <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white truncate">
                                {store?.storeName}
                            </h2>
                            <div className="flex items-center mt-1 sm:mt-1.5 flex-wrap gap-y-1">
                                <div className="flex items-center">
                                    <StarIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-400 fill-yellow-400" />
                                    <span className="ml-1 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                                        {store?.rating || '4.8'}
                                    </span>
                                    <span className="mx-1.5 text-gray-400">•</span>
                                    <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                                        {store?.reviewCount || '128'} reviews
                                    </span>
                                </div>
                            </div>
                        </div>

                        {store && (
                            <span className={`px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 whitespace-nowrap flex-shrink-0 mt-0.5`}>
                                Live Now
                            </span>
                        )}
                    </div>

                    <p className="mt-2 sm:mt-3 text-gray-600 dark:text-gray-300 line-clamp-2 text-xs sm:text-sm sm:leading-relaxed">
                        {store?.storeDescription || 'Discover amazing products at this store.'}
                    </p>

                    <div className="mt-4 pt-3 sm:pt-4 border-t border-gray-100 dark:border-neutral-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
                        <div className="flex items-center text-xs sm:text-sm text-gray-500 dark:text-gray-400 w-full sm:w-auto truncate">
                            <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 flex-shrink-0" />
                            <span className="truncate">{store?.location || '1.2 miles away'}</span>
                        </div>

                        <Link href={`/stores/${slugify(store?.storeName)}?id=${store?._id}`} className="w-full sm:w-auto px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center touch-manipulation shadow-sm">
                            <ShoppingBag className="w-4 h-4 mr-2" />
                            Visit Store
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default StoreCard;