// app/api/kyc/submit/route.ts
import connectDB from '@/db/dbConfig';
import { User } from '@/models/user.model';
import { NextRequest, NextResponse } from 'next/server';


export async function POST(request: NextRequest) {
    await connectDB();
    try {
        const reqBody = await request.json();

        const { accountName, accountNumber, IFSC, sellerId } = reqBody;

        await User.findByIdAndUpdate(
            sellerId,
            {
                $set: {
                    'bankDetails.account_holder_name': accountName,
                    'bankDetails.account_number': accountNumber,
                    'bankDetails.ifsc': IFSC,
                    'bankDetails.status': "Pending",
                }
            },
            { new: true }
        );

        return NextResponse.json(
            { success: true, kycId: sellerId },
            { status: 200 }
        );
    } catch (error) {
        console.error('KYC submission error:', error);
        return NextResponse.json(
            { error: `Failed to submit KYC : ${error}` },
            { status: 500 }
        );
    }
}