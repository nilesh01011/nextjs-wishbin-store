export default {
    name: 'category',
    title: 'Category',
    type: 'document',
    fields: [
        {
            name: 'title',
            title: 'Category Title',
            type: 'string',
        },
        {
            name: 'image',
            title: 'Image',
            type: 'image',
            Options: {
                hotspot: true
            }
        },
        {
            name: 'bgColor',
            title: 'Category Background Color',
            type: 'string',
        },
        {
            name: 'links',
            title: 'Page Links',
            type: 'string',
        }
    ]
}