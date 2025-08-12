"use client"

import axios from 'axios'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import "swiper/css/pagination";
import "swiper/css";
import { CheckCircle, List, MoreVertical, PackageSearch, Plus, Search, Star, StarOff, Tag, XCircle } from 'lucide-react'
import { discountPercentage } from '@/helpers/discountPercentage'

interface mapDataProps {
    _id: string,
    prodName: string,
    prodPrice: string,
    prodImages: [string],
    seller: string,
    prodDiscount: string,
    sellerAvatar: string
    sellerName: string,
    productId: string,
    isSellerVerified: boolean,
    setActive: boolean
}

const SpecialShowCase = () => {
    const [data, setData] = useState([]);

    async function getSpecialAppearReq() {
        try {
            const response = await axios.get('../api/getSplAppReq')
            if (response.data.data) {
                setData(response.data.data)
            }
        } catch (error) {
            console.error("Error Fetching the requests", error)
            toast.error("Error Fetching requests")
        }
    }

    const handelSplReq = async (_id: string, productId: string) => {
        try {
            const response = await axios.put('../api/setSplAppearence', { _id, productId })
            if (response.data.data) {
                toast.success("Special Product Updated")
                getSpecialAppearReq()
            } else {
                toast.error("Error setting special");
            }
        } catch (error) {
            console.log("Error setting special", error)
            toast.error("Error setting special");
        }
    }

    const handelUnsetSplReq = async (_id: string, productId: string) => {
        try {
            const response = await axios.put('../api/unSetSplAppearence', { _id, productId })

            if (response.data.data) {
                toast.success("Special Product Removed")
                getSpecialAppearReq()
            } else {
                toast.error("Error setting special");
            }
        } catch (error) {
            console.log("Error setting special", error)
            toast.error("Error setting special");
        }
    }

    useEffect(() => {
        getSpecialAppearReq();
    }, [])

    return (
        <section className="py-8 px-4 sm:px-6 lg:px-8">
            {/* Header with Search and Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Star className="w-5 h-5 text-amber-500" />
                        Featured Products
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-neutral-400 mt-1">
                        Manage which products appear in special featured sections
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <div className="relative flex-grow max-w-md">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Table Container */}
            <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 overflow-hidden">
                {/* Responsive Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                        <thead className="bg-gray-50 dark:bg-neutral-700">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
                                    Product
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
                                    Media
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
                                    Price
                                </th>
                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
                                    Discount
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
                                    Seller
                                </th>
                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
                                    Verified
                                </th>
                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
                                    Status
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-neutral-800 divide-y divide-gray-200 dark:divide-neutral-700">
                            {data.length > 0 ? (
                                data.map(({ _id, prodName, prodPrice, productId, prodImages, prodDiscount, sellerAvatar, sellerName, isSellerVerified, setActive }: mapDataProps) => (
                                    <tr key={_id} className="hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors">
                                        {/* Product Name */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 rounded-md overflow-hidden border border-gray-200 dark:border-neutral-600 mr-4">
                                                    {prodImages.length > 0 && (
                                                        <Image
                                                            src={prodImages[0]}
                                                            alt={prodName}
                                                            width={40}
                                                            height={40}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1 capitalize">{prodName}</div>
                                                    <div className="text-xs text-gray-500 dark:text-neutral-400 flex items-center justify-start gap-2"> <Tag className='w-3 h-3' />: {productId}</div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Media */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex -space-x-2">
                                                {prodImages.slice(0, 3).map((img, index) => (
                                                    <div key={index} className="relative h-8 w-8 rounded-full border-2 border-white dark:border-neutral-800 overflow-hidden">
                                                        <Image
                                                            src={img}
                                                            alt={`Product ${index + 1}`}
                                                            width={32}
                                                            height={32}
                                                            className="h-full w-full object-cover"
                                                        />
                                                        {index === 2 && prodImages.length > 3 && (
                                                            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-white text-xs font-bold">
                                                                +{prodImages.length - 3}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </td>

                                        {/* Price */}
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900 dark:text-white">
                                            ₹{prodPrice}
                                            <br />
                                            {prodDiscount}
                                        </td>

                                        {/* Discount */}
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            {prodDiscount ? (
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                                                    {Math.round((discountPercentage(Number(prodPrice), Number(prodDiscount))))}%
                                                </span>
                                            ) : (
                                                <span className="text-xs text-gray-500 dark:text-neutral-400">-</span>
                                            )}
                                        </td>

                                        {/* Seller */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-8 w-8 rounded-full overflow-hidden mr-3">
                                                    <Image
                                                        src={sellerAvatar}
                                                        alt={sellerName}
                                                        width={32}
                                                        height={32}
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                                <div className="text-sm text-gray-900 dark:text-white capitalize">{sellerName}</div>
                                            </div>
                                        </td>

                                        {/* Verified */}
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            {isSellerVerified ? (
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                                                    <CheckCircle className="w-3 h-3 mr-1" /> Verified
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-neutral-700 text-gray-800 dark:text-neutral-300">
                                                    <XCircle className="w-3 h-3 mr-1" /> Unverified
                                                </span>
                                            )}
                                        </td>

                                        {/* Status */}
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            {setActive ? (
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                                                    <Star className="w-3 h-3 mr-1" /> Featured
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-neutral-700 text-gray-800 dark:text-neutral-300">
                                                    <List className="w-3 h-3 mr-1" /> Standard
                                                </span>
                                            )}
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end gap-3">
                                                {setActive ? (
                                                    <button
                                                        onClick={() => handelUnsetSplReq(_id, productId)}
                                                        className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 transition-colors flex items-center"
                                                        title="Remove feature"
                                                    >
                                                        <StarOff className="w-4 h-4" />
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handelSplReq(_id, productId)}
                                                        className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 transition-colors flex items-center"
                                                        title="Feature product"
                                                    >
                                                        <Star className="w-4 h-4" />
                                                    </button>
                                                )}
                                                <button
                                                    className="text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-neutral-300 transition-colors flex items-center"
                                                    title="More options"
                                                >
                                                    <MoreVertical className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={8} className="px-6 py-12 text-center">
                                        <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-neutral-700 rounded-full flex items-center justify-center mb-4">
                                            <PackageSearch className="w-10 h-10 text-gray-400 dark:text-neutral-500" />
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-700 dark:text-neutral-300">No products found</h3>
                                        <p className="mt-1 text-gray-500 dark:text-neutral-400">Try adjusting your search or filter to find what you're looking for.</p>
                                        <button className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium flex items-center gap-2 mx-auto">
                                            <Plus className="w-4 h-4" />
                                            Add New Product
                                        </button>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    )
}

export default SpecialShowCase