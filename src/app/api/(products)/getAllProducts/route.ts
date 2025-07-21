import { Product } from "@/models/product.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = 12;

        const skip = (page - 1) * limit;

        const totalProducts = await Product.countDocuments();

        const allProducts = await Product.find().skip(skip).limit(limit);

        if (!allProducts) {
            return NextResponse.json({ error: "No products found" }, { status: 402 })
        }

        return NextResponse.json(
            {
                data: allProducts,
                totalProducts: totalProducts,
                totalPages: Math.ceil(totalProducts / limit),
                currentPage: page
            }
            , { status: 200 })
    } catch (error) {
        console.error("Error in GET allProducts API:", error);
        return NextResponse.json({ error: error }, { status: 500 })
    }
}   