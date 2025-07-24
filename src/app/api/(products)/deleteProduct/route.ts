import connectDB from "@/db/dbConfig";
import { Product } from "@/models/product.model";
import { SpecialAppearence } from "@/models/specialAppearence.model";
import { User } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";


connectDB();

export async function DELETE(request: NextRequest) {
    try {

        const reqBody = await request.json();

        const { productId, sellerId } = reqBody;

        console.log("productId is : ", productId);
        console.log("sellerId is : ", sellerId);

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

        const existsInSpecialAppearence = await SpecialAppearence.findOne({ productId });

        let deleteFromSpecialAppearence = null;
        let deletedProduct = null;

        if (existsInSpecialAppearence) {
            if (existsInSpecialAppearence.requestedBy.toString() !== sellerId) {
                return NextResponse.json({ error: "You are not authorized to delete this product from special appearance" }, { status: 403 });
            }
            // Delete from SpecialAppearence
            deleteFromSpecialAppearence = await SpecialAppearence.findOneAndDelete({ productId });
        }

        // Always delete from Product
        deletedProduct = await Product.findByIdAndDelete(productId);

        if (!deletedProduct) {
            return NextResponse.json({ error: "Failed to delete the product" }, { status: 402 });
        }

        return NextResponse.json({ product: "Product Deleted Successfully" }, { status: 200 })

    } catch (error) {
        console.error("Error Deleting Product : ", error)
        return NextResponse.json({ error: "Failed to delete the product" }, { status: 500 })

    }
}