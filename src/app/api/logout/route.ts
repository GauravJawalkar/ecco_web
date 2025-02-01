import connectDB from "@/db/dbConfig";
import { auth } from "@/middlewares/auth.middleware";
import { User } from "@/models/user.model";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function GET(request: NextRequest) {
    try {

        // getting the user by finding it from the accessToken by decoding it through auth()
        const reqUser = await auth(request);

        if (!reqUser) {
            return NextResponse.json({ error: "No user found" }, { status: 402 })
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

        const cookieStore = await cookies();

        cookieStore.set('accessToken', "");
        cookieStore.set('refreshToken', "");

        return NextResponse.json(
            {
                message: "Logout Successful",
                success: true
            },
            {
                status: 200
            })

    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: error }, { status: 500 })
    }
}