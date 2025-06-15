import connectDB from "@/db/dbConfig";
import { Cart } from "@/models/cart.model";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

connectDB();
export async function GET(_: NextRequest, params: { params: { id: string } }) {
    try {
        const { id } = await params?.params;

        if (!id) {
            return NextResponse.json({ error: `CartOwnerId not found` }, { status: 400 })
        }

        const cookieStore = await cookies();

        const authenticated = cookieStore.get('accessToken')?.value;

        if (!authenticated) {
            return NextResponse.json({ data: { cartItems: [] }, message: "Unauthorized ! Login First" }, { status: 200 })
        }

        const cart = await Cart.findOne({
            cartOwner: id
        });

        return NextResponse.json({ data: cart }, { status: 200 })

    } catch (error) {
        return NextResponse.json({ error: `Error fdetching the Cart from Db : ${error}` }, { status: 500 })
    }
}