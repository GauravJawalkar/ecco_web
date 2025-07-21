"use client"
import { useUserStore } from '@/store/UserStore';
import { useMutation, useQueries, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { CircleX, X } from 'lucide-react';
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
        <section className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40'>
            <div className='relative w-full max-w-3xl p-8 bg-white shadow-lg dark:bg-neutral-800 rounded-xl'>
                <button title="close" className="absolute text-2xl text-gray-500 top-4 right-4 hover:text-gray-700 dark:hover:text-white" onClick={onClose} aria-label="Close" >
                    <X className="w-5 h-5" />
                </button>
                <form onSubmit={handelAddress} className='grid min-w-full grid-cols-2 gap-5 text-sm'>
                    <div className='w-full space-y-1'>
                        <label>Address :</label>
                        <textarea rows={1} className='w-full px-3 py-2 text-black border rounded' placeholder='Enter Your Full Address' required onChange={(e) => setAddress(e.target.value)} />
                    </div>
                    <div className='w-full space-y-1'>
                        <label>PinCode :</label>
                        <input type='text' className='w-full px-3 py-2 text-black border rounded' placeholder='Enter Your Pincode' required onChange={(e) => setPinCode(e.target.value)} />
                    </div>
                    <div className='w-full space-y-1'>
                        <label>LandMark :</label>
                        <input type="text" className='w-full px-3 py-2 text-black border rounded' placeholder='Enter Stock' required onChange={(e) => setLandMark(e.target.value)} />
                    </div>
                    <div className='w-full space-y-1'>
                        <label>Contact Number :</label>
                        <input type="number" className='w-full px-3 py-2 text-black border rounded' placeholder='Enter Discount' required onChange={(e) => setContactNumber(e.target.value)} />
                    </div>
                    <div className='w-full space-y-1'>
                        <button type='submit' className='w-full px-4 py-2 font-semibold text-white transition bg-green-600 rounded hover:bg-green-700 disabled:cursor-not-allowed'>
                            Add Address
                        </button>
                    </div>
                </form>
            </div >
        </section >
    )
}

export default AddAddressModal