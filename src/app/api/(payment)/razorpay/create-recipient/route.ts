// app/api/razorpay/create-recipient/route.ts
import { User } from '@/models/user.model';
import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const razorpay: any = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: NextRequest) {
    try {
        const { kycId, accountNumber, ifscCode, name } = await request.json();

        const seller = await User.findById(kycId);

        if (!seller) {
            return NextResponse.json({ error: "Failed to get the seller details" }, { status: 401 })
        }

        const razorpayAccount = await razorpay.accounts.create({
            email: seller?.email,
            contact: '+918767677119', // Remove spaces from contact
            type: 'route', // Required for split payments
            profile: {
                name
            },
        });

        console.log("acc_id is : ", razorpayAccount?.id);

        // Use the correct API method - customers.create for recipient creation
        const customer = await razorpay.customers.create({
            name,
            email: seller?.email,
            contact: '+918767677119', // No spaces, include country code
            notes: {
                seller_id: kycId,
                platform: 'ecco_web_platform'
            }
        });

        const fundAccount = await razorpay.fundAccount.create({
            customer_id: customer.id,
            account_type: 'bank_account',
            bank_account: {
                name,
                account_number: accountNumber,
                ifsc: ifscCode
            }
        });

        return NextResponse.json(
            { data: fundAccount?.id, acc_id: razorpayAccount?.id },
            { status: 200 }
        );
    } catch (error) {
        console.error('Recipient creation error:', error);
        return NextResponse.json(
            { error: 'Failed to create recipient' },
            { status: 500 }
        );
    }
}