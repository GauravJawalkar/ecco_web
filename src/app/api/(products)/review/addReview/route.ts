import connectDB from "@/db/dbConfig";
import { Order } from "@/models/orders.model";
import { Reviews } from "@/models/review.models";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    await connectDB();
    try {
        const reqBody = await request.json();
        const { reviewedBy, content, reviewedProduct, reviewerName } = reqBody;

        console.log(reviewerName);

        const requiredFields = [reviewedBy, content, reviewedProduct, reviewerName];

        if (requiredFields.some((elem: string) => elem.trim() === "")) {
            return NextResponse.json({ error: "All the marked feilds are required" }, { status: 400 })
        }

        const isAuthenticReview = await Order.findOne({
            orderBy: reviewedBy,
            orders: {
                $elemMatch: {
                    productId: reviewedProduct
                }
            }
        });

        if (!isAuthenticReview) {
            return NextResponse.json({ error: "Unauthorized Review" }, { status: 401 })
        }

        const addReview = {
            reviewedBy: reviewedBy,
            reviewerName: reviewerName,
            content: content,
            likes: 0,
            dislikes: 0
        };

        const newReview = await Reviews.findOneAndUpdate(
            { reviewedProduct },
            {
                $push: { reviews: addReview }
            },
            { new: true, upsert: true }
        );

        if (!newReview) {
            return NextResponse.json({ error: "Failed to post a new Review" }, { status: 402 })
        }

        return NextResponse.json({ data: "Review Posted Successfully" }, { status: 200 })


    } catch (error) {
        console.error("Failed to post the review for product", error)
        return NextResponse.json({ error: `"Failed to post the review for product : "  ${error}` }, { status: 500 })
    }
}