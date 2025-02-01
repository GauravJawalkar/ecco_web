import { User } from "@/models/user.model";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function auth(request: NextRequest) {
    try {
        const token = request.cookies.get('accessToken')?.value;

        if (!token) {
            return NextResponse.json({ error: "No token found : Unauthorized" }, { status: 401 })
        }

        const decodedToken: any = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string)

        const decodedTokenId = decodedToken?._id;

        const user: any = await User.findById(decodedTokenId).select("-password -refreshToken -isSeller")

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        return user;

    } catch (error) {
        return NextResponse.json(
            { error: `Invalid or expired token : ${error}` }, { status: 401 }
        )
    }

}