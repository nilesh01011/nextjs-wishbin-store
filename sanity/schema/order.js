export default {
    name: 'order',
    title: 'Order',
    type: 'document',
    fields: [
        {
            name: 'user',
            title: 'User',
            type: 'reference',
            to: [{ type: 'user' }],
            options: {
                disableNew: true,
            },
            readOnly: true
        },
        {
            name: 'product',
            type: 'reference',
            to: [{ type: 'product' }],
            readOnly: true
        },
        {
            name: 'orderId',
            title: 'Order ID',
            type: 'string',
            readOnly: true
        },
        {
            name: 'quantity',
            title: 'Quantity',
            type: 'number',
            readOnly: true
        },
        {
            name: 'subTotal',
            title: 'SubTotal',
            type: 'number',
            readOnly: true
        },
        {
            name: 'status',
            type: 'string',
            title: 'Status',
            inputComponent: 'dropdown',
            options: {
                list: [
                    { title: 'Placed', value: 'placed,1' },
                    { title: 'Confirmed', value: 'confirmed,2' },
                    { title: 'Preparing', value: 'preparing,3' },
                    { title: 'Delivered', value: 'delivered,4' },
                    { title: 'Completed', value: 'completed,5' },
                ]
            }
        },
        {
            name: 'address',
            title: 'Address',
            type: 'string',
            readOnly: true
        },
        {
            name: 'city',
            title: 'City',
            type: 'string',
            readOnly: true
        },
        {
            name: 'country',
            title: 'Country',
            type: 'string',
            readOnly: true
        },
        {
            name: 'zipCode',
            title: 'Zip Code',
            type: 'number',
            readOnly: true
        },
        {
            name: 'paymentType',
            title: 'Payment Type',
            type: 'string',
            readOnly: true
        },
    ]
}