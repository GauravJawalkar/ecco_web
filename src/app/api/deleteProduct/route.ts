import connectDB from "@/db/dbConfig";
import { Product } from "@/models/product.model";
import { User } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";


connectDB();

export async function DELETE(request: NextRequest) {
    try {

        const reqBody = await request.json();

        const { productId, sellerId } = reqBody;

        if (!productId || !sellerId) {
            return NextResponse.json({ error: "productId and sellerId are required" }, { status: 401 })
        }

        const user = await User.findById(sellerId);

        if (!user) {
            return NextResponse.json({ error: "Failed to find the seller" }, { status: 404 })
        }

        const isSeller = user?.isSeller;

        if (!isSeller) {
            return NextResponse.json({ error: "Can't delete the product! Youre are unauthorized" }, { status: 402 })
        }

        const deletedProduct = await Product.findByIdAndDelete(productId);

        if (!deletedProduct) {
            return NextResponse.json({ error: "Failed to delete the product" }, { status: 402 })
        }

        return NextResponse.json({ product: "Product Deletes Successfully" }, { status: 200 })

    } catch (error) {

        console.log("Error Deleting Product : ", error)
        return NextResponse.json({ error: "Failed to delete the product" }, { status: 500 })

    }
}