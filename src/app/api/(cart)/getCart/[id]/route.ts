import connectDB from "@/db/dbConfig";
import { Cart } from "@/models/cart.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_: NextRequest, params: { params: { id: string } }) {
    await connectDB();
    try {
        const { id } = await params?.params;


        if (!id) {
            return NextResponse.json({ error: `CartOwnerId not found` }, { status: 400 })
        }

        const cart = await Cart.findOne({
            cartOwner: id
        });

        return NextResponse.json({ data: cart }, { status: 200 })

    } catch (error) {
        return NextResponse.json({ error: `Error fdetching the Cart from Db : ${error}` }, { status: 500 })
    }
}