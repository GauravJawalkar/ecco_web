import connectDB from "@/db/dbConfig";
import { SpecialAppearence } from "@/models/specialAppearence.model";
import { NextRequest, NextResponse } from "next/server";

connectDB();
export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();

        const { _id, name, description, price, images, discount, seller } = reqBody.data;

        if (!_id || !name || !description || !seller) {
            return NextResponse.json({ error: "Didnt get all the required information" }, { status: 402 })
        }

        const checkExistingReq = await SpecialAppearence.find({ productId: _id })

        if (checkExistingReq) {
            return NextResponse.json({ error: "You have already requested for this product" }, { status: 401 })
        }

        const splReq = await SpecialAppearence.create(
            {
                prodName: name,
                prodDesc: description,
                productId: _id,
                prodPrice: price,
                prodDiscount: discount,
                prodImages: images,
                requestedBy: seller
            }
        )

        if (!splReq) {
            return NextResponse.json({ error: "Failed to send the request to database" }, { status: 404 })
        }

        return NextResponse.json(
            {
                data: "Request Sent Successfully"
            },
            {
                status: 200
            }
        )

    } catch (error) {
        console.log("Error is ", error)
        return NextResponse.json({ error: "Error requesting for special Appearence" }, { status: 500 })
    }
}