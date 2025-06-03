import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/db/dbConfig";
import { User } from "@/models/user.model";

export async function POST(request: NextRequest) {
    await connectDB();
    try {
        const reqBody = await request.json();
        const { sellerId, razorpayRecipientId, kycStatus, acc_id } = reqBody;
        console.log(reqBody);
        const requirements = [sellerId, razorpayRecipientId, kycStatus]

        if (requirements.some((elem) => elem.trim() === "")) {
            return NextResponse.json({ error: "All the mentioned fields are required" }, { status: 402 })
        }

        const seller = await User.findByIdAndUpdate(sellerId,
            {
                $set: {
                    "bankDetails.razorpayFundAccountId": razorpayRecipientId,
                    "bankDetails.razorpayAccountId": acc_id,
                    "bankDetails.status": kycStatus
                }
            },
            {
                new: true
            }
        );

        if (!seller) {
            return NextResponse.json({ error: "Seller Not Found In DB" }, { status: 403 })
        }

        return NextResponse.json({ data: "KYC Verified" }, { status: 200 })

    } catch (error) {
        console.error("Failed to verify the KYC details : ", error)
        return NextResponse.json({ error: "Failed to verify the KYC details In DB" }, { status: 500 })
    }
}