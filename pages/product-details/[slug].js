/* eslint-disable react/prop-types */
'use client'

import PropTypes from 'prop-types';
import CommonHead from '../../components/CommonHead';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import ThemeChanged from '../../components/ThemeChanged';
import { Router } from 'next/router';
import React, { useState } from 'react'
import ProductDetails from '../../components/ProductDetails';
import { client } from '../../sanity';
import Loading from '../../components/Loading';

function Page({ product }) {

    const [loading, setLoading] = useState(false);

    Router.events.on("routeChangeStart", () => {
        // eslint-disable-next-line no-undef
        console.log("Route is staring...")
        setLoading(true)
    })

    Router.events.on("routeChangeComplete", () => {
        // eslint-disable-next-line no-undef
        console.log("Route is completed...")
        setLoading(false)
    })

    return (
        <>
            <CommonHead title={`${product && product.name} - WishBin Store | Online Shopping site in India`} />

            {
                loading === true ? (
                    <Loading />
                ) : (
                    <>
                        {/* product details */}

                        <div id='Container' className='w-full h-full'>
                            <Header navbar={false} sticky={false} smallScreenSticky={true} />

                            <main className="max-w-[1366px] mx-auto w-full h-full">

                                <div className='xl:px-[3rem] md:px-[1.5rem] px-0 mt-[20px]'>
                                    <ProductDetails product={product && product} />
                                </div>
                            </main>
                            {/* Footer */}
                            <Footer mainFooter={true} />
                        </div>
                        {/* theme changed */}
                        <ThemeChanged />
                    </>
                )
            }

        </>
    )
}

export default Page;

Page.prototype = {
    product: PropTypes.object.isRequired,
}

export async function getServerSideProps({ params }) {
    // Use id to fetch product
    const { slug } = params
    const query = `*[_type == 'product' && _id == $slug][0]`
    const product = await client.fetch(query, { slug })

    if (!product) {
        return {
            notFound: true
        }
    }

    return {
        props: {
            product
        }
    }
}
