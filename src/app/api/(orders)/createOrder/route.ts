import connectDB from "@/db/dbConfig";
import { Order } from "@/models/orders.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    await connectDB();
    try {
        const reqBody = await request.json();

        const { orderName, orderPrice, orderDiscount, quantity, contactNumber, address, pinCode, landMark, orderImage, paymentMethod, paymentStatus, userId } = reqBody.orderDetails;

        console.log(reqBody.orderDetails);

        if ([orderName, address, pinCode, landMark, orderImage, paymentMethod, paymentStatus, userId].some((elem: string) => { elem.trim() === "" })) {
            return NextResponse.json({ error: "Required Fields cannot be empty" }, { status: 400 });
        }

        const order = await Order.create({
            orderName,
            orderImage,
            orderBy: userId,
            contactNumber,
            orderPrice,
            orderDiscount,
            orderQuantity: quantity,
            deliveryAddress: address,
            pinCode,
            landMark,
            paymentMethod,
            paymentStatus,
        })

        if (!order) {
            return NextResponse.json({ error: "Failed to create the product Order" }, { status: 401 })
        }

        return NextResponse.json({ data: order }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: `"Failed to create the request in the database" : ${error}` }, { status: 500 })
    }
}