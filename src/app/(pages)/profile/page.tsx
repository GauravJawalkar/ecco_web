"use client"

import UserInfoCard from "@/components/Navigation/UserInfoCard";
import VerifyEmailModal from "@/components/Modals/VerifyEmailModal";
import { useUserStore } from "@/store/UserStore";
import { LoaderCircle, LogOut, ShieldCheck, ShieldQuestion, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { MouseEvent, useState } from "react";
import toast from "react-hot-toast";
import ApiClient from "@/interceptors/ApiClient";

const Home = () => {
    const { data, logOut }: any = useUserStore();
    const dataLength = Object.keys(data)?.length;
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
            throw new Error("Failed to logout");
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

    return (
        <section>
            <div className="flex flex-col lg:flex-row gap-5 py-6 px-4 lg:px-0 sm:py-8 lg:py-10">

                {/* ── Sidebar: avatar + name + logout ── */}
                <div className="w-full lg:w-[30%]">
                    <div className="lg:sticky lg:top-24 flex flex-col items-center sm:flex-row lg:flex-col sm:gap-5 lg:gap-0">

                        {/* Mobile: avatar row with logout icon */}
                        <div className="w-full flex items-center justify-between sm:hidden mb-2 gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                                <Image
                                    src={(dataLength !== 0 && data.avatar) || "/userProfile.png"}
                                    width={200}
                                    height={200}
                                    loading="lazy"
                                    className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                                    alt="userProfileImage"
                                />
                                <div className="min-w-0">
                                    <h1 className="text-base font-semibold capitalize truncate">
                                        {data.name}
                                    </h1>
                                    {dataLength !== 0 && data.isSeller && (
                                        <span className="text-sm font-medium text-green-600 dark:text-green-400 tracking-wide">
                                            Seller
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-2 flex-shrink-0">
                                {dataLength !== 0 && data.isSeller && (
                                    <button
                                        onClick={() => router.push('/dashboard')}
                                        className="text-[11px] font-medium px-2.5 py-1.5 rounded-lg border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/50 active:scale-95 transition-transform"
                                    >
                                        Dashboard
                                    </button>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="p-2 rounded-xl border dark:border-neutral-700 text-gray-500 dark:text-gray-400 active:scale-90 transition-transform"
                                    aria-label="Logout"
                                >
                                    <LogOut className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Tablet + Desktop: original layout */}
                        <Image
                            src={(dataLength !== 0 && data.avatar) || "/userProfile.png"}
                            width={200}
                            height={200}
                            loading="lazy"
                            className="hidden sm:block w-32 sm:w-32 lg:w-full lg:h-auto h-32 rounded-xl object-cover"
                            alt="userProfileImage"
                        />
                        <div className="hidden sm:block w-full px-4">
                            <div className="py-2 lg:py-3 text-center">
                                <h1 className="text-lg sm:text-xl font-semibold capitalize">
                                    Hello 👋 {data.name}
                                </h1>
                            </div>
                            <button
                                className="w-full bg-[#1a1a1a] py-2 text-[#ededed] dark:bg-[#3a3a3a] rounded-lg flex items-center justify-center gap-2 text-sm sm:text-base active:scale-[0.97] transition-transform"
                                onClick={handleLogout}
                            >
                                <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── Main content ── */}
                <div className="w-full p-4 sm:p-6 lg:p-10 border dark:bg-neutral-900 dark:border-neutral-700 rounded-xl">

                    {/* Personal Information */}
                    <div className="pb-5">
                        <div className="pb-4 sm:pb-6">
                            <h1 className="text-base sm:text-xl font-bold uppercase">Personal Information</h1>
                        </div>

                        {/* Profile ID */}
                        <div className="flex flex-col items-start justify-start gap-3 p-4 sm:p-5 mb-4 border rounded-xl dark:bg-neutral-800/30 dark:border-neutral-700">
                            <div className="font-normal capitalize text-sm sm:text-base">Unique Profile Id :</div>
                            <div className="w-full sm:w-2/3 lg:w-1/3 p-3 border rounded-md dark:border-neutral-700 hover:cursor-not-allowed overflow-hidden">
                                <h1 className="font-normal text-gray-500 capitalize text-xs sm:text-sm truncate">
                                    {dataLength !== 0 && data._id}
                                </h1>
                            </div>
                        </div>

                        <UserInfoCard dataLength={dataLength} dataValue={data.name} cardTitle="name" />

                        {/* Email */}
                        <div className="flex flex-col items-start justify-start gap-3 p-4 sm:p-5 mb-4 border rounded-xl dark:bg-neutral-800/30 dark:border-neutral-700">
                            <div className="font-normal capitalize text-sm sm:text-base">Email :</div>
                            <div className="w-full sm:w-2/3 lg:w-1/3 p-3 border rounded-md dark:border-neutral-700 hover:cursor-not-allowed overflow-hidden">
                                <span className="font-normal text-gray-500 dark:text-gray-400 text-xs sm:text-sm truncate block">
                                    {dataLength !== 0 && data.email}
                                </span>
                            </div>
                            <div>
                                <div className="text-green-500 border hover:bg-gray-200 dark:hover:bg-[#3a3a3a] dark:border-neutral-700 transition ease-in-out duration-200 px-3 sm:px-4 py-1 rounded-lg text-sm font-normal flex items-center justify-center gap-2">
                                    {dataLength !== 0 && data.isEmailVerified ? (
                                        <div className="flex items-center justify-center gap-2 font-normal">
                                            <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                                            Verified
                                        </div>
                                    ) : (
                                        <button onClick={handelEmailVerify} className="flex items-center justify-center gap-2 font-normal">
                                            {loadOTP
                                                ? <LoaderCircle className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                                                : <ShieldQuestion className="w-4 h-4 sm:w-5 sm:h-5" />
                                            }
                                            Verify Now
                                        </button>
                                    )}
                                </div>
                                <VerifyEmailModal
                                    isVisible={verifyEmailModal}
                                    onClose={() => setVerifyEmailModal(false)}
                                    id={dataLength !== 0 && data?._id}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Account Settings */}
                    <div>
                        <div className="my-4 sm:my-6">
                            <h1 className="text-base sm:text-xl font-bold uppercase">Account Settings</h1>
                        </div>

                        {/* Is Seller */}
                        <div className="flex flex-col items-start justify-start gap-3 p-4 sm:p-5 mb-4 border rounded-xl dark:border-neutral-700 dark:bg-neutral-800/30">
                            <div className="font-normal capitalize text-sm sm:text-base">Is Seller :</div>
                            <div className="w-full sm:w-2/3 lg:w-1/3 p-3 border rounded-md dark:border-neutral-700 hover:cursor-not-allowed">
                                <h1 className="font-normal text-gray-500 capitalize text-sm">
                                    {dataLength !== 0 && data.isSeller === true ? "Yes" : "No"}
                                </h1>
                            </div>
                        </div>

                        <UserInfoCard dataLength={dataLength} dataValue="**********" cardTitle="change password" />

                        <div className="py-3">
                            <button className="flex items-center justify-center gap-2 px-3 py-2 text-sm text-white transition-all duration-200 ease-in-out bg-red-500 rounded-lg hover:bg-red-600 active:scale-[0.97]">
                                <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                                Delete Account
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Home;