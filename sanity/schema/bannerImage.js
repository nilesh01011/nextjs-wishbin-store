export default {
    name: 'bannerImage',
    title: 'Banner Image',
    type: 'document',
    fields: [
        {
            name: 'image',
            title: 'Banner Image',
            type: 'image',
            Options: {
                hotspot: true
            }
        },
        {
            name: 'mobileImage',
            title: 'Mobile Image',
            type: 'image',
            Options: {
                hotspot: true
            }
        },
        {
            name: 'links',
            title: 'Page Links',
            type: 'string',
        }
    ]
}