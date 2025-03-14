import connectDB from "@/db/dbConfig";
import { BecomeSeller } from "@/models/becomeSeller.model";
import { User } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function POST(request: NextRequest) {
    try {

        const reqBody = await request.json();

        const { sellerId, _id } = reqBody;

        if (!sellerId) {
            return NextResponse.json({ error: "seller id is required" }, { status: 402 })
        };

        const authorizedSeller = await User.findByIdAndUpdate(sellerId,
            {
                $set: {
                    isSeller: true
                }
            },
            {
                new: true
            }
        ).select("-refreshToken -forgotPasswordOTP -forgotPasswordOTPexpiry -emailVerificationOTP -emailVerificationOTPexpiry -isSuperAdmin -password");

        if (!authorizedSeller) {
            return NextResponse.json({ error: "Failed to authorize the seller" }, { status: 402 })
        }

        const sellerRequestAuthorized = await BecomeSeller.findByIdAndDelete(_id);

        if (!sellerRequestAuthorized) {
            return NextResponse.json({ error: "Failed to delete the sorted request" }, { status: 402 })
        }

        return NextResponse.json({ data: authorizedSeller }, { status: 200 })

    } catch (error) {
        return NextResponse.json({ error: "Failed to authorize the seller" }, { status: 500 })
    }
}