import connectDB from "@/db/dbConfig";
import { uploadOnCloudinary } from "@/helpers/uploadAssets";
import { Order } from "@/models/orders.model";
import { Reviews } from "@/models/review.models";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    await connectDB();
    try { 
        const formData = await request.formData();
        const reviewedBy = formData.get('reviewedBy');
        const reviewedProduct = formData.get('reviewedProduct');
        const content = formData.get('content');
        const reviewerName = formData.get('reviewerName');
        const imageOne = formData.get('imageOne');
        const imageTwo = formData.get('imageTwo');
        const imageThree = formData.get('imageThree');
        const title = formData.get('title');

        const requiredFields = [reviewedBy, content, reviewedProduct, reviewerName, title];

        if (requiredFields.some((elem: any) => elem.trim() === "")) {
            return NextResponse.json({ error: "All the marked feilds are required" }, { status: 400 })
        }

        if (!imageOne || !imageTwo || !imageThree) {
            return NextResponse.json({ error: "review images are required" }, { status: 400 });
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
            return NextResponse.json({ error: "Unauthorized Review" }, { status: 422 })
        }

        const img1: any = await uploadOnCloudinary(imageOne, 'ecco_web');
        const img2: any = await uploadOnCloudinary(imageTwo, 'ecco_web');
        const img3: any = await uploadOnCloudinary(imageThree, 'ecco_web');

        const newReview = await Reviews.create(
            {
                reviewedProduct,
                reviewedBy: reviewedBy,
                reviewerName: reviewerName,
                reviewTitle: title,
                reviewImages: [img1?.secure_url, img2?.secure_url, img3?.secure_url],
                content: content,
                likes: 0,
                dislikes: 0
            }
        )

        if (!newReview) {
            return NextResponse.json({ error: "Failed to post a new Review" }, { status: 402 })
        }

        return NextResponse.json({ data: "Review Posted Successfully" }, { status: 200 })

    } catch (error) {
        console.error("Failed to post the review for product", error)
        return NextResponse.json({ error: `"Failed to post the review for product : "  ${error}` }, { status: 500 })
    }
}