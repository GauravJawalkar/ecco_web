import connectDB from "@/db/dbConfig";
import { Product } from "@/models/product.model";
import { NextResponse } from "next/server";


connectDB();

export async function GET() {
    try {

        const products = await Product.find();

        if (products.length === 0) {
            return NextResponse.json({ error: "No products found" }, { status: 402 })
        }

        return NextResponse.json({ data: products }, { status: 200 })

    } catch (error) {
        return NextResponse.json({ error: "Failed to get the products" }, { status: 500 })
    }
}