import connectDB from "@/db/dbConfig";
import { User } from "@/models/user.model";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

connectDB();

export async function GET() {
    try {
        const cookieStore = await cookies();

        const authToken: any = cookieStore.get('accessToken')?.value;

        if (!authToken) {
            return NextResponse.json({ error: "User not logged in" }, { status: 402 })
        }

        const decodedToken: any = jwt.verify(authToken, process.env.ACCESS_TOKEN_SECRET as string)

        if (!decodedToken) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 402 })
        }

        const userLoggedId = await decodedToken?._id;

        const userDetails = await User.findById(userLoggedId).select("-password -refreshToken -accessToken ");

        if (!userDetails) {
            return NextResponse.json({ error: "" }, { status: 401 })
        }
        return NextResponse.json(
            {
                message: "User Details",
                user: userDetails,
            },
            {
                status: 200
            }
        )

    } catch (error) {
        console.log("Error in login Details : ", error)
        throw NextResponse.json({ error: `Error getting the user details : ${error}` }, { status: 500 })
    }

}