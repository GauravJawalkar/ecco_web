"use client"

import UserInfoCard from "@/components/Navigation/UserInfoCard";
import VerifyEmailModal from "@/components/Modals/VerifyEmailModal";
import { useUserStore } from "@/store/UserStore";
import { Camera, Copy, LayoutDashboard, LoaderCircle, LogOut, ShieldAlert, ShieldCheck, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { MouseEvent, useState } from "react";
import toast from "react-hot-toast";
import ApiClient from "@/interceptors/ApiClient";

const ProfilePage = () => {
    const { data, logOut }: any = useUserStore();
    const dataLength = Object.keys(data || {})?.length;
    const [loadOTP, setLoadOTP] = useState(false);
    const email = dataLength !== 0 && data?.email;
    const _id = dataLength !== 0 && data?._id;
    const router = useRouter();
    const [verifyEmailModal, setVerifyEmailModal] = useState(false);

    const handleLogout = async (e: MouseEvent) => {
        e.preventDefault();
        try {
            await logOut();
            router.push("/login");
        } catch (error) {
            console.log("Logout Failed", error);
            toast.error("Failed to logout");
        }
    };

    const handelEmailVerify = async () => {
        try {
            setLoadOTP(true);
            const response = await ApiClient.post('/api/emailOtpValidation', { _id, email });
            if (response.data.data) {
                toast.success('Check Email For OTP');
                setLoadOTP(false);
                setVerifyEmailModal(true);
            }
        } catch (error) {
            setLoadOTP(false);
            toast.error('Failed to verify the email');
            console.log('Failed to verify the email', error);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(data._id);
        toast.success("Profile ID copied!");
    }

    if (dataLength === 0) return null;

    return (
        <section className="min-h-screen bg-gray-50/50 dark:bg-[#1a1a1a] pb-20">
            {/* Top Banner Background */}
            <div className="px-4 sm:px-6 lg:px-8 relative z-10 pt-10 sm:pt-12">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Left Sidebar: Profile Card */}
                    <div className="w-full lg:w-[320px] shrink-0">
                        <div className="bg-white dark:bg-[#0a0a0a]/50 rounded-2xl shadow-sm border border-gray-200 dark:border-neutral-800 overflow-hidden lg:sticky lg:top-24">

                            {/* Profile Header Image */}
                            <div className="h-24 bg-gray-100 dark:bg-[#1b1b1b]/50 w-full relative">
                                <div className="absolute -bottom-10 left-6">
                                    <div className="relative w-20 h-20 rounded-2xl bg-white dark:bg-[#1a1a1a] p-1 shadow-md border border-gray-100 dark:border-neutral-800">
                                        <Image
                                            src={data.avatar || "/userProfile.png"}
                                            width={200}
                                            height={200}
                                            className="w-full h-full rounded-xl object-cover"
                                            alt="Profile"
                                        />
                                        <button className="absolute -bottom-2 -right-2 p-1.5 bg-white dark:bg-neutral-800 rounded-full shadow-sm border border-gray-200 dark:border-neutral-700 hover:scale-105 transition-transform text-gray-500">
                                            <Camera className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* User Info */}
                            <div className="pt-14 pb-6 px-6">
                                <h1 className="text-xl font-bold text-gray-900 dark:text-white capitalize tracking-tight flex items-center gap-2">
                                    {data.name}
                                </h1>
                                <p className="text-sm text-gray-500 dark:text-neutral-400 mt-1">{data.email}</p>

                                <div className="mt-6 space-y-2">
                                    {data.isSeller && (
                                        <button
                                            onClick={() => router.push('/dashboard')}
                                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-green-700 dark:bg-white text-white dark:text-gray-900 rounded-xl text-sm font-medium hover:bg-green-800 dark:hover:bg-gray-200 transition-colors"
                                        >
                                            <LayoutDashboard className="w-4 h-4" />
                                            Dashboard
                                        </button>
                                    )}
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-neutral-800/50 text-gray-700 dark:text-neutral-300 rounded-xl text-sm font-medium hover:bg-gray-200 dark:hover:bg-neutral-800 transition-colors active:scale-[0.98]"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Content: Settings */}
                    <div className="flex-1 space-y-6">

                        {/* Personal Information */}
                        <div className="bg-white dark:bg-[#0a0a0a]/50 rounded-2xl shadow-sm border border-gray-200 dark:border-neutral-800 overflow-hidden">
                            <div className="px-6 py-5 border-b border-gray-100 dark:border-neutral-800/60">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Personal Information</h2>
                                <p className="text-sm text-gray-500 dark:text-neutral-400 mt-0.5">Manage your personal details and identity.</p>
                            </div>

                            <div className="divide-y divide-gray-100 dark:divide-neutral-800/60 flex flex-col w-full">
                                {/* Unique Profile ID */}
                                <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">Profile ID</p>
                                        <p className="text-sm text-gray-500 dark:text-neutral-400 mt-1">Your unique platform identifier</p>
                                    </div>
                                    <button
                                        onClick={copyToClipboard}
                                        className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-neutral-900 hover:bg-gray-100 dark:hover:bg-neutral-800 border border-gray-200 dark:border-neutral-800 rounded-lg transition-colors group-hover:border-gray-300 dark:group-hover:border-neutral-700 text-left active:scale-95"
                                    >
                                        <p className="text-sm text-gray-600 dark:text-gray-400 font-mono truncate max-w-[150px] sm:max-w-xs">{data._id}</p>
                                        <Copy className="w-3.5 h-3.5 text-gray-400" />
                                    </button>
                                </div>

                                {/* Component for Name */}
                                <div className="p-6">
                                    <UserInfoCard dataLength={dataLength} dataValue={data.name} cardTitle="name" />
                                </div>

                                {/* Email Status */}
                                <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">Email Address</p>
                                        <p className="text-sm text-gray-500 dark:text-neutral-400 mt-1 truncate max-w-[200px] sm:max-w-xs">{data.email}</p>
                                    </div>
                                    <div className="shrink-0">
                                        {data.isEmailVerified ? (
                                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-500/20 text-sm font-medium cursor-default">
                                                <ShieldCheck className="w-4 h-4" />
                                                Verified
                                            </div>
                                        ) : (
                                            <button
                                                onClick={handelEmailVerify}
                                                disabled={loadOTP}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 text-sm font-medium hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-colors active:scale-95 disabled:opacity-50"
                                            >
                                                {loadOTP ? <LoaderCircle className="w-4 h-4 animate-spin" /> : <ShieldAlert className="w-4 h-4" />}
                                                Verify Email
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Account Settings */}
                        <div className="bg-white dark:bg-[#0a0a0a]/50 rounded-2xl shadow-sm border border-gray-200 dark:border-neutral-800 overflow-hidden">
                            <div className="px-6 py-5 border-b border-gray-100 dark:border-neutral-800/60">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Account Settings</h2>
                                <p className="text-sm text-gray-500 dark:text-neutral-400 mt-0.5">Security and platform preferences.</p>
                            </div>

                            <div className="divide-y divide-gray-100 dark:divide-neutral-800/60">
                                {/* Is Seller */}
                                <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">Seller Account</p>
                                        <p className="text-sm text-gray-500 dark:text-neutral-400 mt-1">Status of your marketplace store.</p>
                                    </div>
                                    <div className="px-3 py-1.5 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg shrink-0">
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{data.isSeller ? "Active" : "Inactive"}</p>
                                    </div>
                                </div>

                                {/* Password Change */}
                                <div className="p-6">
                                    <UserInfoCard dataLength={dataLength} dataValue="••••••••••••" cardTitle="password" />
                                </div>
                            </div>
                        </div>

                        {/* Danger Zone */}
                        <div className="bg-white dark:bg-[#0a0a0a]/50 rounded-2xl shadow-sm border border-red-100 dark:border-red-900/30 overflow-hidden">
                            <div className="px-6 py-5 border-b border-red-50 dark:border-red-900/20">
                                <h2 className="text-lg font-semibold text-red-600 dark:text-red-400">Danger Zone</h2>
                                <p className="text-sm text-gray-500 dark:text-neutral-400 mt-0.5">Irreversible account actions.</p>
                            </div>

                            <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-red-50/50 dark:bg-red-500/5">
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">Delete Account</p>
                                    <p className="text-sm text-gray-500 dark:text-neutral-400 mt-1">Permanently remove your account and data.</p>
                                </div>
                                <button className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-500/10 rounded-xl hover:bg-red-200 dark:hover:bg-red-500/20 transition-colors shrink-0 active:scale-95">
                                    <Trash2 className="w-4 h-4" />
                                    Delete Account
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <VerifyEmailModal
                isVisible={verifyEmailModal}
                onClose={() => setVerifyEmailModal(false)}
                id={dataLength !== 0 && data?._id}
            />
        </section>
    );
};

export default ProfilePage;