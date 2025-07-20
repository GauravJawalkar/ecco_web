import connectDB from "@/db/dbConfig";
import { Store } from "@/models/store.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    await connectDB();
    try {

        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get("page") || "1");
        const limit = 12;
        const skip = (page - 1) * limit;

        const allStores = await Store.find().skip(skip).limit(limit);
        const totalStores = await Store.countDocuments();

        if (!allStores) {
            return NextResponse.json({ error: "No stores found" }, { status: 404 });
        }

        if (!totalStores) {
            return NextResponse.json({ error: "No stores found" }, { status: 404 });
        }

        return NextResponse.json(
            { data: allStores, totalStores: totalStores, totalPages: Math.ceil(totalStores / limit), currentPage: page },
            { status: 200 }
        );

    } catch (error) {
        return NextResponse.json({ error: `"Failed to fetch store data" : ${error}` }, { status: 500 });
    }
}