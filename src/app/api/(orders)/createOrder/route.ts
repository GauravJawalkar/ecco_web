import connectDB from "@/db/dbConfig";
import { Order } from "@/models/orders.model";
import { Product } from "@/models/product.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    await connectDB();
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const reqBody = await request.json();

        const { orderName, orderPrice, orderDiscount, quantity, contactNumber, address, pinCode, landMark, orderImage, paymentMethod, paymentStatus, userId, sellerId, orderConfirmation, productId } = reqBody.orderDetails;

        const product = await Product.findById(productId).session(session);

        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 403 })
        }

        if (product.stock < quantity) {
            return NextResponse.json({ error: "Not enough stock available" }, { status: 402 })
        }

        product.stock -= quantity;
        await product.save({ session });

        if ([orderName, address, pinCode, landMark, orderImage, paymentMethod, paymentStatus, productId, userId, sellerId, orderConfirmation].some((elem: string) => { elem.trim() === "" })) {
            return NextResponse.json({ error: "Required Fields cannot be empty" }, { status: 400 });
        }

        const order = new Order({
            productId,
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
            seller: sellerId,
            processingStatus: orderConfirmation
        })

        if (!order) {
            return NextResponse.json({ error: "Failed to create the product Order" }, { status: 401 })
        }

        await order.save({ session });

        await session.commitTransaction();
        session.endSession();

        return NextResponse.json({ data: order }, { status: 200 })
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return NextResponse.json({ error: `"Failed to create the request in the database" : ${error}` }, { status: 500 })
    }
}