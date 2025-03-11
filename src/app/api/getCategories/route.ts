import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {

    } catch (error) {
        return NextResponse.json({ "error fetching categories ": error }, { status: 500 })
    }
}