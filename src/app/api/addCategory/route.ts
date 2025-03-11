import { Category } from "@/models/category.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();

        const { categoryName } = reqBody;

        if (!categoryName) {
            return NextResponse.json({ "error": "Category Name is required" }, { status: 401 })
        }

        const existingCategory = await Category.find({ categoryName });

        if (existingCategory) {
            return NextResponse.json({ "error": "Category Already Exists" }, { status: 402 })
        }

        const newCategory = await Category.create(
            {
                categoryName: categoryName,
            }
        )

        if (!newCategory) {
            return NextResponse.json({ "error": "Failed to create a new category in the database" }, { status: 405 })
        }

        return NextResponse.json({ data: categoryName }, { status: 200 })

    } catch (error) {
        return NextResponse.json({ "error": error }, { status: 500 })
    }
}