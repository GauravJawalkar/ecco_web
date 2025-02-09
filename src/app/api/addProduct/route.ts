import connectDB from "@/db/dbConfig";
import { uploadOnCloudinary } from "@/helpers/uploadAssets";
import { Product } from "@/models/product.model";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function POST(request: NextRequest) {
    try {

        const cookiesStore = await cookies();

        const encodedUser: any = cookiesStore.get('accessToken')?.value;

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
            return NextResponse.json({ error: "Unauthorized User" }, { status: 403 })
        }

        const imageUrls: any = await uploadOnCloudinary(images, "ecco_web")

        const product = await Product.create({
            name,
            description,
            price,
            discount,
            prod_Images: [imageUrls],
            size,
            category,
            seller: userId
        })

        if (!product) {
            return NextResponse.json({ error: "Failed to create the product" }, { status: 500 })
        }

        return NextResponse.json(
            { product: product }, { status: 200 }
        )

    } catch (error) {
        console.log('Error adding product : ', error);
        return NextResponse.json({ error: "Failed to add the product" }, { status: 500 })
    }
}