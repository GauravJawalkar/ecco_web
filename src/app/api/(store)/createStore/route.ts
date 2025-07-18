import connectDB from "@/db/dbConfig";
import { uploadOnCloudinary } from "@/helpers/uploadAssets";
import { Store } from "@/models/store.model";
import { User } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    await connectDB();
    try {
        const formData = await request.formData();
        const storeName = formData.get("storeName") as string;
        const storeDescription = formData.get("storeDescription") as string;
        const storeImage = formData.get("storeImage") as File;
        const storeCoverImage = formData.get("storeCoverImage") as File;
        const ownerId = formData.get("owner") as string;

        if (!storeName || !storeDescription || !storeImage || !storeCoverImage || !ownerId) {
            return NextResponse.json({ error: "All fields are required." }, { status: 400 });
        }

        const storeCoverImageUrl: any = await uploadOnCloudinary(storeCoverImage, "ecco_web_stores");
        const storeImageUrl: any = await uploadOnCloudinary(storeImage, "ecco_web_stores");

        if (!storeCoverImageUrl || !storeImageUrl) {
            return NextResponse.json({ error: "Failed to upload images." }, { status: 402 });
        }

        const storeData = await Store.create(
            {
                storeName: storeName,
                storeDescription: storeDescription,
                storeImage: storeImageUrl?.secure_url,
                storeCoverImage: storeCoverImageUrl?.secure_url,
                owner: ownerId,
            }
        );

        if (!storeData) {
            return NextResponse.json({ error: "Failed to create store." }, { status: 403 });
        }

        const updateUserStoreStatus = await User.findByIdAndUpdate(
            ownerId,
            {
                $set: {
                    store: true
                }
            },
            { new: true }
        ).select("--password --refreshToken --accessToken --emailVerificationOTP --forgotPasswordOTP --emailVerificationOTPexpiry --forgotPasswordOTPexpiry");

        if (!updateUserStoreStatus) {
            return NextResponse.json({ error: "Failed to update user store status." }, { status: 404 });
        }

        return NextResponse.json({ message: "Store created successfully!", store: storeData, storeStatus: updateUserStoreStatus }, { status: 201 });

    } catch (error) {
        console.error("Error creating store:", error);
        return NextResponse.json({ error: "Failed to create store. Please try again." }, { status: 500 });
    }
}