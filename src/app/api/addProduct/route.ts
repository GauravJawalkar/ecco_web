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

        const seller = formData.get('seller');
        const name = formData.get('name');
        const description = formData.get('description');
        const price = formData.get('price');
        const discount = formData.get('discount');
        const images = formData.get('images');
        const primeImage = formData.get('primeImage');
        const secondaryImage = formData.get('secondImage');
        const size = formData.get('size');
        const category = formData.get('category');

        if (seller !== userId) {
            return NextResponse.json({ error: "Unauthorized User" }, { status: 400 })
        }


        const firstImageUrl: any = await uploadOnCloudinary(images, 'ecco_web');
        const primeImageUrl: any = await uploadOnCloudinary(primeImage, 'ecco_web')
        const secondaryImageUrl: any = await uploadOnCloudinary(secondaryImage, 'ecco_web')

        const imageArray = [firstImageUrl?.secure_url, primeImageUrl?.secure_url, secondaryImageUrl?.secure_url];

        console.log("The url array is : ", imageArray)

        if (!firstImageUrl) {
            return NextResponse.json({ error: "No Files uploaded on cloudinary" }, { status: 404 })
        }

        const product = await Product.create({
            name,
            description,
            price,
            discount,
            images: imageArray || ['No image urls'],
            size,
            category,
            seller: userId
        })

        if (!product) {
            return NextResponse.json({ error: "Failed to create the product" }, { status: 500 })
        }

        return NextResponse.json(
            { data: product }, { status: 200 }
        )

    } catch (error) {
        return NextResponse.json({ error: "Failed to add the product" }, { status: 500 })
    }
}