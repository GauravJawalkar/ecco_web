import Razorpay from "razorpay";

async function getFundAccountDetails(fundAccountId: string) {
    try {
        const fundAccount = await Razorpay.fundAccount.fetch(fundAccountId);
        return fundAccount.id; // This should be the correct 18-character ID
    } catch (error) {
        console.error('Error fetching fund account:', error);
        throw error;
    }
}

