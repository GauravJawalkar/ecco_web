import {
    Star, MapPin, Instagram, Facebook, Twitter,
    Calendar, ShoppingBag, Leaf, Heart, Phone, Clock, Tag, Shield
} from 'lucide-react';
import Image from 'next/image';

const StoreHero = ({ storeDetails }: any) => {
    return (
        <div className="relative overflow-hidden border rounded-b-lg dark:border-neutral-800 dark:bg-neutral-900/60">
            {/* Cover Image with Gradient Overlay */}
            <div className="relative h-48 sm:h-64 md:h-80 lg:h-96">
                <Image
                    height={1000}
                    width={1000}
                    sizes="(max-width: 480px) 100vw, (max-width: 1024px) 100vw, 100vw"
                    src={storeDetails?.storeCoverImage || "https://dummyimage.com/640x4:3"}
                    alt="Store Cover"
                    className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70" />

                {/* Floating Profile Card */}
                <div className="absolute z-10 left-4 sm:left-6 lg:left-8 -bottom-10 sm:-bottom-12 md:-bottom-16">
                    <div className="flex items-end gap-4">
                        <div className="relative group">
                            <Image
                                height={1000}
                                width={1000}
                                sizes="(max-width: 480px) 80px, (max-width: 768px) 96px, 128px"
                                src={storeDetails?.storeImage || "https://dummyimage.com/qvga"}
                                alt="Store Profile"
                                className="object-cover transition-transform duration-300 border-[3px] sm:border-4 border-white rounded-lg shadow-xl w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 dark:border-neutral-800 group-hover:scale-105 bg-white dark:bg-neutral-800"
                            />
                            <div className="absolute inset-0 transition-opacity duration-300 rounded-lg opacity-0 bg-black/20 group-hover:opacity-100" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Store Info Section */}
            <div className="px-4 sm:px-6 lg:px-8 pt-14 sm:pt-16 md:pt-20 pb-6 sm:pb-8">
                <div className="">
                    {/* Store Header with CTA */}
                    <div className="flex flex-col gap-5 sm:gap-6 lg:flex-row lg:justify-between lg:items-start">
                        <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
                                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                                    {storeDetails?.storeName}
                                </h1>
                                <div className="flex items-center gap-2 flex-wrap mt-1 sm:mt-0">
                                    <span className={`flex items-center gap-1 px-2.5 py-1 sm:py-0.5 text-[10px] sm:text-xs font-medium rounded-full ${storeDetails?.isOpen ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200" : "bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-200"}`}>
                                        <Clock className="w-3 h-3" />
                                        {storeDetails?.isOpen ? "Open Now" : "Closed"}
                                    </span>
                                    <span className="flex items-center gap-1 px-2.5 py-1 sm:py-0.5 text-[10px] sm:text-xs font-medium rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200">
                                        <Calendar className="w-3 h-3" />
                                        Est. {storeDetails?.createdAt ? new Date(storeDetails?.createdAt).toLocaleDateString() : "N/A"}
                                    </span>
                                </div>
                            </div>

                            <p className="max-w-3xl text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-2 sm:mt-0 leading-relaxed line-clamp-3 sm:line-clamp-none">
                                {storeDetails?.storeDescription}
                            </p>

                            {/* Store Stats */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 lg:gap-2 mt-5 sm:mt-6">
                                <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 lg:p-3 rounded-xl lg:rounded-lg bg-gray-50 dark:bg-neutral-800/80 border border-gray-100 dark:border-neutral-700/50">
                                    <div className="p-2 sm:p-2.5 lg:p-2 bg-white rounded-full shadow-sm dark:bg-neutral-700 flex-shrink-0">
                                        <Star className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 fill-amber-500" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Rating</p>
                                        <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white truncate">
                                            {storeDetails?.rating || 0} <span className="text-xs sm:text-sm font-normal text-gray-500 dark:text-gray-400">({storeDetails?.reviewCount || 0})</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 lg:p-3 rounded-xl lg:rounded-lg bg-gray-50 dark:bg-neutral-800/80 border border-gray-100 dark:border-neutral-700/50">
                                    <div className="p-2 sm:p-2.5 lg:p-2 bg-white rounded-full shadow-sm dark:bg-neutral-700 flex-shrink-0">
                                        <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Location</p>
                                        <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white truncate" title={storeDetails?.location}>
                                            {storeDetails?.location}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 lg:p-3 rounded-xl lg:rounded-lg bg-gray-50 dark:bg-neutral-800/80 border border-gray-100 dark:border-neutral-700/50">
                                    <div className="p-2 sm:p-2.5 lg:p-2 bg-white rounded-full shadow-sm dark:bg-neutral-700 flex-shrink-0">
                                        <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Returns</p>
                                        <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white truncate" title={storeDetails?.returnPolicy}>
                                            {storeDetails?.returnPolicy}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 lg:p-3 rounded-xl lg:rounded-lg bg-gray-50 dark:bg-neutral-800/80 border border-gray-100 dark:border-neutral-700/50">
                                    <div className="p-2 sm:p-2.5 lg:p-2 bg-white rounded-full shadow-sm dark:bg-neutral-700 flex-shrink-0">
                                        <Tag className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Shipping</p>
                                        <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white truncate" title={storeDetails?.shippingPolicy}>
                                            {storeDetails?.shippingPolicy}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-center gap-3 mt-6 lg:mt-0 min-w-[200px]">
                            <button className="flex items-center justify-center gap-1 w-full px-3 py-2 text-sm font-normal text-white transition-colors bg-green-600 rounded-full lg:rounded-lg hover:bg-green-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 touch-manipulation">
                                <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                Follow Store
                            </button>
                            <a href={`tel:+91${storeDetails?.contact}`} className="flex items-center justify-center gap-2 w-full px-3 py-2  text-sm font-normal text-gray-900 transition-colors bg-white border border-gray-300 rounded-full lg:rounded-lg hover:bg-gray-50 dark:bg-neutral-800 dark:text-white dark:border-neutral-700 dark:hover:bg-neutral-700 touch-manipulation">
                                <Phone className="w-4 h-4" />
                                {storeDetails?.contact}
                            </a>
                        </div>
                    </div>

                    {/* Category Tags and Social Links */}
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 sm:gap-4 pt-6 sm:pt-8 mt-6 sm:mt-8 border-t border-gray-200 dark:border-neutral-800">
                        <div className="flex flex-wrap gap-2">
                            <span className="flex items-center gap-1.5 px-3 py-1.5 sm:py-1 text-[10px] sm:text-xs font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-neutral-800 dark:text-gray-200 min-h-[32px] touch-manipulation">
                                <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                {storeDetails?.category}
                            </span>
                            <span className="flex items-center gap-1.5 px-3 py-1.5 sm:py-1 text-[10px] sm:text-xs font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-neutral-800 dark:text-gray-200 min-h-[32px] touch-manipulation">
                                <Leaf className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                Sustainable Fashion
                            </span>
                            <span className="flex items-center gap-1.5 px-3 py-1.5 sm:py-1 text-[10px] sm:text-xs font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-neutral-800 dark:text-gray-200 min-h-[32px] touch-manipulation">
                                <Leaf className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                Eco-Friendly
                            </span>
                        </div>

                        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Follow us:</span>
                            <div className="flex gap-3 sm:gap-2">
                                <a href={storeDetails?.socialMedia.instagram} target='_blank' className="flex items-center justify-center w-10 h-10 sm:w-9 sm:h-9 text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 dark:text-gray-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 touch-manipulation transition-colors" aria-label="Instagram">
                                    <Instagram className="w-4 h-4" />
                                </a>
                                <a href={storeDetails?.socialMedia.facebook} target='_blank' className="flex items-center justify-center w-10 h-10 sm:w-9 sm:h-9 text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 dark:text-gray-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 touch-manipulation transition-colors" aria-label="Facebook">
                                    <Facebook className="w-4 h-4" />
                                </a>
                                <a href={storeDetails?.socialMedia.twitter} target='_blank' className="flex items-center justify-center w-10 h-10 sm:w-9 sm:h-9 text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 dark:text-gray-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 touch-manipulation transition-colors" aria-label="Twitter">
                                    <Twitter className="w-4 h-4" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StoreHero;