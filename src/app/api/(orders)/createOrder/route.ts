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

        const {
            orderName, orderPrice, orderDiscount, quantity, contactNumber,
            address, pinCode, landMark, orderImage, paymentMethod,
            paymentStatus, userId, orderConfirmation, productId, seller
        } = reqBody.orderDetails;

        const requiredFields = [
            orderName, userId, address, pinCode, landMark,
            orderImage, paymentMethod, paymentStatus, orderConfirmation
        ];

        if (requiredFields.some((elem: string) => elem.trim() === "")) {
            await session.abortTransaction(); // ✅ abort before returning
            session.endSession();
            return NextResponse.json(
                { error: "Required Fields cannot be empty" },
                { status: 400 }
            );
        }

        const product = await Product.findById(productId).session(session);

        if (!product) {
            await session.abortTransaction(); // ✅ abort before returning
            session.endSession();
            return NextResponse.json(
                { error: "Product not found" },
                { status: 403 }
            );
        }

        if (product.stock < quantity) {
            await session.abortTransaction(); // ✅ abort before returning
            session.endSession();
            return NextResponse.json(
                { error: "Not enough stock available" },
                { status: 402 }
            );
        }

        product.stock -= quantity;
        await product.save({ session });

        const existingOrder = await Order.findOne({ orderBy: userId }).session(session);

        const newOrderItem = {
            productId,
            orderName,
            orderImage,
            contactNumber,
            orderPrice,
            orderDiscount,
            orderQuantity: quantity,
            deliveryAddress: address,
            pinCode,
            landMark,
            paymentMethod,
            paymentStatus,
            seller,
            processingStatus: orderConfirmation,
        };

        if (!existingOrder) {
            const order = new Order({
                orderBy: userId,
                orders: [newOrderItem],
            });

            await order.save({ session });
            await session.commitTransaction();
            session.endSession();
            return NextResponse.json({ data: order }, { status: 200 });

        } else {
            await Order.updateOne(
                { _id: existingOrder._id },
                { $push: { orders: { $each: [newOrderItem], $position: 0 } } },
                { session: session } // ✅ correctly scoped to transaction
            );

            await session.commitTransaction();
            session.endSession();

            return NextResponse.json(
                { message: "Order added to existing orders successfully" },
                { status: 200 }
            );
        }

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return NextResponse.json(
            { error: `Failed to create the request in the database: ${error}` },
            { status: 500 }
        );
    }
}