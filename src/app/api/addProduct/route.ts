import { error } from "console";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {

        const cookiesStore = await cookies();
        const encodedUser: any = cookiesStore.get('accessToken');

        if (!encodedUser) {
            return NextResponse.redirect(new URL('/login', request.nextUrl))
        }

        const decodedUser: any = jwt.verify(encodedUser, process.env.ACCESS_TOKEN_SECRET as string)

        if (decodedUser.isSeller === false) {
            return NextResponse.json({ error: "Unauthorized User: Your are not a seller" }, { status: 401 })
        }

        const userId = decodedUser?._id;

        const formData = await request.formData();

        const seller = formData.get('id');
        const name = formData.get('name');
        const description = formData.get('description');
        const price = formData.get('price');
        const discount = formData.get('discount');
        const images = formData.get('images');
        const size = formData.get('size');
        const category = formData.get('category');

        if (seller !== userId) {
            return NextResponse.json({ error: "Unauthorized Error" }, { status: 403 })
        }

    } catch (error) {
        console.log('Error adding product : ', error);
        return NextResponse.json({ error: "Failed to add the product" }, { status: 500 })
    }
}