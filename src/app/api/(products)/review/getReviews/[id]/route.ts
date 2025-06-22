import connectDB from "@/db/dbConfig";
import { Reviews } from "@/models/review.models";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_request: NextRequest, params: { params: { id: string } }) {
    await connectDB();
    try {

        const { id } = await params.params
        const url = new URL(_request.url);
        const limit = 5;
        const skip = parseInt(url.searchParams.get("skip") || "0");

        if (!id) {
            return NextResponse.json({ error: "Id is required" }, { status: 400 })
        }

        const productReviews = await Reviews.find({ reviewedProduct: id }).skip(skip).limit(limit).sort({ createdAt: -1 });

        const totalReviews = await Reviews.countDocuments({ reviewedProduct: id })

        if (!productReviews) {
            return NextResponse.json({ error: "No reviews found" }, { status: 402 })
        }

        return NextResponse.json({ data: productReviews, total: totalReviews }, { status: 200 })

    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch the reviews" }, { status: 500 })
    }
}