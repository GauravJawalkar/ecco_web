"use client"

import UserInfoCard from "@/components/UserInfoCard";
import { useUserStore } from "@/store/UserStore";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { MouseEvent } from "react";

const Home = () => {
    const { data, logOut }: any = useUserStore();

    const dataLength = Object.keys(data).length;

    const router = useRouter();

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

    return (
        <section className="h-screen">
            <div className="flex gap-5 py-10 relative">
                {/* User Image Div */}
                <div className="w-[30%] ">
                    <div className="sticky top-24">
                        <Image
                            src={(dataLength !== 0 && data.avatar) || "/userProfile.png"}
                            width={200}
                            height={200}
                            loading="lazy"
                            className="rounded-md h-auto w-full"
                            alt="userProfileImage"
                        />
                        <div className="text-center py-3 ">
                            <h1 className="capitalize font-semibold text-xl">Hello 👋 {data.name}</h1>
                        </div>
                        <button className="w-full bg-[#1a1a1a] py-2 text-[#ededed] dark:bg-[#3a3a3a] rounded" onClick={handleLogout}>Logout</button>
                    </div>
                </div>

                {/* Personal Information div */}
                <div className="w-full bg-slate-400/5 dark:bg-white/5 p-10  border dark:border-[#5a5a5a] ">
                    <div className="pb-6">
                        <h1 className="text-lg uppercase font-bold">Personal Information</h1>
                    </div>

                    <div className="p-5 mb-4 border-slate-300 dark:border-[#5a5a5a] border rounded flex items-start flex-col justify-start gap-3">
                        <div className="capitalize font-normal text-md">Unique Profile Id :</div>
                        <div className="border dark:border-[#5a5a5a] w-1/3 p-3 border-slate-300 rounded-md hover:cursor-not-allowed">
                            <h1 className="text-gray-500 capitalize font-normal">
                                {dataLength !== 0 && data._id}
                            </h1>
                        </div>
                    </div>
                    <UserInfoCard dataLength={dataLength} dataValue={data.name} cardTitle={'name'} />
                    <UserInfoCard dataLength={dataLength} dataValue={data.email} cardTitle={"email"} />
                </div>
            </div>
        </section>
    );
};

export default Home;
