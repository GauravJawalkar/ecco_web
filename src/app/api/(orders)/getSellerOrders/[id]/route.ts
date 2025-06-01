import connectDB from "@/db/dbConfig";
import { Order } from "@/models/orders.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_: NextRequest, params: { params: { id: string } }) {
    await connectDB();
    try {
        const { id } = await params.params;
        console.log("id is : ", id);

        if (!id) {
            return NextResponse.json({ error: "Seller id is required for finding the seller" }, { status: 400 });
        }

        const sellerOrders = await Order.find({ 'orders.seller': id });

        if (!sellerOrders) {
            return NextResponse.json({ error: "No Orders found" }, { status: 404 });
        }

        return NextResponse.json({ data: sellerOrders }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: `Error finding the seller orders in the database : ${error}` });
    }
}