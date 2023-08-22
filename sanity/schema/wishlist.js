export default {
    name: 'wishlist',
    title: 'Wishlist',
    type: 'document',
    fields: [
        {
            name: 'wishlistId',
            title: 'Wishlist ID',
            type: 'string',
        },
        {
            name: 'user',
            title: 'User',
            type: 'reference',
            to: [{ type: 'user' }]
        },
        {
            name: 'product',
            type: 'reference',
            to: [{ type: 'product' }]
        },
    ]
}