import connectDB from "@/db/dbConfig";
import { Order } from "@/models/orders.model";
import { Product } from "@/models/product.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    await connectDB();
    try {
        const reqBody = await request.json();

        const { productID, userID, rateValue } = reqBody;

        if (!productID || productID.trim() === "") {
            return NextResponse.json({ error: "product id is required " }, { status: 400 })
        }

        const order = await Order.findOne(
            {
                orderBy: userID,
                "orders": {
                    $elemMatch: {
                        productId: productID
                    }
                }
            }
        );

        if (!order) {
            return NextResponse.json({ error: "You haven't ordered this product you cant rate it" }, { status: 422 })
        }

        let updatedProduct = await Product.findOneAndUpdate(
            {
                _id: productID,
                'rating.ratedBy': userID
            },
            {
                $set: { 'rating.$.rateNumber': rateValue }
            },
            { new: true }
        );


        if (!updatedProduct) {
            updatedProduct = await Product.findByIdAndUpdate(
                productID,
                {
                    $push: {
                        rating: {
                            $each: [{
                                ratedBy: userID,
                                rateNumber: rateValue
                            }],
                            $position: 0
                        }
                    }
                },
                { new: true }
            );
        }

        if (!updatedProduct) {
            return NextResponse.json({ error: "Product not found or not updated/created." }, { status: 500 })
        }

        return NextResponse.json({ data: updatedProduct }, { status: 200 })


    } catch (error) {
        return NextResponse.json({ error: `"Failed to Rate the product in database ${error}"` }, { status: 500 })
    }
}