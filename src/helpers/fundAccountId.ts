import Razorpay from "razorpay";

export async function getFundAccountDetails(fundAccountId: string) {
    try {
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID || "",
            key_secret: process.env.RAZORPAY_KEY_SECRET || "",
        });
        const fundAccount = await razorpay.fundAccount.fetch(fundAccountId);
        return fundAccount.items[0].id; // This should be the correct 18-character ID
    } catch (error) {
        console.error('Error fetching fund account:', error);
        throw error;
    }
}

