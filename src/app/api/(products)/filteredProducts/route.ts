import connectDB from "@/db/dbConfig";
import { Product } from "@/models/product.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    await connectDB();
    try {
        const reqBody = await request.json();

        const { category } = reqBody;


        if (category.trim() === "") {
            return NextResponse.json({ error: "Invalid category value" }, { status: 400 })
        }

        const filteredProducts = await Product.find({ category: category });

        if (!filteredProducts) {
            return NextResponse.json({ error: "Failed to fetch the filtered Products" }, { status: 401 })
        }

        return NextResponse.json({ data: filteredProducts }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: `Error getting filtered products : ${error}` }, { status: 500 })
    }
}