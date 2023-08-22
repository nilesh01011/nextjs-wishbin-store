'use client'

import PropTypes from 'prop-types';
import CommonHead from '../components/CommonHead'
import Footer from '../components/Footer'
import Header from '../components/Header'
import OffersContainer from '../components/OffersContainer'
import ThemeChanged from '../components/ThemeChanged'
import React, { useState } from 'react'
import Banner from '../components/Banner'
import Cards from '../components/Cards'
import BannerSticker from '../components/BannerSticker'
import { client } from '../sanity';
import { Router } from 'next/router';
import Loading from '../components/Loading';

function FurniturePage({ newProduct, bannerImages }) {

    const bannerSticker = '/bannerSticker/Furniture_Add.webp';
    const mobileBannerSticker = '/bannerSticker/Mobile_Furniture_Add.webp';
    const bannerVideo = '/video/furniture.mp4';
    const bannerBoxTitle = 'Furniture 2023'
    const bannerBoxText = "New Furniture"
    const bannerBoxImages = '/bannerBoxImg/furniture.webp';

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
            <CommonHead title="Furniture Products - WishBin Store | Online Shopping site in India" />

            {
                loading === true ? (
                    <Loading />
                ) : (
                    <>
                        <div className='w-full h-full'>
                            <Header sticky={true} />

                            <main className="max-w-[1366px] mx-auto w-full h-full">
                                {/* banner images and video */}
                                <Banner bannerVideo={bannerVideo} bannerBoxImages={bannerBoxImages} bannerData={bannerImages && bannerImages} bannerBoxTitle={bannerBoxTitle} bannerBoxText={bannerBoxText} />
                                {/* products list */}
                                <div className='pt-[40px]'>
                                    <Cards cardsList={newProduct && newProduct} />
                                </div>
                                {/* banner sticker */}
                                <div className='mb-[7.5rem] mt-[7px]'>
                                    <BannerSticker bannerImg={bannerSticker} mobileBannerSticker={mobileBannerSticker} links='/furniture' bannerName='Modern Furniture 2023' />
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

export default FurniturePage;

// PropTypes
FurniturePage.propTypes = {
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
    const newProduct = product.filter(ele => ele.categoryTitle === "furniture");
    // banner image data
    const bannerImageQuery = `*[_type == 'bannerImage']`;
    const bannerImage = await client.fetch(bannerImageQuery);
    // Filter banners
    const bannerImages = bannerImage.filter(ele => ele.links === "/furniture");

    return {
        props: {
            newProduct,
            bannerImages
        }
    }
}