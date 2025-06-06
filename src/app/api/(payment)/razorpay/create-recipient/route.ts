import connectDB from '@/db/dbConfig';
import { User } from '@/models/user.model';
import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: NextRequest) {
    await connectDB();

    try {
        const { kycId, accountNumber, ifscCode, name } = await request.json();

        if (!kycId || !accountNumber || !ifscCode || !name) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const seller = await User.findById(kycId);
        if (!seller) {
            return NextResponse.json({ error: 'Seller not found' }, { status: 404 });
        }

        let customerId = seller.bankDetails?.razorpayAccountId;
        let fundAccountId = seller.bankDetails?.razorpayFundAccountId;

        // If customer doesn't exist in our DB
        if (!customerId) {
            try {
                console.log('Creating new Razorpay customer...');
                const contact = await razorpay.customers.create({
                    name,
                    email: seller.email || `${seller._id}@example.com`, // Ensure unique email
                    contact: seller.phone || `+91${Math.random().toString().slice(2, 12)}`, // Ensure unique phone
                    notes: {
                        role: 'marketplace-seller',
                        kycId: kycId
                    },
                });
                customerId = contact.id;
                console.log('New customer created:', customerId);
            } catch (error: any) {
                if (error.error?.code === 'BAD_REQUEST_ERROR' &&
                    error.error.description.includes('already exists')) {
                    // Customer exists but not in our DB - find it
                    const customers: any = await (razorpay as any).customers.all({
                        email: seller.email || `${seller._id}@example.com`
                    });
                    if (customers.items.length > 0) {
                        customerId = customers.items[0].id;
                        console.log('Found existing customer:', customerId);
                    } else {
                        throw error;
                    }
                } else {
                    throw error;
                }
            }
        } else {
            console.log('Using existing customer from DB:', customerId);
        }

        // Create fund account only if we don't have one or bank details changed
        if (!fundAccountId ||
            seller.bankDetails?.accountNumber !== accountNumber ||
            seller.bankDetails?.ifscCode !== ifscCode) {

            console.log('Creating new fund account...');
            const fundAccount = await razorpay.fundAccount.create({
                customer_id: customerId,
                account_type: 'bank_account',
                bank_account: {
                    name,
                    account_number: accountNumber, // Using original account number
                    ifsc: ifscCode,
                },
            });
            fundAccountId = fundAccount.id;
            console.log('New fund account created:', fundAccountId);
        } else {
            console.log('Using existing fund account:', fundAccountId);
        };

        const updatedUser = await User.findByIdAndUpdate(
            seller._id,
            {
                $set: {
                    'bankDetails.razorpayFundAccountId': fundAccountId,
                    'bankDetails.razorpayAccountId': customerId,
                    'bankDetails.status': 'Verified',
                    'bankDetails.accountNumber': accountNumber,
                    'bankDetails.ifscCode': ifscCode,
                    'bankDetails.accountName': name,
                },
            },
            { new: true }
        );

        if (!updatedUser) {
            return NextResponse.json({ error: 'Failed to update seller details' }, { status: 401 });
        }

        return NextResponse.json(
            {
                data: {
                    razorpayContactId: customerId,
                    razorpayFundAccountId: fundAccountId,
                },
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Razorpay create-recipient error:', error);
        return NextResponse.json(
            {
                error: error.error?.description || error.message || 'Failed to process Razorpay request',
                ...(process.env.NODE_ENV === 'development' && {
                    stack: error.stack,
                    details: error.error
                }),
            },
            { status: error.statusCode || 500 }
        );
    }
}