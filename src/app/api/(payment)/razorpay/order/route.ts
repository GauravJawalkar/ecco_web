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
        const platformOwnerId = process.env.Acc_ID;

        const sellerAccount = await User.findById(sellerId);
        console.log("Sellet Acc_Id : ", sellerAccount?.bankDetails?.razorpayFundAccountId);

        if (!sellerAccount) {
            return NextResponse.json({ error: "Seller Haven't completed the kyc process Yet" }, { status: 401 })
        }

        if (!sellerAccount?.bankDetails?.razorpayFundAccountId) {
            return NextResponse.json(
                { error: "Seller hasn't completed KYC process yet" },
                { status: 400 }
            );
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
                    account: platformOwnerId, // Main platform account
                    amount: commission * 100,
                    currency: 'INR'
                },
                {
                    account: sellerAccount?.bankDetails?.razorpayFundAccountId, // Seller's connected account
                    amount: sellerAmount * 100,
                    currency: 'INR'
                }
            ]
        });
        return NextResponse.json({ data: `Paid Successfully : ${order}` }, { status: 200 });
    } catch (error) {
        console.error("Error razorPay : ", error);
        return NextResponse.json({ error: `Failed to create order : ${error}` }, { status: 500 });
    }
}
