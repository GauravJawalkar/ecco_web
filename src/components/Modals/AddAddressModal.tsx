"use client"
import { useUserStore } from '@/store/UserStore';
import { useMutation, useQueries, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { CircleX } from 'lucide-react';
import React, { useState } from 'react'
import toast from 'react-hot-toast';

interface addressModalProps {
    onClose: () => void,
    isVisible: boolean
}

const AddAddressModal = ({ onClose, isVisible }: addressModalProps) => {
    const [address, setAddress] = useState("");
    const [pinCode, setPinCode] = useState("");
    const [landMark, setLandMark] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const { data }: any = useUserStore();
    const queryClient = useQueryClient();

    async function addAddress() {
        try {
            const userId = data?._id
            const addressDetails = {
                address, pinCode, landMark, contactNumber, userId
            }
            const response = await axios.post("/api/addAddress", { addressDetails });

            if (response.data.data) {
                return response.data.data
            }

            return []

        } catch (error) {
            console.error("Failed to Add the Address : ", error);
            return []
        }
    }

    const addAddressMutation = useMutation({
        mutationFn: addAddress,
        onSuccess: () => {
            toast.success("Address Added Successfully");
            queryClient.invalidateQueries({ queryKey: ['userAddresses'] })
        }
    })

    const handelAddress = async (e: React.FormEvent) => {
        e.preventDefault();
        addAddressMutation.mutate();
        onClose();
    }

    if (!isVisible) return null;
    return (
        <section className='fixed inset-0 z-10 flex items-center justify-center backdrop-blur-md'>
            <div className='relative flex items-center justify-center w-1/2 px-10 py-8 rounded-xl dark:bg-white/5 bg-slate-600/5 backdrop-blur-md'>
                <div className='absolute text-end -top-3 -right-2'>
                    <CircleX className='w-8 h-8 cursor-pointer ' onClick={onClose} />
                </div>
                <form onSubmit={handelAddress} className='grid min-w-full grid-cols-2 gap-5'>
                    <div className='w-full'>
                        <label>Address :</label>
                        <textarea rows={1} className='w-full px-3 py-2 text-black rounded' placeholder='Enter Your Full Address' required onChange={(e) => setAddress(e.target.value)} />
                    </div>
                    <div className='w-full'>
                        <label>PinCode :</label>
                        <input type='text' className='w-full px-3 py-2 text-black rounded' placeholder='Enter Your Pincode' required onChange={(e) => setPinCode(e.target.value)} />
                    </div>
                    <div className='w-full'>
                        <label>LandMark :</label>
                        <input type="text" className='w-full px-3 py-2 text-black rounded' placeholder='Enter Stock' required onChange={(e) => setLandMark(e.target.value)} />
                    </div>
                    <div className='w-full'>
                        <label>Contact Number :</label>
                        <input type="number" className='w-full px-3 py-2 text-black rounded' placeholder='Enter Discount' required onChange={(e) => setContactNumber(e.target.value)} />
                    </div>
                    <div className='w-full'>
                        <button type='submit' className='w-full py-2 bg-[#0a0a0a] text-[#ededed]  rounded text-lg hover:bg-[#1a1a1a] transition-all ease-linear duration-200'>
                            Add Address
                        </button>
                    </div>
                </form>
            </div >
        </section >
    )
}

export default AddAddressModal