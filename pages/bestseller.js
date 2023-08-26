'use client'

import PropTypes from 'prop-types';
import React, { useState } from 'react'
import ThemeChanged from '../components/ThemeChanged'
import Footer from '../components/Footer'
import OffersContainer from '../components/OffersContainer'
import Header from '../components/Header'
import Loading from '../components/Loading'
import CommonHead from '../components/CommonHead'
import { useRouter } from 'next/navigation';
import { Router } from 'next/router';
import { client } from '../sanity'
import Image from 'next/image'
import { FaAngleRight } from 'react-icons/fa'
import { TiArrowBack } from 'react-icons/ti'

function BestSellerPage({ category }) {
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    Router.events.on("routeChangeStart", () => {
        // eslint-disable-next-line no-undef
        console.log("Route is staring...")
        setLoading(true)
    });

    Router.events.on("routeChangeComplete", () => {
        // eslint-disable-next-line no-undef
        console.log("Route is completed...")
        setLoading(false)
    });

    return (
        <>

            <CommonHead title="Best Seller - WishBin Store | Online Shopping site in India" />

            {
                loading === true ? (
                    <Loading />
                ) : (
                    <>
                        <div id='Container' className='w-full h-full'>
                            <Header sticky={true} navbar={false} />

                            <main className="max-w-[1366px] mx-auto w-full h-full xl:px-[3rem] xs:px-[1.5rem] px-[1rem] mt-[1rem] xl:mb-[7.3rem] slg:mb-[6.6rem] sm:mb-[6.8rem] xs:mb-[6rem] mb-[7.3rem]">
                                {/* back button */}
                                <button onClick={() => router.back()}
                                    role='button'
                                    type='button'
                                    aria-label='go-back'
                                    className='w-max h-max text-[14px] py-[0.4rem] px-[1.5rem] rounded-[5px] dark:text-[#BABECD] border-[1px] border-black/70 dark:border-[#BABECD]/70 dark:hover:border-black hover:bg-black dark:hover:bg-[#BABECD] hover:text-white dark:hover:text-black flex items-center justify-center gap-[5px]'>
                                    <TiArrowBack size={14} />
                                    Go Back
                                </button>
                                {/* title */}
                                <h1 className='text-3xl mb-[28px] text-center text-black dark:text-[#BABECD] sm:mt-0 mt-[0.8rem]'>Top Category</h1>
                                <div className='w-full h-full xl:columns-4 md:columns-3 columns-2 gap-3 space-y-3'>
                                    {
                                        category && category.map((ele) => {
                                            const { _id, bgColor, links, title, image } = ele;

                                            return (
                                                <div key={_id} className='w-full h-full p-[20px] group rounded-[10px] flex mobile:flex-row flex-col items-end justify-between md:gap-4 gap-2 overflow-hidden shadow-md' style={{ background: `${bgColor}` }}>
                                                    {/* title */}
                                                    <h4 onClick={() => router.push(links)} className='text-white text-xl font-bold flex items-end gap-1 cursor-pointer mobile:order-1 order-2 text-left w-full'>
                                                        {title}
                                                        {/* icons */}
                                                        <FaAngleRight size={15} className='mb-1' />
                                                    </h4>
                                                    {/* images */}
                                                    <Image id='cardImage'
                                                        src={image}
                                                        width={200}
                                                        importance="high"
                                                        rel="none"
                                                        loading="lazy"
                                                        height={160}
                                                        alt={ele._id}
                                                        title={ele.title + ' Category'}
                                                        className='md:max-h-[200px] max-h-[160px] group-hover:scale-[1.1] transition-transform duration-300 md:max-w-[160px] max-w-[140px] object-contain mobile:order-2 order-1'
                                                    />
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                                {/* offers container */}
                                <OffersContainer />
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

export default BestSellerPage;

// PropTypes
BestSellerPage.propTypes = {
    category: PropTypes.array.isRequired,
};

// SSR and fetch category
export const getServerSideProps = async () => {
    // category data query fetch
    const categoryQuery = `*[_type == 'category']{
    _id,
    links,
    bgColor,
    title,
    "image":image.asset->url
    }`;

    const category = await client.fetch(categoryQuery);

    return {
        props: {
            category,
        }
    }
}