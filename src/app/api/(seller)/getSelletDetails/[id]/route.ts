import connectDB from "@/db/dbConfig";
import { User } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    await connectDB();
    try {

        const { id } = await params;

        if (!id) {
            return NextResponse.json({ error: "Id is required" }, { status: 402 })
        }

        const user = await User.findById(id);

        if (!user) {
            return NextResponse.json({ error: "User not found in the database" }, { status: 404 })
        }

        return NextResponse.json({ data: user }, { status: 200 })

    } catch (error) {
        return NextResponse.json({ error: `Error Getting the user details from DB : ${error}` }, { status: 500 })
    }
}