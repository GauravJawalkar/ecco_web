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

        const sellerAccount = await User.findById(sellerId);

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

        // (Payment Collection) in my own account
        const order = await razorpay.orders.create({
            amount: amount * 100, // in paise
            currency: 'INR',
            receipt: `order_${Date.now()}`,
            payment_capture: true, // Auto-capture payments
            notes: {
                seller_id: sellerId,
                seller_fund_account_id: sellerAccount.bankDetails.razorpayFundAccountId,
                commission,
                seller_amount: sellerAmount,
                purpose: "Marketplace transaction"
            }
        });

        return NextResponse.json({
            success: true,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            receipt: order.receipt
        }, { status: 200 });
    } catch (error: any) {
        console.error("Payment processing error:", error);

        return NextResponse.json(
            { error: error.error?.description || "Payment processing failed" },
            { status: error.statusCode || 500 }
        );
    }
}
