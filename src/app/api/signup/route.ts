
import connectDB from "@/db/dbConfig";
import { uploadOnCloudinary } from "@/helpers/uploadAssets";
import { User } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();

        const name = formData.get('name')
        const email = formData.get('email')
        const password = formData.get('password')
        const avatar = formData.get('avatar')

        if (!name && !email && !password) {
            return NextResponse.json({ "error": "All the above fields are required" }, { status: 401 })
        }

        const existingUser = await User.findOne({ email })

        if (existingUser) {
            return NextResponse.json(
                { error: "User with the email already exists in the database" },
                { status: 404 }
            )
        }

        const imageUrl: any = await uploadOnCloudinary(avatar, "ecco_web")

        const createdUser = await User.create(
            {
                name: name,
                email: email,
                password: password,
                avatar: imageUrl.secure_url || "",
            }
        )

        return NextResponse.json({ "data": createdUser }, { status: 200 })

    } catch (error) {
        console.log(error);
        return NextResponse.json({ "error": error }, { status: 500 })
    }
}