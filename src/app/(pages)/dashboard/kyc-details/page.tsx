'use client';

import { useUserStore } from "@/store/UserStore";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function KYCDetails() {

    const { data }: any = useUserStore();
    const [accountName, setAccountName] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [IFSC, setIFSC] = useState("");
    const [bankDetailsValid, setBankDetailsValid] = useState(false);
    const [verifiedBankName, setVerifiedBankName] = useState("");
    const router = useRouter();

    const verifyIFSC = async () => {
        try {
            const response = await fetch(`https://ifsc.razorpay.com/${IFSC}`);
            if (!response.ok) {
                toast.error("Invalid IFSC");
            }
            const data = await response.json();
            setBankDetailsValid(true);
            toast.success(`Bank verified: ${data.BANK}`);
            setVerifiedBankName(data.BANK);
        } catch (error) {
            setBankDetailsValid(false);
            toast.error('Invalid IFSC code');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Create FormData for file uploads

            const response: any = await axios.post('/api/kyc', { accountName, accountNumber, IFSC, sellerId: data?._id });
            if (!response.ok) {
                toast.error("Submission failed");
            }

            // Create Razorpay recipient account after KYC success
            await createRazorpayRecipient(response.data.kycId);
            toast.success('KYC submitted successfully!');
            router.push('/dashboard');
        } catch (error) {
            console.error('KYC submission error:', error);
            toast.error('KYC submission failed');
        }
    };

    const createRazorpayRecipient = async (kycId: string) => {
        try {
            const response: any = await axios.post('/api/razorpay/create-recipient',
                { kycId, accountNumber: accountNumber, ifscCode: IFSC, name: accountName });

            if (!response.ok) {
                toast.error("Recipient creation failed");
            }

            // Save recipient ID to seller profile
            await axios.post('/api/updateSellerDetails', { sellerId: data?._id, razorpayRecipientId: response?.data?.data, acc_id: response?.data?.acc_id, kycStatus: 'Verified' });
        } catch (error) {
            console.error('Recipient creation error:', error);
        }
    };

    return (
        <div className="p-6 mx-auto rounded-lg ">
            <h2 className="mb-6 text-2xl font-bold">Seller KYC Verification</h2>
            <p className="mb-8 ">
                Complete your Know Your Customer (KYC) details to start receiving payments.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Bank Details */}
                <div className="p-6 border rounded-lg dark:border-neutral-700">
                    <h3 className="mb-4 text-lg font-semibold">Bank Account Details</h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <label className="block mb-2 text-sm">Account Holder Name</label>
                            <input
                                type="text"
                                name="accountHolderName"
                                value={accountName}
                                onChange={(e) => { setAccountName(e.target.value) }}
                                placeholder="Enter Account Holder Name"
                                className="w-full px-4 py-2  border dark:border-neutral-700 dark:bg-[#1a1a1a] rounded-md outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-2 text-sm">Bank Account Number</label>
                            <input
                                type="text"
                                name="bankAccountNumber"
                                value={accountNumber}
                                onChange={(e) => { setAccountNumber(e.target.value) }}
                                placeholder="Enter Your Account Number"
                                pattern="[0-9]{9,18}"
                                title="9-18 digit account number"
                                className="w-full px-4 py-2  border dark:border-neutral-700 dark:bg-[#1a1a1a]  rounded-md outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-2 text-sm">IFSC Code</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    name="ifscCode"
                                    value={IFSC}
                                    onChange={(e) => { setIFSC(e.target.value) }}
                                    placeholder="Enter Valid IFSC Code"
                                    pattern="[A-Z]{4}0[A-Z0-9]{6}"
                                    title="Enter valid IFSC (e.g., SBIN0001234)"
                                    className="w-full px-4 py-2  border dark:border-neutral-700 dark:bg-[#1a1a1a]  rounded-md outline-none"
                                    required
                                />
                                <button
                                    onClick={verifyIFSC}
                                    type="button"
                                    className="px-3 py-2 text-sm border rounded dark:border-neutral-700"
                                >
                                    Verify
                                </button>
                            </div>
                            {bankDetailsValid && (
                                <p className="mt-2 text-green-400 text-sm">IFSC code verified : {verifiedBankName}</p>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-start my-4">
                        <button
                            type="submit"
                            disabled={false}
                            className={`px-3 py-2 rounded-md border text-sm`}>
                            Submit Details
                        </button>
                    </div>
                </div>

            </form>
        </div>
    );
}