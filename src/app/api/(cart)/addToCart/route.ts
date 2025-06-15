import connectDB from "@/db/dbConfig";
import { Cart } from "@/models/cart.model";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    await connectDB();
    try {
        const cookieStore = await cookies();

        const accessToken = cookieStore.get('accessToken')?.value;

        if (!accessToken || accessToken.trim() === "" || accessToken === undefined) {
            return NextResponse.json({ error: "Unauthorized Access" }, { status: 403 });
        }
        const reqBody = await request.json();

        const { cartOwner, name, price, image, sellerName, discount, stock, productId, sellerId } = reqBody;

        const quantity = 1;

        if (!cartOwner) {
            return NextResponse.json({ error: "Unauthorized User" }, { status: 400 })
        }

        console.log("Cart Req Body: ", reqBody);

        if (!name || !price || !image || !sellerName || !discount || !productId || !sellerId) {
            return NextResponse.json({ error: "Product Details Not Found" }, { status: 401 })
        }

        console.log("Seller Id is : ", sellerId);

        const existingCart = await Cart.findOne({ cartOwner });

        // Create new cart if none exists
        if (!existingCart) {
            const newCart = await Cart.create(
                {
                    cartOwner,
                    cartItems: [{ name, price, image, quantity, sellerName, discount, stock: stock, productId: productId, sellerId: sellerId }],
                }
            );
            await newCart.save();

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
            existingCart.cartItems.push({ name, price, image, quantity, discount, sellerName, stock: stock, productId, sellerId: sellerId });
        }

        const updatedCart = await existingCart.save();

        if (!updatedCart) {
            return NextResponse.json({ error: "Failed to update the cart in the database" }, { status: 404 })
        }

        return NextResponse.json(
            { data: updatedCart },
            { status: 200 }
        );

    } catch (error) {
        return NextResponse.json({ error: `Error adding to the DB cart : ${error}` }, { status: 500 })
    }
}