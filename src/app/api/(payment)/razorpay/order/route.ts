import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: NextRequest) {
    const reqBody = await request.json();
    const { amount, currency = 'INR', receipt } = reqBody;

    try {
        const options = {
            amount: amount * 100, // amount in paise
            currency,
            receipt,
        };

        const order = await razorpay.orders.create(options);
        return NextResponse.json(order);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }
}
