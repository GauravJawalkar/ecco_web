import connectDB from "@/db/dbConfig";
import { Cart } from "@/models/cart.model";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
    await connectDB()
    try {
        const reqBody = await request.json();

        const { quantity, _id, cartId, quantityOperation } = reqBody.data;

        if (_id.trim() === "" || cartId.trim() === "" || quantityOperation.trim() === "") {
            return NextResponse.json({ error: "Fields are required" }, { status: 400 });
        }

        const cartQuantityCheck: any = await Cart.findOne({ _id: cartId });

        if (cartQuantityCheck?.cartItems[0]?.quantity === 0) {
            const deletedCartItem = await Cart.updateOne({ _id: cartId },
                {
                    $pull: {
                        cartItems: { _id: { $in: [_id] } }
                    }
                }
            );

            if (!deletedCartItem) {
                return NextResponse.json({ error: "Something went wrong" }, { status: 405 })
            }

            return NextResponse.json({ data: "Cart Item is cleared" }, { status: 200 })
        } else {
            if (quantityOperation.trim() === "+") {
                const quantityAdded = await Cart.updateOne({ _id: cartId, "cartItems._id": _id },
                    {
                        $set: {
                            "cartItems.$.quantity": quantity + 1
                        }
                    },
                    {
                        new: true
                    }
                )

                if (!quantityAdded) {
                    return NextResponse.json({ data: "Failed to add the quantity" }, { status: 403 })
                }

                return NextResponse.json({ data: quantityAdded }, { status: 200 })
            } else {
                const quantityMinus = await Cart.updateOne({ _id: cartId, "cartItems._id": _id },
                    {
                        $set: {
                            "cartItems.$.quantity": quantity - 1
                        }
                    },
                    {
                        new: true
                    }
                )

                if (!quantityMinus) {
                    return NextResponse.json({ data: "Failed to delete the quantity" }, { status: 403 })
                }

                return NextResponse.json({ data: quantityMinus }, { status: 200 })
            }
        }


    } catch (error) {
        return NextResponse.json({ error: `Error updating the cart : ${error}` }, { status: 500 })
    }
}