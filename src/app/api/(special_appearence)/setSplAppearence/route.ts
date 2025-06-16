import { Product } from "@/models/product.model";
import { SpecialAppearence } from "@/models/specialAppearence.model";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
    try {
        const reqBody = await request.json()

        const { _id, productId } = reqBody;

        console.log("Product Id is : ", reqBody);

        if (!_id || !productId) {
            return NextResponse.json({ error: "Product ID not provided" }, { status: 400 })
        }

        const productExist = await Product.findById({ _id: productId });

        if (!productExist) {
            await SpecialAppearence.findByIdAndDelete(_id);
            return NextResponse.json({ message: "No Product found.Removed from special appearance." }, { status: 404 })
        }

        const setProductAsSpecial = await SpecialAppearence.findByIdAndUpdate(_id,
            {
                $set: {
                    setActive: true
                }
            },
            {
                new: true,
                upsert: true
            }
        );

        return NextResponse.json({ data: setProductAsSpecial }, { status: 200 })

    } catch (error) {
        console.error("Failed to set the products for special appearence", error)
        return NextResponse.json({ error: "Failed to set the products for special appearence" }, { status: 500 })
    }
}