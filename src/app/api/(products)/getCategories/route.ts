import { Category } from "@/models/category.model";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const categories = await Category.find({});

        if (categories.length === 0) {
            return NextResponse.json({ message: "No categories found" }, { status: 200 });
        }

        Array.from(categories);
        return NextResponse.json({ data: categories }, { status: 200 })

    } catch (error) {
        return NextResponse.json({ "error fetching categories ": error }, { status: 500 })
    }
}