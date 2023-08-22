"use client"

import PropTypes from 'prop-types';
import Header from '../components/Header'
import React, { useState } from 'react'
import ThemeChanged from '../components/ThemeChanged'
import CommonHead from '../components/CommonHead'
import OffersContainer from '../components/OffersContainer'
import Footer from '../components/Footer'
import Banner from '../components/Banner'
import Cards from '../components/Cards'
import BannerSticker from '../components/BannerSticker'
import { Router } from 'next/router'
import Loading from '../components/Loading'
import { client } from '../sanity';

function ComputerPage({ newProduct, bannerImages }) {

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

    const bannerSticker = '/bannerSticker/Computer_Add.webp';
    const mobileBannerSticker = '/bannerSticker/Mobile_Computer_Add.webp';
    const bannerVideo = '/video/computer.mp4';

    const bannerBoxTitle = 'Computers 2023'
    const bannerBoxText = "Computers Gadget's"

    const bannerBoxImages = '/bannerSticker/Computer_Add.webp'
    return (
        <>
            <CommonHead title="Computer Products - WishBin Store | Online Shopping site in India" />

            {
                loading === true ? (
                    <Loading />
                ) : (
                    <>
                        <div className='w-full h-full'>
                            <Header sticky={true} />

                            <main className="max-w-[1366px] mx-auto w-full h-full">
                                {/* banner images and video */}
                                <Banner bannerVideo={bannerVideo && bannerVideo}
                                    bannerBoxImages={bannerBoxImages && bannerBoxImages}
                                    bannerData={bannerImages && bannerImages} bannerBoxTitle={bannerBoxTitle && bannerBoxTitle} bannerBoxText={bannerBoxText && bannerBoxText} />
                                {/* products list */}
                                <div className='pt-[40px]'>
                                    <Cards cardsList={newProduct && newProduct} />
                                </div>

                                {/* banner sticker */}
                                <div className='mb-[7.5rem] mt-[7px]'>
                                    <BannerSticker bannerImg={bannerSticker} mobileBannerSticker={mobileBannerSticker} links='/computer' bannerName='Computer Collections 2023' />
                                </div>

                                {/* offers container */}
                                <OffersContainer />
                            </main>

                            {/* Footer */}
                            <Footer mainFooter={true} />
                        </div>
                        <ThemeChanged />
                    </>
                )
            }
        </>
    )
}

export default ComputerPage;

// PropTypes
ComputerPage.propTypes = {
    newProduct: PropTypes.array.isRequired,
    bannerImages: PropTypes.array.isRequired,
};

// SSR and fetch products
export const getServerSideProps = async () => {
    // product data
    const productQuery = `*[_type == 'product']{
    _id,
    name,
    rating,
    categoryTitle,
    mrp,
    price,
    qty,
    description,
    "image":image.asset->url
  }`;
    const product = await client.fetch(productQuery);
    // Filter products
    const newProduct = product.filter(ele => ele.categoryTitle === "computer");
    // banner image data
    const bannerImageQuery = `*[_type == 'bannerImage']`;
    const bannerImage = await client.fetch(bannerImageQuery);
    // Filter banners
    const bannerImages = bannerImage.filter(ele => ele.links === "/computer");

    return {
        props: {
            newProduct,
            bannerImages
        }
    }
}