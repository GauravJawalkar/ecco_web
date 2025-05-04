import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {

    } catch (error) {
        return NextResponse.json({ error: `Error adding to the DB cart : ${error}` }, { status: 500 })
    }
}