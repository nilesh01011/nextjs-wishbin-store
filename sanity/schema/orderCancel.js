export default {
    name: 'orderCancel',
    title: 'Cancel Order',
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
            readOnly: true
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
        {
            name: 'cancelDate',
            title: 'Cancel Date',
            type: 'string',
            readOnly: true
        }
    ]
}