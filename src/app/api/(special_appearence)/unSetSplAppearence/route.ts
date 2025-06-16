import { Product } from "@/models/product.model";
import { SpecialAppearence } from "@/models/specialAppearence.model";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
    try {
        const reqBody = await request.json();

        const { _id, productId } = reqBody;

        if (!_id || !productId) {
            return NextResponse.json(
                { error: "Didnt got the id from frontend" },
                { status: 402 }
            );
        }

        const productExist = await Product.findById({ _id: productId });

        if (!productExist) {
            await SpecialAppearence.findByIdAndDelete(_id);
            return NextResponse.json({ message: "No Product found.Removed from special appearance." }, { status: 404 })
        }

        const removedFromUnset = await SpecialAppearence.findByIdAndUpdate(
            _id,
            {
                $set: {
                    setActive: false,
                },
            },
            {
                new: true,
            }
        );

        if (!removedFromUnset) {
            return NextResponse.json(
                { error: "Failed to unset the product" },
                { status: 401 }
            );
        }

        return NextResponse.json(
            { data: "Special product Unset" },
            { status: 200 }
        );

    } catch (error) {
        return NextResponse.json(
            { error: "Failed to unset in database" },
            { status: 500 }
        );
    }
}
