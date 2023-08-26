/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
'use client'

import React, { useRef, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
// import required modules
import { Navigation, Autoplay } from "swiper";
import Image from 'next/image';
// import Router from 'next/router';
import { useRouter } from 'next/navigation';
import imageUrlBuilder from '@sanity/image-url'

const builder = imageUrlBuilder({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECTID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
})
const urlFor = (source) => builder.image(source);

function Banner({ bannerData, bannerVideo, bannerBoxImages, bannerBoxTitle, bannerBoxText }) {
    const router = useRouter();

    const swiperRef = useRef();

    const [isLoadImage, setIsLoadImage] = useState(true);
    const [isLoadBox, setIsLoadBox] = useState(true);

    return (
        <>
            <div className='w-full h-max flex gap-[20px] xl:px-[3rem] items-center xs:px-[1.5rem] px-[1rem]'>

                {/* left side banner */}
                <div className='xl:w-[72.50%] lg:w-[68%] w-full h-full rounded-[60px]'>

                    {
                        bannerData && (
                            <Swiper
                                spaceBetween={20}
                                slidesPerView={1}
                                autoplay={isLoadImage === false ? {
                                    delay: 2500,
                                    disableOnInteraction: false,
                                } : false}
                                modules={[Navigation, Autoplay]}
                                onBeforeInit={(swiper) => {
                                    swiperRef.current = swiper;
                                }}
                                className='justify-end items-end'
                            >
                                {
                                    bannerData && bannerData.map((ele) => {
                                        return (
                                            <SwiperSlide key={ele._id}>
                                                <Image
                                                    src={urlFor(ele.image.asset._ref).url()}
                                                    onClick={() => router.push(ele.links)}
                                                    width={860}
                                                    height={280}
                                                    alt={ele._id}
                                                    title={`${ele.links} banner background image`}
                                                    importance="high"
                                                    rel="none"
                                                    quality={50}
                                                    decoding="async"
                                                    loading="lazy"
                                                    className={`w-auto max-h-[280px] h-full object-contain cursor-pointer ${isLoadImage === true ? 'blur-sm' : ''} `}
                                                    onLoadingComplete={() => setIsLoadImage(false)}
                                                />
                                                {/* md:block hidden  */}
                                                {/* mobile site image */}
                                                {/* <Image
                                        src={urlFor(ele?.mobileImage?.asset?._ref).url()}
                                        onClick={() => router.push(ele.links)}
                                        width={600}
                                        height={300}
                                        quality={50}
                                        importance="high"
                                        rel="preload"
                                        decoding="async"
                                        loading="lazy"
                                        alt={ele._id}
                                        title={`${ele.links} banner background image`}
                                        className='w-auto h-auto max-h-[300px] mx-auto md:hidden block object-contain cursor-pointer' /> */}
                                            </SwiperSlide>
                                        )
                                    })
                                }
                                <div className='w-full md:block hidden'>
                                    <button type='button' role="button" aria-label="prev_btn" className={`prev-btn cursor-pointer absolute ring-2 ring-white/40 hover:ring-[#e7edef] flex items-center justify-center z-50 bottom-[24px] right-[100px] w-[36px] h-[36px] rounded-full bg-black/60`} onClick={() => swiperRef.current.slidePrev()}>
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#e7edef">
                                            <path d="M0 0h24v24H0V0z" fill="none" opacity=".87"></path>
                                            <path d="M16.62 2.99c-.49-.49-1.28-.49-1.77 0L6.54 11.3c-.39.39-.39 1.02 0 1.41l8.31 8.31c.49.49 1.28.49 1.77 0s.49-1.28 0-1.77L9.38 12l7.25-7.25c.48-.48.48-1.28-.01-1.76z"></path>
                                        </svg>
                                    </button>
                                    <button type='button' role="button" aria-label="next_btn" className='next-btn cursor-pointer absolute ring-2 ring-white/40 hover:ring-[#e7edef] flex items-center justify-center z-50 bottom-[24px] right-[40px] w-[36px] h-[36px] rounded-full bg-black/60' onClick={() => swiperRef.current.slideNext()}>
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#e7edef">
                                            <path d="M24 24H0V0h24v24z" fill="none" opacity=".87"></path>
                                            <path d="M7.38 21.01c.49.49 1.28.49 1.77 0l8.31-8.31c.39-.39.39-1.02 0-1.41L9.15 2.98c-.49-.49-1.28-.49-1.77 0s-.49 1.28 0 1.77L14.62 12l-7.25 7.25c-.48.48-.48 1.28.01 1.76z"></path>
                                        </svg>
                                    </button>
                                </div>
                            </Swiper>
                        )
                    }
                </div>
                {/* right side video banner */}
                <div className='xl:w-[30%] lg:w-[36%] w-full h-full lg:block hidden'>
                    <div className={`w-full 1x1:h-[265px] xl:h-[250px] h-[190px] group relative`}>
                        {/* Video */}
                        <video
                            preload="none"
                            muted={true}
                            loop={true}
                            autoPlay={true}
                            loading="lazy"
                            decoding="async"
                            width={480}
                            height={360}
                            importance="high"
                            rel="none"
                            // mt-[16px]
                            className='group-hover:hidden block w-full h-full object-cover rounded-[20px] blur-sm'
                            onLoadedData={(video) => { setIsLoadBox(false), video && video.target.classList.remove("blur-sm") }}
                        >
                            <source src={bannerVideo} type="video/mp4" />
                        </video>

                        {/* images shows */}
                        <Image
                            src={bannerBoxImages}
                            width={292}
                            importance="high"
                            title={`${bannerBoxText} background image`}
                            rel="preload"
                            loading="lazy"
                            height={240}
                            quality={50}
                            alt='banner-images'
                            // mt-[16px]
                            className={`w-full h-full object-cover group-hover:block hidden rounded-[20px] ${isLoadBox === true ? 'blur-sm' : ''}`}
                        />
                        {/* banner box */}
                        <div id='bannerBoxContents' className='absolute left-0 bottom-0 w-full h-fit rounded-[0_0_19px_19px] p-[20px_20px_15px_20px]'>
                            {/* title */}
                            <h4 className='mb-[0.5rem] text-white capitalize'>{bannerBoxTitle}</h4>
                            <p className='text-[#96a0a5] text-[14px] capitalize'>{bannerBoxText}</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Banner