import React from 'react';
import {
    Star, MapPin, Instagram, Facebook, Twitter,
    Calendar, ShoppingBag, Leaf, Heart, Phone, Clock, Tag, Shield
} from 'lucide-react';
import Image from 'next/image';

const dummyStore = {
    storeName: "GreenLeaf Boutique",
    storeDescription: "A curated selection of eco-friendly fashion and lifestyle products. Discover sustainable style for a better tomorrow now. A curated selection of eco-friendly fashion and lifestyle products. Discover sustainable style for a better tomorrow.",
    storeImage: "https://randomuser.me/api/portraits/men/32.jpg",
    storeCoverImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    storeId: "ST-123456",
    owner: "Jane Doe",
    location: "Mumbai, India",
    rating: 4.8,
    reviewCount: 128,
    category: "Fashion & Apparel",
    isOpen: true,
    establishedYear: 2015,
    shippingPolicy: "Free shipping over ₹999",
    returnPolicy: "30-day easy returns",
    contact: "+91 98765 43210",
    socialMedia: {
        instagram: "greenleafboutique",
        facebook: "greenleafboutique",
        twitter: "greenleafboutique"
    }
};

const StoreHero = ({ storeDetails }: any) => {
    return (
        <div className="relative overflow-hidden border rounded-b-lg dark:border-neutral-800 dark:bg-neutral-900/60">
            {/* Cover Image with Gradient Overlay */}
            <div className="relative h-64 md:h-80 lg:h-96">
                <Image
                    height={1000}
                    width={1000}
                    src={storeDetails?.storeCoverImage || "https://dummyimage.com/640x4:3"}
                    alt="Store Cover"
                    className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70" />

                {/* Floating Profile Card */}
                <div className="absolute z-10 left-8 -bottom-16">
                    <div className="flex items-end gap-4">
                        <div className="relative group">
                            <Image
                                height={1000}
                                width={1000}
                                src={storeDetails?.storeImage || "https://dummyimage.com/qvga"}
                                alt="Store Profile"
                                className="object-cover transition-transform duration-300 border-4 border-white rounded-lg shadow-xl w-28 h-28 md:w-32 md:h-32 dark:border-neutral-800 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 transition-opacity duration-300 rounded-lg opacity-0 bg-black/20 group-hover:opacity-100" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Store Info Section */}
            <div className="px-6 pt-20 pb-8">
                <div className="">
                    {/* Store Header with CTA */}
                    <div className="flex flex-col gap-6 md:flex-row md:justify-between md:items-start">
                        <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-3 mb-2">
                                <h1 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl dark:text-white">
                                    {storeDetails?.storeName}
                                </h1>
                                <div className="flex items-center gap-2">
                                    <span className={`flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium rounded-full ${storeDetails?.isOpen ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200" : "bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-200"}`}>
                                        <Clock className="w-3 h-3" />
                                        {storeDetails?.isOpen ? "Open Now" : "Closed"}
                                    </span>
                                    <span className="flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200">
                                        <Calendar className="w-3 h-3" />
                                        Est. {storeDetails?.createdAt ? new Date(storeDetails?.createdAt).toLocaleDateString() : "N/A"}
                                    </span>
                                </div>
                            </div>

                            <p className="max-w-3xl text-sm text-gray-600 dark:text-gray-300">
                                {storeDetails?.storeDescription}
                            </p>

                            {/* Store Stats */}
                            <div className="grid grid-cols-4 gap-2 mt-6">
                                <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 dark:bg-neutral-800">
                                    <div className="p-2 bg-white rounded-full shadow dark:bg-neutral-700">
                                        <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Rating</p>
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                            {storeDetails?.rating || 0} <span className="text-sm font-normal text-gray-500 dark:text-gray-400">({storeDetails?.reviewCount || 0})</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 dark:bg-neutral-800">
                                    <div className="p-2 bg-white rounded-full shadow dark:bg-neutral-700">
                                        <MapPin className="w-5 h-5 text-blue-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Location</p>
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1">
                                            {storeDetails?.location}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 dark:bg-neutral-800">
                                    <div className="p-2 bg-white rounded-full shadow dark:bg-neutral-700">
                                        <Shield className="w-5 h-5 text-green-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Returns</p>
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                            {storeDetails?.returnPolicy}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 dark:bg-neutral-800">
                                    <div className="p-2 bg-white rounded-full shadow dark:bg-neutral-700">
                                        <Tag className="w-5 h-5 text-purple-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Shipping</p>
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                            {storeDetails?.shippingPolicy}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-row-reverse items-center justify-center gap-3 ">
                            <button className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white transition-colors bg-gray-900 rounded-lg hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100">
                                <Heart className="w-4 h-4" />
                                Follow Store
                            </button>
                            <a href={`tel:+91${storeDetails?.contact}`} className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-gray-900 transition-colors bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-neutral-800 dark:text-white dark:border-neutral-700 dark:hover:bg-neutral-700">
                                <Phone className="w-4 h-4" />
                                {storeDetails?.contact}
                            </a>
                        </div>
                    </div>

                    {/* Category Tags and Social Links */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-8 mt-8 border-t border-gray-200 dark:border-neutral-800">
                        <div className="flex flex-wrap gap-2">
                            <span className="flex items-center gap-1 px-3 py-1 text-xs font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-neutral-800 dark:text-gray-200">
                                <ShoppingBag className="w-3 h-3" />
                                {storeDetails?.category}
                            </span>
                            <span className="flex items-center gap-1 px-3 py-1 text-xs font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-neutral-800 dark:text-gray-200">
                                <Leaf className="w-3 h-3" />
                                Sustainable Fashion
                            </span>
                            <span className="flex items-center gap-1 px-3 py-1 text-xs font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-neutral-800 dark:text-gray-200">
                                <Leaf className="w-3 h-3" />
                                Eco-Friendly Materials
                            </span>
                        </div>

                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Follow us:</span>
                            <div className="flex gap-3">
                                <a href={storeDetails?.socialMedia.instagram} target='_blank' className="p-2 text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 dark:text-gray-200 dark:bg-neutral-800 dark:hover:bg-neutral-700" aria-label="Instagram">
                                    <Instagram className="w-5 h-5" />
                                </a>
                                <a href={storeDetails?.socialMedia.facebook} target='_blank' className="p-2 text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 dark:text-gray-200 dark:bg-neutral-800 dark:hover:bg-neutral-700" aria-label="Facebook">
                                    <Facebook className="w-5 h-5" />
                                </a>
                                <a href={storeDetails?.socialMedia.twitter} target='_blank' className="p-2 text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 dark:text-gray-200 dark:bg-neutral-800 dark:hover:bg-neutral-700" aria-label="Twitter">
                                    <Twitter className="w-5 h-5" />
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