import { auth } from "@/middlewares/auth.middleware";
import { User } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {

        // getting the user by finding it from the accessToken by decoding it through auth()
        const reqUser = await auth(request);

        if (!reqUser) {
            return NextResponse.json({ error: "No user found" })
        }

        // collecting the id form the reqUser got from the auth() function and finding it in database, setting it's refreshToken as "" 
        await User.findByIdAndUpdate(reqUser?._id,
            {
                $set: {
                    refreshToken: "",
                }
            },
            {
                new: true
            }
        )

        const response = NextResponse.json({
            message: "Logout Successful",
            success: true
        })

        response.cookies.set('accessToken', "", {
            httpOnly: true,
            expires: new Date(0)
        });

        return response;

    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: error }, { status: 500 })
    }
}