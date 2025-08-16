"use client"

import Loader from '@/components/Loaders/Loader';
import axios from 'axios'
import Image from 'next/image';
import React, { FormEvent, useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import {
    Mail,
    User,
    CheckCircle2,
    XCircle,
    BadgeCheck,
    Frown,
    ShieldCheck,
    BellElectric
} from 'lucide-react';

interface Seller {
    _id: string
    email: string,
    sellerId: string,
    isEmailVerified: boolean,
    avatar: string
}

const SellerAuthorizationPage = () => {
    const [sellers, setSellers] = useState<Seller[]>([]);
    const [loading, setLoading] = useState(false);
    const [processingId, setProcessingId] = useState<string | null>(null);

    const handleAuthorize = async (sellerId: string, _id: string) => {
        try {
            setProcessingId(_id);
            setLoading(true);
            const response = await axios.post('/api/authorizeSeller', { sellerId, _id });

            if (response.data.data) {
                toast.success("Seller authorized successfully");
                getSellerRequests();
            } else {
                toast.error("Authorization failed");
            }
        } catch (error) {
            console.error("Authorization error:", error);
            toast.error("Error authorizing seller");
        } finally {
            setLoading(false);
            setProcessingId(null);
        }
    }

    async function getSellerRequests() {
        try {
            const response = await axios.get('/api/getSellerRequests');
            if (response.data.data) {
                setSellers(response.data.data);
            } else {
                setSellers([]);
            }
        } catch (error) {
            console.error("Fetch error:", error);
            toast.error("Failed to fetch seller requests");
        }
    }

    useEffect(() => {
        getSellerRequests();
    }, []);

    return (
        <div className="min-h-screen p-6">
            <div className="mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                        <ShieldCheck className="w-8 h-8 text-green-600" />
                        Seller Authorization
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Review and approve seller applications for your marketplace
                    </p>
                </div>

                {sellers.length === 0 ? (
                    <div className="bg-white dark:bg-neutral-800 rounded-lg border dark:border-neutral-700 p-8 text-center">
                        <BellElectric className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-xl font-medium text-gray-700 dark:text-white">No pending requests</h3>
                        <p className="text-gray-500 mt-2">
                            There are currently no seller applications to authorize.
                        </p>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-neutral-800  rounded-lg shadow overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-500">
                            <thead className="bg-gray-50 dark:bg-neutral-800">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Seller
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Seller ID
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-neutral-800 divide-y divide-gray-200 dark:divide-neutral-700">
                                {sellers.map((seller) => (
                                    <tr key={seller._id} className="hover:bg-gray-50 transition-colors dark:hover:bg-neutral-700/20">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <Image
                                                        src={seller.avatar}
                                                        height={400}
                                                        width={400}
                                                        className="h-10 w-10 rounded-full border-2 border-white shadow-sm object-cover"
                                                        alt="Seller Avatar"
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                                                <Mail className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-300" />
                                                {seller.email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                                                <User className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-300" />
                                                {seller.sellerId}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {seller.isEmailVerified ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                                    Verified
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                    <XCircle className="w-3 h-3 mr-1" />
                                                    Unverified
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleAuthorize(seller.sellerId, seller._id);
                                                }}
                                                disabled={loading && processingId === seller._id}
                                                className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm 
                                                    ${loading && processingId === seller._id
                                                        ? 'bg-green-400 cursor-not-allowed'
                                                        : 'bg-green-600 hover:bg-green-700 text-white'}
                                                `}
                                            >
                                                {loading && processingId === seller._id ? (
                                                    <>
                                                        <Loader title="Processing" />
                                                    </>
                                                ) : (
                                                    <>
                                                        <BadgeCheck className="w-3 h-3 mr-1" />
                                                        Authorize
                                                    </>
                                                )}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}

export default SellerAuthorizationPage;