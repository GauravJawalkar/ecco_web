// app/api/razorpay/create-recipient/route.ts
import connectDB from '@/db/dbConfig';
import { User } from '@/models/user.model';
import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: NextRequest) {
    connectDB();
    try {
        const { kycId, accountNumber, ifscCode, name } = await request.json();

        const seller = await User.findById(kycId);

        if (!seller) {
            return NextResponse.json({ error: "Failed to get the seller details" }, { status: 401 })
        }

        // First try to find existing customer by email
        let customer;
        try {
            const customers: any = await razorpay.customers.all({
                email: seller.email,
                count: 1
            });

            if (customers.items.length > 0) {
                customer = customers.items[0];
            } else {
                // Create new customer if not found
                customer = await razorpay.customers.create({
                    name: name,
                    email: seller.email,
                    contact: "+918767677119",
                    notes: {
                        kycId,
                        type: 'seller'
                    }
                });
            }
        } catch (err) {
            console.error('Error in customer lookup/creation:', err);
            throw err;
        }

        // Proceed with fund account creation
        const fundAccount = await razorpay.fundAccount.create({
            customer_id: customer.id,
            account_type: 'bank_account',
            bank_account: {
                name,
                account_number: accountNumber,
                ifsc: ifscCode
            }
        });
        console.log("Created fund account:", fundAccount.id);

        const updatedSeller = await User.findByIdAndUpdate(
            seller?._id,
            {
                $set: {
                    "bankDetails.razorpayFundAccountId": fundAccount.id,
                    "bankDetails.razorpayAccountId": customer.id,
                    "bankDetails.status": "Verified"
                }
            },
            {
                new: true,
                select: 'bankDetails'
            }
        );

        if (!updatedSeller) {
            return NextResponse.json({ error: "Failed to update seller record" }, { status: 404 });
        }

        return NextResponse.json(
            {
                success: true,
                account_id: customer.id,
                fund_account_id: fundAccount.id,
                updated: updatedSeller.bankDetails
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Full error:', JSON.stringify(error, null, 2));
        return NextResponse.json(
            {
                error: error.error?.description || error.message || "Internal server error",
                details: {
                    step: error.error?.step,
                    code: error.error?.code,
                    field: error.error?.field
                },
                solution: error.error?.code === 'BAD_REQUEST_ERROR'
                    ? '1. Enable Route in Razorpay Dashboard\n2. Verify bank details\n3. Check API permissions'
                    : 'Contact support with the error details'
            },
            { status: error.statusCode || 500 }
        );
    }
}