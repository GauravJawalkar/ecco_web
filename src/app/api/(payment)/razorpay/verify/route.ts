import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
    const reqBody = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = reqBody;

    const secret = process.env.RAZORPAY_KEY_SECRET!;
    const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(razorpay_order_id + '|' + razorpay_payment_id)
        .digest('hex');

    if (expectedSignature === razorpay_signature) {
        return NextResponse.json({ success: true });
    } else {
        return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 400 });
    }
}
