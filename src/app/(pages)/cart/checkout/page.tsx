"use client"

const CartCeckOut = () => {

    const cartItems: any = localStorage.getItem('cartItems');

    return (
        // A version->2 v2 feature to be rolled out
        <div>{JSON.stringify(cartItems)}</div>
    )
}

export default CartCeckOut

