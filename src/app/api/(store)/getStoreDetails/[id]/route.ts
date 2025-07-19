import connectDB from "@/db/dbConfig";
import { Product } from "@/models/product.model";
import { Store } from "@/models/store.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
    await connectDB();
    try {
        const { id } = await params;

        console.log("Fetching store details for ID:", id);

        if (!id || id.trim() === "") {
            return NextResponse.json({ error: "Id is required" }, { status: 400 });
        }

        const storeDetails = await Store.find({ owner: id });
        const totalProducts = await Product.countDocuments({ seller: id });

        if (!storeDetails) {
            return NextResponse.json({ error: "Store not found in the database" },
                { status: 404 });
        }

        return NextResponse.json({ data: storeDetails, totalProducts: totalProducts ?? 0 }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: "Error fetching store details from the database" },
            { status: 500 }
        )
    }
}