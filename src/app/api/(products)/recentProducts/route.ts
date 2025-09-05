import connectDB from "@/db/dbConfig";
import { Product } from "@/models/product.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    await connectDB();
    try {
        const reqBody = await request.json();

        const { products } = reqBody;

        const results = await Product.find({ _id: { $in: products } });

        if (results?.length === 0) {
            return NextResponse.json({ message: 'No Recent products Found' }, { status: 200 })
        }

        return NextResponse.json({ data: results }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: `Failed to fetch the recent product from the database` }, { status: 500 })
    }
}