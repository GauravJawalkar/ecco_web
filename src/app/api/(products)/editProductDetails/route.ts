import connectDB from "@/db/dbConfig";
import { uploadOnCloudinary } from "@/helpers/uploadAssets";
import { Product } from "@/models/product.model";
import { NextRequest, NextResponse } from "next/server";

connectDB();
export async function PUT(request: NextRequest) {
    try {

        const formData = await request.formData();

        const id = formData.get("id");
        const name = formData.get("name");
        const description = formData.get("description");
        const price = formData.get("price");
        const discount = formData.get("discount");
        const size = formData.get("size");
        const stock = formData.get("stock");
        const category = formData.get("category");
        const container = formData.get("container");
        let mainImage = formData.get("mainImage")
        let secondImage = formData.get("secondImage");
        let thirdImage = formData.get("thirdImage");

        if (!id) {
            return NextResponse.json({ error: "id is required" }, { status: 402 })
        }

        String(price);
        String(discount);
        String(size);
        String(stock);
        String(container);

        if (mainImage && (mainImage instanceof File)) {
            const newMainImage: any = await uploadOnCloudinary(mainImage, "ecco_web");
            mainImage = newMainImage?.secure_url;
        }
        if (secondImage && (secondImage instanceof File)) {
            const newSecondImage: any = await uploadOnCloudinary(secondImage, "ecco_web");
            secondImage = newSecondImage?.secure_url;
        }
        if (thirdImage && (thirdImage instanceof File)) {
            const newThirdImage: any = await uploadOnCloudinary(thirdImage, "ecco_web");
            thirdImage = newThirdImage?.secure_url;
        }

        if (!name || !description || !category || !container) {
            return NextResponse.json({ error: "All the mentioned fields are required" }, { status: 400 })
        }

        const updatedDetails = await Product.findByIdAndUpdate(id,
            {
                $set: {
                    name,
                    description,
                    price,
                    discount,
                    stock,
                    containerType: container,
                    size,
                    category,
                    images: [mainImage, secondImage, thirdImage]
                },
            },
            {
                new: true,
                upsert: true
            }
        )

        if (!updatedDetails) {
            return NextResponse.json({ error: "Failed to update the product details" }, { status: 500 })
        }

        return NextResponse.json({ data: updatedDetails }, { status: 200 })


    } catch (error) {
        console.log("Error updating product details : ", error)
        return NextResponse.json({ error: error }, { status: 500 })
    }
}