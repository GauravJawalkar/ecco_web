import connectDB from "@/db/dbConfig";
import { Order } from "@/models/orders.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_: NextRequest, params: { params: { id: string } }) {
    await connectDB();
    try {
        const { id } = await params.params;

        if (!id) {
            return NextResponse.json({ error: "Invalid Seller Id" }, { status: 400 });
        }

        const sellerOrders = await Order.find({ 'orders.seller.sellerId': id });

        if (!sellerOrders) {
            return NextResponse.json({ error: "No Orders found in database" }, { status: 404 });
        }

        const filteredOrders = sellerOrders.map(order => {
            const relevantOrders = order.orders.filter((orderItem: { seller: any[]; }) =>
                orderItem.seller.some(s => String(s.sellerId) === id)
            );

            return {
                _id: order._id,
                orderBy: order.orderBy,
                createdAt: order.createdAt,
                updatedAt: order.updatedAt,
                orders: relevantOrders
            };
        }).filter(order => order.orders.length > 0);

        const totalSellerOrders = filteredOrders.reduce((acc, doc) => acc + doc.orders.length, 0);

        return NextResponse.json({ data: filteredOrders, total: totalSellerOrders }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: `Error finding the seller orders: ${error}` }, { status: 500 });
    }
}
