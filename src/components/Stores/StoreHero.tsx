import React from 'react';
import {
    Star, MapPin, Instagram, Facebook, Twitter,
    Calendar, ShoppingBag, Leaf, Heart, Mail, Phone, Clock, Tag, Shield
} from 'lucide-react';

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

const StoreHero = () => {
    return (
        <div className="relative overflow-hidden border dark:border-neutral-800 dark:bg-neutral-900/60 rounded-b-lg">
            {/* Cover Image with Gradient Overlay */}
            <div className="relative h-64 md:h-80 lg:h-96">
                <img
                    src={dummyStore.storeCoverImage}
                    alt="Store Cover"
                    className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70" />

                {/* Floating Profile Card */}
                <div className="absolute left-8 -bottom-16 z-10">
                    <div className="flex items-end gap-4">
                        <div className="relative group">
                            <img
                                src={dummyStore.storeImage}
                                alt="Store Profile"
                                className="object-cover border-4 border-white rounded-lg shadow-xl w-28 h-28 md:w-32 md:h-32 dark:border-neutral-800 transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 rounded-lg bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Store Info Section */}
            <div className="pt-20 pb-8 px-6">
                <div className="">
                    {/* Store Header with CTA */}
                    <div className="flex flex-col gap-6 md:flex-row md:justify-between md:items-start">
                        <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-3 mb-2">
                                <h1 className="text-2xl font-bold text-gray-900 md:text-3xl dark:text-white tracking-tight">
                                    {dummyStore.storeName}
                                </h1>
                                <div className="flex items-center gap-2">
                                    <span className={`flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium rounded-full ${dummyStore.isOpen ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200" : "bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-200"}`}>
                                        <Clock className="w-3 h-3" />
                                        {dummyStore.isOpen ? "Open Now" : "Closed"}
                                    </span>
                                    <span className="flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200">
                                        <Calendar className="w-3 h-3" />
                                        Est. {dummyStore.establishedYear}
                                    </span>
                                </div>
                            </div>

                            <p className="text-sm text-gray-600 dark:text-gray-300 max-w-3xl">
                                {dummyStore.storeDescription}
                            </p>

                            {/* Store Stats */}
                            <div className="grid grid-cols-4 gap-2 mt-6">
                                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg dark:bg-neutral-800">
                                    <div className="p-2 bg-white rounded-full shadow dark:bg-neutral-700">
                                        <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Rating</p>
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                            {dummyStore.rating} <span className="text-sm font-normal text-gray-500 dark:text-gray-400">({dummyStore.reviewCount})</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg dark:bg-neutral-800">
                                    <div className="p-2 bg-white rounded-full shadow dark:bg-neutral-700">
                                        <MapPin className="w-5 h-5 text-blue-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Location</p>
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1">
                                            {dummyStore.location}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg dark:bg-neutral-800">
                                    <div className="p-2 bg-white rounded-full shadow dark:bg-neutral-700">
                                        <Shield className="w-5 h-5 text-green-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Returns</p>
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                            {dummyStore.returnPolicy}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg dark:bg-neutral-800">
                                    <div className="p-2 bg-white rounded-full shadow dark:bg-neutral-700">
                                        <Tag className="w-5 h-5 text-purple-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Shipping</p>
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                            {dummyStore.shippingPolicy}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-row-reverse items-center justify-center gap-3 ">
                            <button className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 transition-colors">
                                <Heart className="w-4 h-4" />
                                Follow Store
                            </button>
                            <button className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-neutral-800 dark:text-white dark:border-neutral-700 dark:hover:bg-neutral-700 transition-colors">
                                <Phone className="w-4 h-4" />
                                {dummyStore.contact}
                            </button>
                        </div>
                    </div>

                    {/* Category Tags and Social Links */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-8 mt-8 border-t border-gray-200 dark:border-neutral-800">
                        <div className="flex flex-wrap gap-2">
                            <span className="flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 dark:bg-neutral-800 dark:text-gray-200">
                                <ShoppingBag className="w-3 h-3" />
                                {dummyStore.category}
                            </span>
                            <span className="flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 dark:bg-neutral-800 dark:text-gray-200">
                                <Leaf className="w-3 h-3" />
                                Sustainable Fashion
                            </span>
                            <span className="flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 dark:bg-neutral-800 dark:text-gray-200">
                                <Leaf className="w-3 h-3" />
                                Eco-Friendly Materials
                            </span>
                        </div>

                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Follow us:</span>
                            <div className="flex gap-3">
                                <a href="#" className="p-2 text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 dark:text-gray-200 dark:bg-neutral-800 dark:hover:bg-neutral-700" aria-label="Instagram">
                                    <Instagram className="w-5 h-5" />
                                </a>
                                <a href="#" className="p-2 text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 dark:text-gray-200 dark:bg-neutral-800 dark:hover:bg-neutral-700" aria-label="Facebook">
                                    <Facebook className="w-5 h-5" />
                                </a>
                                <a href="#" className="p-2 text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 dark:text-gray-200 dark:bg-neutral-800 dark:hover:bg-neutral-700" aria-label="Twitter">
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