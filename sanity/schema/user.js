export default {
    name: 'user',
    title: 'User',
    type: 'document',
    fields: [
        {
            name: 'profileImage',
            title: 'Profile Image',
            type: 'image',
            options: {
                hotspot: true, // If you want to enable hotspot image cropping
            },
            readOnly: true
        },
        {
            name: 'username',
            title: 'Username',
            type: 'string',
        },
        {
            name: 'email',
            title: 'Email',
            type: 'string',
        },
        {
            name: 'passwordProtect',
            title: 'Password',
            type: 'string',
        },
        {
            name: 'mobile_number',
            title: 'Mobile Number',
            type: 'string',
        },
        {
            name: 'address',
            title: 'Address',
            type: 'string',
        },
        {
            name: 'isAdmin',
            title: 'Is Admin',
            type: 'boolean',
        }
    ],
}