import connectDB from "@/db/dbConfig";
import { Cart } from "@/models/cart.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    await connectDB();
    try {
        const reqBody = await request.json();

        const { cartOwner, name, price, image } = reqBody;

        const quantity = 1;

        if (!cartOwner) {
            return NextResponse.json({ error: "Unauthorized User" }, { status: 400 })
        }

        if (!name || !price || !image) {
            return NextResponse.json({ error: "Product Details Not Found" }, { status: 401 })
        }

        let existingCart = await Cart.findOne({ cartOwner });

        // Create new cart if none exists
        if (!existingCart) {
            const newCart = await Cart.create({
                cartOwner,
                cartItems: [{ name, price, image, quantity }],
            });

            return NextResponse.json(
                { data: `"Cart created and item added": ${newCart}` },
                { status: 201 }
            );
        }

        // Check if product is already in cart
        const existingItemIndex = existingCart.cartItems.findIndex(
            (item: any) => item?.name === name
        );

        if (existingItemIndex > -1) {
            // Increment quantity
            existingCart.cartItems[existingItemIndex].quantity += quantity;
        } else {
            // Add new item
            existingCart.cartItems.push({ name, price, image, quantity });
        }

        const updatedCart = await existingCart.save();

        return NextResponse.json(
            { data: updatedCart },
            { status: 200 }
        );

    } catch (error) {
        return NextResponse.json({ error: `Error adding to the DB cart : ${error}` }, { status: 500 })
    }
}