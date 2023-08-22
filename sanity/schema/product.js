export default {
    name: 'product',
    title: 'Product',
    type: 'document',
    fields: [
        {
            name: 'name',
            title: 'Name',
            type: 'string',
        },
        {
            name: 'categoryTitle',
            title: 'Category Title for BG image, e.g (toys, mobile, cloths,..., etc)',
            type: 'string',
            inputComponent: 'dropdown',
            options: {
                list: [
                    { title: 'Electronics', value: 'electronics' },
                    { title: 'SoftToys', value: 'toys' },
                    { title: 'Cloths', value: 'cloths' },
                    { title: 'BabyCloths', value: 'babyCloths' },
                    { title: 'Mobile', value: 'mobile' },
                    { title: 'Furniture', value: 'furniture' },
                    { title: 'Groceries', value: 'groceries' },
                    { title: 'Games', value: 'games' },
                    { title: 'Computer', value: 'computer' },
                    { title: 'Watch', value: 'watch' },
                    { title: 'Shoes', value: 'shoes' },
                    { title: 'Movie PVR', value: 'movie' },
                ]
            }
        },
        {
            name: 'image',
            title: 'Image',
            type: 'image',
            options: { hotspot: true },
        },
        {
            name: 'category',
            title: 'Category',
            type: 'reference',
            to: [{ type: 'category' }]
        },
        {
            name: 'description',
            title: 'Description',
            type: 'string',
        },
        {
            name: 'price',
            title: 'Price',
            type: 'number',
        },
        {
            name: 'mrp',
            title: 'MRP',
            type: 'number',
        },
        {
            name: 'rating',
            title: 'Rating Stars',
            type: 'number',
        },
        {
            name: 'rating_number',
            title: 'Rating number',
            type: 'number',
        },
        {
            name: 'status',
            title: 'Status',
            type: 'boolean',
        },
        {
            name: 'soldBy',
            title: 'Seller Name',
            type: 'string',
        },
        {
            name: 'qty',
            title: 'Quantity',
            type: 'number',
        },
        {
            name: 'tableDetails',
            title: 'Table Details',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        {
                            name: 'column1',
                            type: 'string'
                        },
                        {
                            name: 'column2',
                            type: 'string'
                        }
                    ]
                }
            ],
        },
        {
            name: 'about_details',
            title: 'About Details',
            type: 'array',
            of: [{ type: 'string' }],
            options: {
                fields: [
                    { text: 'string' },
                ]
            }
        },
        {
            name: 'body',
            title: 'Product Details',
            type: 'array',
            of: [{ type: 'block' }]
        }
    ]
}