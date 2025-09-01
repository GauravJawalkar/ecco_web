import connectDB from "@/db/dbConfig";
import { Order } from "@/models/orders.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_: NextRequest, params: { params: { id: string } }) {
    await connectDB();
    try {
        const { id } = await params.params;

        if (!id) {
            return NextResponse.json({ error: "Unauthorized Cant access the orders" }, { status: 400 })
        }

        const userOrders = await Order.find({ orderBy: id }).sort({ createdAt: -1 });

        if (userOrders?.length === 0) {
            return NextResponse.json({ data: [], message: "No orders found for this user." }, { status: 200 });
        }

        return NextResponse.json({
            data: userOrders
        }, { status: 200 })

    } catch (error) {
        console.error("Error fetching orders:", error);
        return NextResponse.json({ error: "Failed to fetch the orders from the database" }, { status: 500 })
    }
}