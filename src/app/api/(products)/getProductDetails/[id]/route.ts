import connectDB from "@/db/dbConfig";
import { Product } from "@/models/product.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET({ params }: { params: { id: string } }) {
    await connectDB();

    try {
        const { id } = await params;

        console.log(id)

        if (!id) {
            return NextResponse.json({ error: "Id is required" }, { status: 401 })
        }

        const product = await Product.findById(id);

        console.log("Product is : ", product)

        if (!product) {
            return NextResponse.json({ error: "Product Not found in the database" }, { status: 402 })
        }

        return NextResponse.json({ data: product }, { status: 200 })

    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch the details" }, { status: 500 })
    }


}