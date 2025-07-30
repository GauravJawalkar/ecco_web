import connectDB from "@/db/dbConfig";
import { Product } from "@/models/product.model";
import { Store } from "@/models/store.model";
import { User } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

interface StoreProps {
    params: {
        storeName: string;
    }
}

export async function GET(request: NextRequest, { params }: StoreProps) {
    await connectDB();
    try {
        const { storeName } = await params;
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const skip = (page - 1) * limit;

        if (!storeName || storeName.trim() === "") {
            return NextResponse.json({ error: "Store ID is required" }, { status: 400 });
        }

        const publicStore = await Store.findById(storeName);

        if (!publicStore) {
            return NextResponse.json({ error: "Store not found" }, { status: 404 });
        }

        const storeOwnerId = publicStore?.owner?.toString();

        if (!storeOwnerId) {
            return NextResponse.json({ error: "Store owner not found" }, { status: 404 });
        }

        const ownerDetails = await User.findById(storeOwnerId).select("--password --googleId --isSuperAdmin --bankDetails --refreshToken --forgotPasswordOTP --forgotPasswordOTPExpires --emailVerificationOTP --emailVerificationOTPExpires");

        if (!ownerDetails) {
            return NextResponse.json({ error: "Store owner details not found" }, { status: 404 });
        }

        const storeProducts = await Product.find({ seller: storeOwnerId }).skip(skip).limit(limit);
        const totalStoreProducts = await Product.countDocuments({ seller: storeOwnerId });
        const totalStorePages = Math.ceil(totalStoreProducts / limit);

        return NextResponse.json({ data: { publicStore, ownerDetails, storeProducts, totalStoreProducts, totalStorePages } }, { status: 200 });

    } catch (error) {
        console.error("Error fetching public store data:", error);
        return NextResponse.json({ error: "Error fetching public store data" }, { status: 500 });
    }
}