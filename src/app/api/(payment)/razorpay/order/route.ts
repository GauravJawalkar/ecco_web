import connectDB from '@/db/dbConfig';
import { User } from '@/models/user.model';
import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: NextRequest) {
    await connectDB()
    try {
        const reqBody = await request.json();
        const { amount, sellerId } = reqBody;
        const platformOwnerId = process.env.PLATFORM_MONGO_ACCOUNT_ID;

        const platFormAccount = await User.findById(platformOwnerId);
        const sellerAccount = await User.findById(sellerId);

        if (!platFormAccount || !sellerAccount) {
            return NextResponse.json({ error: "Seller Haven't completed the kyc process Yet" }, { status: 401 })
        }

        const commission = amount * 0.02; // 2% commission
        const sellerAmount = amount - commission;

        const order = await razorpay.orders.create({
            amount: amount * 100, // in paise
            currency: 'INR',
            receipt: `order_${Date.now()}`,
            notes: {
                seller_id: sellerId,
                commission: commission,
                seller_amount: sellerAmount
            },
            transfers: [
                {
                    account: platFormAccount?.bankDetails?.razorpayAccountId, // Main platform account
                    amount: commission * 100,
                    currency: 'INR'
                },
                {
                    account: sellerAccount?.bankDetails?.razorpayAccountId, // Seller's connected account
                    amount: sellerAmount * 100,
                    currency: 'INR'
                }
            ]
        });
        return NextResponse.json({ data: `Paid Successfully : ${order}` }, { status: 200 });
    } catch (err) {
        console.error("Error razorPay : ", err);
        return NextResponse.json({ error: `'Failed to create order : '${err}` }, { status: 500 });
    }
}
