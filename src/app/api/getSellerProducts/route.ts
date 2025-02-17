import { Product } from "@/models/product.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {

        const reqBody = await request.json();

        const { sellerId } = reqBody;

        if (sellerId.trim() === "") {
            return NextResponse.json({ error: "No Seller Id Found" }, { status: 402 })
        }

        const sellerProducts = await Product.find({ seller: sellerId })

        if (!sellerProducts) {
            return NextResponse.json({ error: "This seller has no products uploaded" }, { status: 401 })

        }

        return NextResponse.json({ data: sellerProducts }, { status: 200 })


    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 })
    }
}