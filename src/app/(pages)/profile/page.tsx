"use client"

import UserInfoCard from "@/components/Navigation/UserInfoCard";
import VerifyEmailModal from "@/components/Modals/VerifyEmailModal";
import { useUserStore } from "@/store/UserStore";
import axios from "axios";
import { LoaderCircle, LogOut, Pencil, ShieldCheck, ShieldQuestion, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { MouseEvent, useState } from "react";
import toast from "react-hot-toast";
import ApiClient from "@/interceptors/ApiClient";

const Home = () => {
    const { data, logOut }: any = useUserStore();
    const dataLength = Object.keys(data)?.length;
    const [loadOTP, setLoadOTP] = useState(false)
    const email = dataLength !== 0 && data?.email
    const _id = dataLength !== 0 && data?._id

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
            setLoadOTP(true)
            const response = await ApiClient.post('/api/emailOtpValidation', { _id, email })
            if (response.data.data) {
                toast.success('Check Email For OTP');
                setLoadOTP(false);
                setVerifyEmailModal(true);
            }
        } catch (error) {
            setLoadOTP(false)
            toast.error('Failed to verify the email')
            console.log('Failed to verify the email', error)
        }
    }

    return (
        <section className="">
            <div className="relative flex gap-5 py-10">
                {/* User Image Div */}
                <div className="w-[30%] ">
                    <div className="sticky top-24">
                        <Image
                            src={(dataLength !== 0 && data.avatar) || "/userProfile.png"}
                            width={200}
                            height={200}
                            loading="lazy"
                            className="w-full h-auto rounded-md"
                            alt="userProfileImage"
                        />
                        <div className="py-3 text-center ">
                            <h1 className="text-xl font-semibold capitalize">Hello 👋 {data.name}</h1>
                        </div>
                        <button className="w-full bg-[#1a1a1a] py-2 text-[#ededed] dark:bg-[#3a3a3a] rounded flex items-center justify-center gap-2" onClick={handleLogout}><LogOut className="w-5 h-5" />Logout</button>
                    </div>
                </div>

                {/* Personal Information div */}
                <div className="w-full p-10 border dark:bg-neutral-900 dark:border-neutral-700 ">
                    <div className="pb-5">
                        <div className="pb-6">
                            <h1 className="text-xl font-bold uppercase">Personal Information</h1>
                        </div>

                        <div className="flex flex-col items-start justify-start gap-3 p-5 mb-4 border rounded dark:bg-neutral-800/30 dark:border-neutral-700">
                            <div className="font-normal capitalize text-md">Unique Profile Id :</div>
                            <div className="w-1/3 p-3 border rounded-md dark:border-neutral-700 hover:cursor-not-allowed">
                                <h1 className="font-normal text-gray-500 capitalize">
                                    {dataLength !== 0 && data._id}
                                </h1>
                            </div>
                        </div>
                        <UserInfoCard dataLength={dataLength} dataValue={data.name} cardTitle={'name'} />
                        <div className="flex flex-col items-start justify-start gap-3 p-5 mb-4 font-semibold border rounded dark:bg-neutral-800/30 dark:border-neutral-700">
                            <div className='font-normal capitalize text-md'>{"Email"} :</div>
                            <div className="w-1/3 p-3 border rounded-md dark:border-neutral-700 hover:cursor-not-allowed">
                                <span className="font-normal text-gray-500 dark:text-gray-400">
                                    {dataLength !== 0 && data.email}
                                </span>
                            </div>
                            <div>
                                <div className="text-green-500 border  hover:bg-gray-200 dark:hover:bg-[#3a3a3a] dark:border-neutral-700 transition ease-in-out duration-200 px-4 py-1 rounded-sm text-base font-normal flex items-center justify-center gap-2">
                                    {dataLength !== 0 && data.isEmailVerified ?
                                        <div className="flex items-center justify-center gap-2 font-normal">
                                            <ShieldCheck className="w-5 h-5" />
                                            Verified
                                        </div> :
                                        <button onClick={handelEmailVerify} className="flex items-center justify-center gap-2 font-normal">
                                            {loadOTP ? <LoaderCircle className="w-5 h-5 animate-spin" /> : <ShieldQuestion className="w-5 h-5" />}
                                            Verify Now
                                        </button>
                                    }
                                </div>
                                <VerifyEmailModal
                                    isVisible={verifyEmailModal}
                                    onClose={() => { setVerifyEmailModal(false) }}
                                    id={dataLength !== 0 && data?._id}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Account Settings */}
                    <div>
                        <div className="my-6">
                            <h1 className="text-xl font-bold uppercase">Account Settings</h1>
                        </div>

                        <div className="flex flex-col items-start justify-start gap-3 p-5 mb-4 border rounded dark:border-neutral-700 dark:bg-neutral-800/30">
                            <div className="font-normal capitalize text-md">Is Seller :</div>
                            <div className="w-1/3 p-3 border rounded-md dark:border-neutral-700 hover:cursor-not-allowed">
                                <h1 className="font-normal text-gray-500 capitalize">
                                    {dataLength !== 0 && data.isSeller === true ? "Yes" : "No"}
                                </h1>
                            </div>
                        </div>
                        <UserInfoCard dataLength={dataLength} dataValue={'**********'} cardTitle={'change password'} />
                        <div className="py-3">
                            <button className="flex items-center justify-center gap-2 px-3 py-2 text-white transition-all duration-200 ease-in-out bg-red-500 rounded hover:bg-red-600">
                                <Trash2 className="w-5 h-5" />
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
