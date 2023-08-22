import React from 'react'
import Head from 'next/head'

// eslint-disable-next-line react/prop-types
function CommonHead({ title }) {
    return (
        <Head>
            <title>{title}</title>
            <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
            <meta charset="UTF-8" />
            <meta name="description" content="E-commerce Website for buying a products at WishBin | Online Shopping site in India: Shop Online for Mobiles, Cloths, Groceries, Electronics and More - WishBin" />
            <meta name="author" content="Nilesh_Rathod" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/HeadIcons.png" />
            <meta name="theme-color" content="#e7edef" />
            {/* <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" /> */}
        </Head>
    )
}

export default CommonHead