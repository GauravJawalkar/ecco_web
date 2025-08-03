import connectDB from "@/db/dbConfig";
import { uploadOnCloudinary } from "@/helpers/uploadAssets";
import { Store } from "@/models/store.model";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
    await connectDB();
    try {
        const formData = await request.formData();
        const storeName = formData.get("storeName") as string;
        const storeDescription = formData.get("storeDescription") as string;
        let storeImage = formData.get("storeImage") as any;
        let storeCoverImage = formData.get("storeCoverImage") as any;
        const storeId = formData.get("storeId") as string;

        if (storeImage && (storeImage instanceof File)) {
            const newStoreImage: any = await uploadOnCloudinary(storeImage, "ecco_web_stores");
            storeImage = newStoreImage?.secure_url;
        }
        if (storeCoverImage && (storeCoverImage instanceof File)) {
            const newStoreCoverImage: any = await uploadOnCloudinary(storeCoverImage, "ecco_web_stores");
            storeCoverImage = newStoreCoverImage?.secure_url;
        }

        const shippingPolicy = formData.get("shippingPolicy");
        const returnPolicy = formData.get("returnPolicy");
        const contactPhone = formData.get("contactPhone");
        const instagram = formData.get("instagram");
        const facebook = formData.get("facebook");
        const twitter = formData.get("twitter");
        const isStoreOpen = formData.get("isStoreOpen");
        const isOpen = isStoreOpen === "true" ? true : false;

        console.log("The store is : ", isOpen);

        const updatedStore = await Store.findByIdAndUpdate(
            storeId,
            {
                $set: {
                    storeName,
                    storeDescription,
                    storeImage: storeImage || "",
                    storeCoverImage: storeCoverImage || "",
                    shippingPolicy,
                    returnPolicy,
                    contact: contactPhone,
                    "socialMedia.instagram": instagram,
                    "socialMedia.facebook": facebook,
                    "socialMedia.twitter": twitter,
                    isOpen
                }
            },
            { new: true }
        );

        if (!updatedStore) {
            return NextResponse.json({ error: "Failed to update store." }, { status: 404 });
        }

        return NextResponse.json({ message: "Store updated successfully!", data: updatedStore }, { status: 200 });

    } catch (error) {
        return NextResponse.json({
            message: "Failed to update store",
            error: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}