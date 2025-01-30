import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
    try {

    } catch (error) {
        return NextResponse.json({ error: `error in middleware:${error}` }, { status: 500 })
    }
}