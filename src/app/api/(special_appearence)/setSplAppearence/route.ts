import { SpecialAppearence } from "@/models/specialAppearence.model";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
    try {
        const reqBody = await request.json()

        const { _id } = reqBody;

        console.log("Id of product to update : ", _id)
        if (!_id) {
            return NextResponse.json({ error: "ID not found" }, { status: 402 })
        }

        const setProductAsSpecial = await SpecialAppearence.findByIdAndUpdate(_id,
            {
                $set: {
                    setActive: true
                }
            },
            {
                new: true
            }
        )

        if (!setProductAsSpecial) {
            return NextResponse.json({ error: "Failed to set the products for special appearence" }, { status: 401 })
        }

        return NextResponse.json({ data: "Product Set Successfully" }, { status: 200 })


    } catch (error) {
        console.log("Failed to set the products for special appearence", error)
        return NextResponse.json({ error: "Failed to set the products for special appearence" }, { status: 500 })
    }
}