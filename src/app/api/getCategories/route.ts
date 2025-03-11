import { Category } from "@/models/category.model";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const categories = await Category.find({});

        if (!categories) {
            return NextResponse.json({ error: "Failed to fetch the categories" }, { status: 401 })
        }

        Array.from(categories);
        return NextResponse.json({ data: categories }, { status: 200 })

    } catch (error) {
        return NextResponse.json({ "error fetching categories ": error }, { status: 500 })
    }
}