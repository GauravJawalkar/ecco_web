'use client';

import ApiClient from "@/interceptors/ApiClient";
import { userProps } from "@/interfaces/commonInterfaces";
import { useUserStore } from "@/store/UserStore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { ShieldCheck, Building2, CheckCircle2, ArrowRight } from "lucide-react";

export default function KYCDetails() {

    const { data }: { data: userProps } = useUserStore();
    const [accountName, setAccountName] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [IFSC, setIFSC] = useState("");
    const [bankDetailsValid, setBankDetailsValid] = useState(false);
    const [verifiedBankName, setVerifiedBankName] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const verifyIFSC = async () => {
        if (!IFSC) return toast.error("Please enter an IFSC code first");
        try {
            setIsVerifying(true);
            const response = await fetch(`https://ifsc.razorpay.com/${IFSC}`);
            if (!response.ok) {
                toast.error("Invalid IFSC Code");
                setBankDetailsValid(false);
                setIsVerifying(false);
                return;
            }
            const bankData = await response.json();
            setBankDetailsValid(true);
            toast.success(`Bank verified: ${bankData.BANK}`);
            setVerifiedBankName(bankData.BANK);
            setIsVerifying(false);
        } catch (error) {
            setBankDetailsValid(false);
            setIsVerifying(false);
            toast.error('Invalid IFSC code');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!bankDetailsValid) {
            return toast.error("Please verify your IFSC code before submitting.");
        }

        try {
            setIsSubmitting(true);
            const response = await ApiClient.post('/api/kyc', { accountName, accountNumber, IFSC, sellerId: data?._id });
            if (!response.data.success) {
                setIsSubmitting(false);
                return toast.error("Submission failed");
            }

            // Create Razorpay recipient account after KYC success
            await createRazorpayRecipient(response.data.kycId);
            toast.success('KYC submitted successfully!');
            router.push('/dashboard');
        } catch (error) {
            console.error('KYC submission error:', error);
            setIsSubmitting(false);
            toast.error('KYC submission failed');
        }
    };

    const createRazorpayRecipient = async (kycId: string) => {
        try {
            const response = await ApiClient.post('/api/razorpay/create-recipient',
                { kycId, accountNumber: accountNumber, ifscCode: IFSC, name: accountName });

            if (!response.data.data) {
                toast.error("Recipient creation failed");
            } else {
                toast.success("Razorpay Account Created");
            }

        } catch (error) {
            console.error('Recipient creation error:', error);
        }
    };

    return (
        <div className="py-8 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="mb-10">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2.5 bg-green-50 dark:bg-green-500/10 rounded-xl border border-green-100 dark:border-green-500/20">
                        <ShieldCheck className="w-6 h-6 text-green-600 dark:text-green-500" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Seller KYC Verification</h2>
                </div>
                <p className="text-base text-gray-500 dark:text-neutral-400 max-w-2xl mt-2">
                    Complete your Know Your Customer (KYC) details to verify your identity and unlock payout capabilities to your bank account.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Bank Details Card */}
                <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-sm border border-gray-200 dark:border-neutral-800 overflow-hidden relative">
                    {/* Decorative Header */}
                    <div className="px-6 py-5 border-b border-gray-100 dark:border-neutral-800/60 bg-gray-50/50 dark:bg-neutral-900/30 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Building2 className="w-5 h-5 text-gray-400" />
                            <div>
                                <h3 className="text-base font-semibold text-gray-900 dark:text-white">Bank Account Details</h3>
                                <p className="text-xs text-gray-500 dark:text-neutral-400 mt-0.5">Where should we send your earnings?</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 sm:p-8 space-y-6">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {/* Account Holder Name */}
                            <div className="space-y-1.5 md:col-span-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-neutral-300">Account Holder Name</label>
                                <input
                                    type="text"
                                    name="accountHolderName"
                                    value={accountName}
                                    onChange={(e) => setAccountName(e.target.value)}
                                    placeholder="e.g. John Doe"
                                    className="w-full h-11 rounded-lg border border-gray-200 dark:border-neutral-800 bg-transparent px-4 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white transition-all shadow-sm outline-none"
                                    required
                                />
                            </div>

                            {/* Account Number */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-gray-700 dark:text-neutral-300">Bank Account Number</label>
                                <input
                                    type="text"
                                    name="bankAccountNumber"
                                    value={accountNumber}
                                    onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                                    placeholder="Enter your account number"
                                    pattern="[0-9]{9,18}"
                                    title="9-18 digit account number"
                                    className="w-full h-11 rounded-lg border border-gray-200 dark:border-neutral-800 bg-transparent px-4 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white transition-all shadow-sm outline-none font-mono"
                                    required
                                />
                            </div>

                            {/* IFSC Code */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-gray-700 dark:text-neutral-300">IFSC Code</label>
                                <div className="flex gap-3">
                                    <input
                                        type="text"
                                        name="ifscCode"
                                        value={IFSC}
                                        onChange={(e) => {
                                            setIFSC(e.target.value.toUpperCase());
                                            if (bankDetailsValid) setBankDetailsValid(false);
                                        }}
                                        placeholder="e.g. SBIN0001234"
                                        pattern="[A-Z]{4}0[A-Z0-9]{6}"
                                        title="Enter valid IFSC (e.g., SBIN0001234)"
                                        className={`w-full h-11 rounded-lg border bg-transparent px-4 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 transition-all shadow-sm outline-none font-mono uppercase ${bankDetailsValid ? 'border-green-500 focus:ring-1 focus:ring-green-500' : 'border-gray-200 dark:border-neutral-800 focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white'}`}
                                        required
                                    />
                                    <button
                                        onClick={verifyIFSC}
                                        disabled={isVerifying || bankDetailsValid}
                                        type="button"
                                        className="h-11 px-5 whitespace-nowrap bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-neutral-200 text-sm font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors disabled:opacity-50 border border-gray-200 dark:border-neutral-700 active:scale-95 flex items-center justify-center min-w-[90px]"
                                    >
                                        {isVerifying ? "..." : bankDetailsValid ? "Verified" : "Verify"}
                                    </button>
                                </div>
                                {bankDetailsValid && (
                                    <div className="flex items-center gap-1.5 mt-2 text-green-600 dark:text-green-500 animate-in slide-in-from-top-1">
                                        <CheckCircle2 className="w-4 h-4" />
                                        <span className="text-xs font-medium tracking-wide">Bank verified: {verifiedBankName}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Action Footer */}
                    <div className="px-6 py-5 border-t border-gray-100 dark:border-neutral-800/60 bg-gray-50/50 dark:bg-neutral-900/30 flex items-center justify-end">
                        <button
                            type="submit"
                            disabled={isSubmitting || !bankDetailsValid}
                            className=" px-6 py-3 bg-green-700 dark:bg-white text-white dark:text-gray-900 text-sm font-medium rounded-lg hover:bg-green-800 dark:hover:bg-gray-200 transition-all active:scale-[0.98] shadow-sm flex items-center justify-center gap-2 min-w-[180px] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                "Submitting..."
                            ) : (
                                <>
                                    Complete KYC
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}