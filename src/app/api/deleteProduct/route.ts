import { NextRequest, NextResponse } from "next/server";


export async function DELETE(request: NextRequest) {
    try {

    } catch (error) {
        return NextResponse.json({ error: "Failed to delete the product" }, { status: 500 })
    }
}