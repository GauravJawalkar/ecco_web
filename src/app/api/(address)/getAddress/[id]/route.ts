import connectDB from "@/db/dbConfig";
import { Address } from "@/models/address.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_: NextRequest, params: { params: { id: string } }) {
    await connectDB();
    try {
        const { id } = await params.params;

        if (!id) {
            return NextResponse.json({ error: "User Id is required to fetch his/her addresses" }, { status: 400 })
        }

        const addresses = await Address.find({ userId: id });

        if (!addresses) {
            return NextResponse.json({ error: 'Failed to get the addresses' }, { status: 401 });
        }

        if (addresses.length === 0) {
            return NextResponse.json({ data: "No Addresses Found" }, { status: 202 });
        }

        return NextResponse.json({ data: addresses }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch the user Addresses" }, { status: 500 })
    }
}