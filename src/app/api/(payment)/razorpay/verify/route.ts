import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import connectDB from '@/db/dbConfig';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: NextRequest) {
    await connectDB();
    try {
        const reqBody = await request.json();
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = reqBody;

        const secret = process.env.RAZORPAY_KEY_SECRET!;
        // 1. Verifying payment signature
        const generatedSignature = crypto
            .createHmac('sha256', secret)
            .update(razorpay_order_id + '|' + razorpay_payment_id)
            .digest('hex');

        if (generatedSignature !== razorpay_signature) {
            return NextResponse.json(
                { error: "Invalid payment signature" },
                { status: 400 }
            );
        }

        // 2. Fetch order details to get seller info
        const order = await razorpay.orders.fetch(razorpay_order_id);
        const { seller_fund_account_id, commission, seller_amount }: any = order.notes;

        // 3. Initiate payout to seller
        const payout = await (razorpay as any).payouts.create({
            account_number: seller_fund_account_id,
            amount: seller_amount * 100,
            currency: 'INR',
            mode: 'IMPS',
            purpose: 'payout',
            reference_id: `payout_${Date.now()}`,
            notes: {
                order_id: razorpay_order_id,
                payment_id: razorpay_payment_id,
                commission
            }
        });

        return NextResponse.json({
            success: true,
            payoutId: payout.id,
            payoutStatus: payout.status
        });

    } catch (error: any) {
        console.error("Payout processing error:", error);
        return NextResponse.json(
            { error: error.error?.description || "Payout processing failed" },
            { status: error.statusCode || 500 }
        );
    }
}
