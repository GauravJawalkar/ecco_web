export function discountPercentage(totalPrice: number, discountAmount: number) {
    const discountPercentage = (discountAmount / totalPrice) * 100;
    return discountPercentage;
}