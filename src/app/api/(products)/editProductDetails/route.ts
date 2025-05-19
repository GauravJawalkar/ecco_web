import connectDB from "@/db/dbConfig";
import { Product } from "@/models/product.model";
import { NextRequest, NextResponse } from "next/server";

connectDB();
export async function PUT(request: NextRequest) {
    try {

        const reqBody = await request.json();

        const { id, name, description, price, discount, size, stock, category } = reqBody;

        if (id.trim() === "") {
            return NextResponse.json({ error: "id is required" }, { status: 402 })
        }

        String(price);
        String(discount);
        String(size);
        String(stock);

        if ([name, description, category].some((field) => field.trim() === "")) {
            return NextResponse.json({ error: "All the mentioned fields are required" }, { status: 403 })
        }

        const updatedDetails = await Product.findByIdAndUpdate(id,
            {
                $set: {
                    name,
                    description,
                    price,
                    discount,
                    stock,
                    size,
                    category
                },
            },
            {
                new: true
            }
        )

        if (!updatedDetails) {
            return NextResponse.json({ error: "Failed to update the product details" }, { status: 401 })
        }

        return NextResponse.json({ data: updatedDetails }, { status: 200 })


    } catch (error) {
        console.log("Error updating product details : ", error)
        return NextResponse.json({ error: error }, { status: 500 })
    }
}