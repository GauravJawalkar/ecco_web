import connectDB from "@/db/dbConfig";
import { Order } from "@/models/orders.model";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
    await connectDB();
    try {
        const reqBody = await request.json();
        const { processState, orderID, orderDocId } = reqBody;

        console.log("Upadate Seller processing state : ", reqBody);

        if (processState === "Processing") {
            const processState = await Order.updateOne({ _id: orderDocId }, {
                $set: {
                    "orders.$[order].processingStatus": "Order Processing",
                }
            },
                {
                    arrayFilters: [
                        {
                            "order._id": orderID
                        }
                    ]
                }
            )

            if (!processState) {
                return NextResponse.json({ error: "Failed to update the process state" }, { status: 402 })
            }

            return NextResponse.json({ data: "Processed" }, { status: 200 })
        } else if (processState === "Ship") {
            const processState = await Order.updateOne({ _id: orderDocId }, {
                $set: {
                    "orders.$[order].processingStatus": "Order Shipped",
                }
            },
                {
                    arrayFilters: [
                        {
                            "order._id": orderID
                        }
                    ]
                }
            )

            if (!processState) {
                return NextResponse.json({ error: "Failed to update the process state" }, { status: 402 })
            }

            return NextResponse.json({ data: "Shipped" }, { status: 200 })
        } else if (processState === "Deliver") {
            const processState = await Order.updateOne({ _id: orderDocId }, {
                $set: {
                    "orders.$[order].processingStatus": "Out For Delivery",
                }
            },
                {
                    arrayFilters: [
                        {
                            "order._id": orderID
                        }
                    ]
                }
            )

            if (!processState) {
                return NextResponse.json({ error: "Failed to update the process state" }, { status: 402 })
            }

            return NextResponse.json({ data: "Delivered" }, { status: 200 })
        } else {
            return NextResponse.json({ error: "Error updating the order process status" }, { status: 401 });
        }

    } catch (error) {
        return NextResponse.json({ error: `Error updating the orderStatus in database : ${error}` }, { status: 500 })
    }
}