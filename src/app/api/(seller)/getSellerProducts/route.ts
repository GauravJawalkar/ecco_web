import connectDB from "@/db/dbConfig";
import { Product } from "@/models/product.model";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { sellerId, page = 1, limit = 10 } = reqBody;

        if (!sellerId || sellerId.trim() === "") {
            return NextResponse.json({ error: "No Seller Id Found" }, { status: 400 });
        }

        const parsedPage = parseInt(page) || 1;
        const parsedLimit = parseInt(limit) || 5;
        const skip = (parsedPage - 1) * parsedLimit;

        const products = await Product.find({ seller: sellerId }).skip(skip).limit(parsedLimit);

        const totalCount = await Product.countDocuments({ seller: sellerId });

        return NextResponse.json({
            data: products,
            totalCount,
            totalPages: Math.ceil(totalCount / parsedLimit),
            currentPage: parsedPage
        }, { status: 200 });

    } catch (error: any) {
        console.error("Error in getSellerProducts API:", error);
        return NextResponse.json({ error: error.message || "Server error" }, { status: 500 });
    }
}
