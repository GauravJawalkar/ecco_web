import connectDB from "@/db/dbConfig";
import { BecomeSeller } from "@/models/becomeSeller.model";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();

        const { sellerId, isEmailVerified, email, avatar } = reqBody;

        if (!sellerId || !email) {
            return NextResponse.json(
                { error: "Seller id & email is mandatory" },
                { status: 402 }
            );
        }

        // Check if already requested for becoming a seller
        const existingRequest = await BecomeSeller.findOne({ email });

        if (existingRequest) {
            return NextResponse.json({ error: "You have already requested for becoming an seller" }, { status: 400 })
        }

        const becomeSellerRequest = await BecomeSeller.create({
            sellerId: sellerId,
            isEmailVerified: isEmailVerified,
            email: email,
            avatar: avatar
        });

        if (!becomeSellerRequest) {
            return NextResponse.json({ error: "Failed to send the request to SuperAdmin" }, { status: 500 })
        }

        return NextResponse.json({ data: becomeSellerRequest }, { status: 200 })

    } catch (error) {
        return NextResponse.json(
            { error: "Failed to send request" },
            { status: 500 }
        );
    }
}
