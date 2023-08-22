'use client'

import PropTypes from 'prop-types'
import CommonHead from '../components/CommonHead'
import Footer from '../components/Footer'
import Header from '../components/Header'
import OffersContainer from '../components/OffersContainer'
import ThemeChanged from '../components/ThemeChanged'
import React, { useState } from 'react'
import Cards from '../components/Cards'
import BannerSticker from '../components/BannerSticker'
import Banner from '../components/Banner'
import { Router } from 'next/router'
import Loading from '../components/Loading'
import { client } from '../sanity'

function MobilePage({ newProducts, bannerImages }) {
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

    const bannerSticker = '/bannerSticker/Mobile_Add.webp';
    const mobileBannerSticker = '/bannerSticker/Mobile_Phone_Add.webp';
    const bannerVideo = '/video/mobiles.mp4';
    const bannerBoxTitle = 'Mobile Device 2023'
    const bannerBoxText = "New Mobile Device Collection"
    const bannerBoxImages = '/bannerBoxImg/mobile.webp';

    return (
        <>
            <CommonHead title="Mobile Products - WishBin Store | Online Shopping site in India" />

            {
                loading === true ? (
                    <Loading />
                ) : (
                    <>
                        <div className='w-full h-full'>
                            <Header sticky={true} />

                            <main className="max-w-[1366px] mx-auto w-full h-full">
                                {/* banner images and video */}
                                <Banner bannerVideo={bannerVideo && bannerVideo} bannerBoxImages={bannerBoxImages && bannerBoxImages} bannerData={bannerImages && bannerImages} bannerBoxTitle={bannerBoxTitle && bannerBoxTitle} bannerBoxText={bannerBoxText && bannerBoxText} />
                                {/* products list */}
                                <div className='pt-[40px]'>
                                    <Cards cardsList={newProducts && newProducts} />
                                </div>

                                {/* banner sticker */}
                                <div className='mb-[7.5rem] mt-[7px]'>
                                    <BannerSticker bannerImg={bannerSticker} mobileBannerSticker={mobileBannerSticker} links='/mobile' bannerName='Trending Mobile Phones' />
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

export default MobilePage;

// PropTypes
MobilePage.propTypes = {
    newProducts: PropTypes.array.isRequired,
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
    const newProducts = product.filter(item => item.categoryTitle === 'mobile');

    // banner image data
    const bannerImageQuery = `*[_type == 'bannerImage']`;
    const bannerImage = await client.fetch(bannerImageQuery);
    // Filter banners
    const bannerImages = bannerImage.filter(ele => ele.links === "/mobile");

    return {
        props: {
            newProducts,
            bannerImages
        }
    }
}