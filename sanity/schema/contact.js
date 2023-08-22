export default {
    name: 'contact',
    title: 'Contact',
    type: 'document',
    fields: [
        {
            name: 'username',
            title: 'Customer Name',
            type: 'string',
        },
        {
            name: 'email',
            title: 'User Email address',
            type: 'string',
        },
        {
            name: 'message',
            type: 'string',
            title: 'Message',
        },
        {
            name: 'status',
            type: 'string',
            title: 'Status',
            inputComponent: 'dropdown',
            options: {
                list: [
                    { title: 'Pending', value: 'pending' },
                    { title: 'Completed', value: 'completed' },
                ]
            }
        },
    ]
}