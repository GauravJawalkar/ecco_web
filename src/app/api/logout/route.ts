import connectDB from "@/db/dbConfig";
import { User } from "@/models/user.model";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

connectDB();

export async function GET() {
    try {

        const cookieStore = await cookies();

        const token: any = cookieStore.get('accessToken')?.value

        const reqUser: any = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string)

        if (!reqUser) {
            return NextResponse.json({ error: "No user found" }, { status: 402 })
        }

        const loggedOutUser = await User.findByIdAndUpdate(reqUser?._id,
            {
                $set: {
                    refreshToken: "",
                }
            },
            {
                new: true
            }
        ).select("-password -isSeller ")

        if (!loggedOutUser) {
            return NextResponse.json({ error: `Failed to logout the user ${reqUser.name}` },
                { status: 401 })
        }

        cookieStore.delete('accessToken');
        cookieStore.delete('refreshToken');

        return NextResponse.json(
            { message: "Logout Successful", success: true, loggedOut: loggedOutUser },
            { status: 200 }
        )

    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: error }, { status: 500 })
    }
}