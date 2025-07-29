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
                <div className="relative w-full h-40 md:h-48 overflow-hidden">
                    <Image
                        height={1000}
                        width={1000}
                        src={store.storeCoverImage || 'https://via.placeholder.com/800x400?text=Store+Cover'}
                        alt="Store Cover"
                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                {/* Store Logo Container - Now properly positioned */}
                <div className="px-4 -mt-12 z-10">
                    <div className="relative w-20 h-20 rounded-xl border-2 border-green-400 dark:border-neutral-700 shadow-lg bg-white dark:bg-neutral-800">
                        <Image
                            height={1000}
                            width={1000}
                            src={store.storeImage || 'https://via.placeholder.com/150?text=Store'}
                            alt="Store Logo"
                            className="w-full h-full object-cover overflow-hidden rounded-xl"
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
                <div className="py-5 pb-5 px-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white truncate">
                                {store?.storeName}
                            </h2>
                            <div className="flex items-center mt-1">
                                <div className="flex items-center">
                                    <StarIcon className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                    <span className="ml-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                                        {store?.rating || '4.8'}
                                    </span>
                                    <span className="mx-1 text-gray-400">•</span>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        {store?.reviewCount || '128'} reviews
                                    </span>
                                </div>
                            </div>
                        </div>

                        {store && (
                            <span className={`px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`}>
                                Live Now
                            </span>
                        )}
                    </div>

                    <p className="mt-3 text-gray-600 dark:text-gray-300 line-clamp-2 text-sm">
                        {store?.storeDescription || 'Discover amazing products at this store.'}
                    </p>

                    <div className="mt-4 pt-3 border-t border-gray-100 dark:border-neutral-700 flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <MapPin className="w-4 h-4 mr-1" />
                            <span>{store?.location || '1.2 miles away'}</span>
                        </div>

                        <Link href={`/stores/${slugify(store?.storeName)}?id=${store?._id}`} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center">
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