import connectDB from "@/db/dbConfig";
import { Cart } from "@/models/cart.model";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
    await connectDB()
    try {
        const reqBody = await request.json();

        const { _id, cartId } = reqBody.data;

        if (!cartId || !_id) {
            return NextResponse.json({ error: "cartId and itemId is required" }, { status: 400 })
        }


        const cart = await Cart.updateOne({ _id: cartId },
            {
                $pull: {
                    cartItems: { _id: { $in: [_id] } }
                }
            }
        );

        if (!cart) {
            return NextResponse.json({ error: "Cart with the given cartId not found" }, { status: 401 })
        }

        return NextResponse.json({ data: cart }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: `Error updating the cart : ${error}` }, { status: 500 })
    }
}