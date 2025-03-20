import { Product } from "@/models/product.model";
import { NextResponse } from "next/server";

export async function GET() {
    try {

        const allProducts = await Product.find();

        if (!allProducts) {
            return NextResponse.json({ error: "No products found" }, { status: 402 })
        }

        return NextResponse.json({ data: allProducts }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 })
    }
}