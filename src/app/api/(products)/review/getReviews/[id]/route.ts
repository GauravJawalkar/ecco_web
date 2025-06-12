import connectDB from "@/db/dbConfig";
import { Reviews } from "@/models/review.models";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_request: NextRequest, params: { params: { id: string } }) {
    await connectDB();
    try {

        const { id } = await params.params

        if (!id) {
            return NextResponse.json({ error: "Id is required" }, { status: 400 })
        }

        const productReviews = await Reviews.find({ reviewedProduct: new mongoose.Types.ObjectId(id) });

        if (!productReviews) {
            return NextResponse.json({ error: "No reviews found" }, { status: 402 })
        }

        return NextResponse.json({ data: productReviews }, { status: 200 })

    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch the reviews" }, { status: 500 })
    }
}