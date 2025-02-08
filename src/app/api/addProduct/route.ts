import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {

    } catch (error) {
        console.log('Error adding product : ', error);
        return NextResponse.json({ error: "Failed to add the product" }, { status: 500 })
    }
}