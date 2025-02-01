import { User } from "@/models/user.model"
import { NextResponse } from "next/server"

export const generateAccessAndRefreshToken = async (userId: string) => {

    try {

        const user: any = await User.findById(userId);

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 401 })
        }

        const accessToken: string = user?.generateAccessToken();
        const refreshToken: string = user?.generateRefreshToken();

        user.refreshToken = refreshToken;

        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }

    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 })
    }

}