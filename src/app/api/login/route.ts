import connectDB from "@/db/dbConfig";
import { generateAccessAndRefreshToken } from "@/helpers/tokensGenerator";
import { User } from "@/models/user.model";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

connectDB()

export async function POST(request: NextRequest) {

    try {
        const reqBody = await request.json();

        const { name, email, password } = reqBody;

        if ([name, email, password].some((field) => field.trim() === "")) {
            return NextResponse.json({ error: "name email and password are required" }, { status: 401 })
        }

        const user: any = await User.findOne({ email })

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 500 });
        }

        const validPassword = await user.isPasswordCorrect(password);

        if (!validPassword) {
            return NextResponse.json({ error: "Password incorret" }, { status: 400 })
        }

        const { accessToken, refreshToken }: any = await generateAccessAndRefreshToken(user._id)

        const loggedUser = await User.findById(user._id).select("-password -refreshToken -isSeller")

        if (!loggedUser) {
            return NextResponse.json({ error: "Cannot find logged user" }, { status: 402 })
        }

        const options = {
            httpOnly: true,
            secure: true
        }

        const cookieStore = await cookies();
        cookieStore.set('accessToken', accessToken, options)
        cookieStore.set('refreshToken', refreshToken)

        return NextResponse.json(
            {
                user: loggedUser, accessToken, refreshToken,
            }
        )

    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 })
    }

}