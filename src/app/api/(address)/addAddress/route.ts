import connectDB from "@/db/dbConfig";
import { Address } from "@/models/address.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    await connectDB();
    try {
        const reqBody = await request.json();

        const { address, pinCode, landMark, contactNumber, userId } = reqBody.addressDetails;

        console.log(reqBody);

        if (!address || !pinCode || !landMark || !contactNumber || !userId) {
            return NextResponse.json({ error: "All the mentioned feilds are required" }, { status: 400 })
        }

        const existingAddresses: any = await Address.findOne({ userId: userId });

        if (existingAddresses) {
            const existindAdd = await Address.updateOne(
                { userId: userId },
                { $push: { addresses: { mainAddress: address, pinCode, contactNumber, landMark } } }
            );

            return NextResponse.json({ data: existindAdd }, { status: 200 });
        }


        const newAddress = await Address.create({
            userId: userId,
            addresses: [
                {
                    mainAddress: address,
                    pinCode: pinCode,
                    landMark: landMark,
                    contactNumber: contactNumber
                }
            ]
        });

        if (!newAddress) {
            return NextResponse.json({ error: "Failed to create a new aaddress" }, { status: 400 })
        }

        return NextResponse.json({ data: newAddress }, { status: 200 })

    } catch (error) {
        return NextResponse.json({ error: `"Failed to add the address to the database" : ${error}` }, { status: 500 })
    }
}