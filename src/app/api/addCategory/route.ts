import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();

        const { categoryName } = reqBody;

        if (!categoryName) {
            return NextResponse.json({ "error": "Category Name is required" }, { status: 401 })
        }

        
    } catch (error) {
        return NextResponse.json({ "error": error }, { status: 500 })
    }
}