import { SpecialAppearence } from "@/models/specialAppearence.model";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
    try {
        const reqBody = await request.json();

        const { _id } = reqBody;

        if (!_id) {
            return NextResponse.json(
                { error: "Didnt got the id from frontend" },
                { status: 402 }
            );
        }

        const removedFromUnset = await SpecialAppearence.findByIdAndUpdate(
            _id,
            {
                $set: {
                    setActive: false,
                },
            },
            {
                new: true,
            }
        );

        if (!removedFromUnset) {
            return NextResponse.json(
                { error: "Failed to unset the product" },
                { status: 401 }
            );
        }

        return NextResponse.json(
            { data: "Special product Unset" },
            { status: 200 }
        );

    } catch (error) {
        return NextResponse.json(
            { error: "Failed to unset in database" },
            { status: 500 }
        );
    }
}
