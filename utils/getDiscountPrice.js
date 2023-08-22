export const getDiscountedPricePercentage = (
    originalPrice,
    discountedPrice
) => {

    const discount = Number(originalPrice) - Number(discountedPrice);

    const discountPercentage = (discount / originalPrice) * 100;

    return discountPercentage.toFixed(2);
};