/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */
'use client'

import { useTheme } from 'next-themes';
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { FaChevronRight } from 'react-icons/fa'
import { useRouter } from 'next/navigation';
// import Router from 'next/router';

function CategoryCard({ category }) {
    const [isCategoryBoxShadow, serIsCategoryBoxShadow] = useState(false);

    const { theme } = useTheme();

    useEffect(() => {

        if (theme === 'light') {
            serIsCategoryBoxShadow(true)
        } else {
            serIsCategoryBoxShadow(false)
        }

    }, [isCategoryBoxShadow, theme])

    const router = useRouter()

    const [isLoadImage, setIsLoadImage] = useState(true);

    // const [loading, setLoading] = useState(false);

    // Router.events.on("routeChangeStart", () => {
    //     console.log("Route is staring...")
    //     setLoading(true)
    // })

    // Router.events.on("routeChangeComplete", () => {
    //     console.log("Route is completed...")
    //     setLoading(false)
    // })

    return (
        <div className='w-full h-full grid slg:grid-cols-4 sm:grid-cols-3 small:grid-cols-2 grid-cols-1 small:gap-y-[47px] gap-y-[45px] xl:gap-x-[56px] sm:gap-x-[20px] gap-x-[15px] sm:mt-[30px] mt-[40px] pb-[30px] xl:px-[3rem] xs:px-[1.5rem] px-[1rem]'>
            {/* {
                loading === true ? (
                    category?.map((ele) => (
                        <div key={ele._id} className='1x1:w-[260px] xl:w-[245px] sm:w-[90%] small:w-[93%] w-[63%] mx-auto lg:h-[240px] slg:h-[200px] md:h-[220px] h-[230px] animate-pulse'>
                            <div className="bg-slate-400 h-full w-full"></div>
                        </div>
                    ))
                ) : (
                    
                )
            } */}

            {
                category.map((ele) => {
                    return (
                        <div onClick={() => router.push(ele.links)} key={ele._id} className={`1x1:w-[260px] xl:w-[245px] sm:w-[90%] small:w-[93%] w-[63%] mx-auto h-auto cursor-pointer
                            `}>
                            <div id="categoryCard" className={`w-full h-auto bg-white slg:p-0 p-[8px] dark:bg-[#262936] relative group ${isCategoryBoxShadow === true ? 'hover:shadow-[0_2px_4px_#aaa] light_theme' : 'shadow-none'} rounded-[20px] transition-all duration-100`}>
                                <style jsx>
                                    {`
                                        #categoryCard:hover {
                                            background-image: ${ele.bgColor};
                                            transition: 0.6s cubic-bezier(0.46, 0.03, 0.52, 0.96);
                                        }
    
                                        #categoryCard button {
                                            transition: 0.1s cubic-bezier(0.46, 0.03, 0.52, 0.96);  
                                        }
    
                                        #categoryCard #categoryTitle {
                                            background: ${ele.bgColor}; 
                                            -webkit-text-fill-color: transparent;
                                            background-clip: text;
                                            -webkit-background-clip: text;
                                        }
    
                                        @media (max-width:992px) {
                                            #categoryCard {
                                                background-image: ${ele.bgColor};
                                                transition: 0.6s cubic-bezier(0.46, 0.03, 0.52, 0.96);
                                            }
    
                                            #categoryCard.light_theme {
                                                box-shadow: 0 2px 4px #aaa;
                                            }
    
                                            #categoryCard .card_Bottom {
                                                bottom:0;
                                            }
                                        }
                                    `}
                                </style>

                                {/* top sides */}
                                <div className='w-full lg:h-[160px] md:h-[120px] xs:h-[140px] h-[110px] flex items-center justify-center slg:p-[20px_20px_0_20px]'>
                                    {/* Images */}
                                    {/* urlFor */}
                                    <Image id='cardImage'
                                        src={ele.image}
                                        width={210}
                                        importance="high"
                                        rel="preload"
                                        priority={true}
                                        height={160}
                                        alt={ele._id}
                                        title={ele.title + ' Category'}
                                        className={`w-auto lg:h-[155px] max-h-40 h-full object-contain lg:group-hover:scale-[1.1] lg:group-hover:-mt-[40px] lg:scale-[1] scale-[1.2] lg:-mt-0 -mt-[40px] transition-[0.6s_cubic-bezier(0.46, 0.03, 0.52, 0.96)] duration-150 ${isLoadImage === true ? 'blur-sm' : ''}`}
                                        onLoadingComplete={() => setIsLoadImage(false)}
                                    />
                                    <button aria-label="category-btn" type='button' role="button" className='category-btn absolute z-10 right-[15px] flex items-center justify-center md:-bottom-[24px] small:-bottom-[22px] -bottom-[18px] md:w-[50px] md:h-[50px] w-[45px] h-[45px] rounded-full bg-[#eee] dark:bg-[#858999] shadow-[0_0_6px_0_#aaa] dark:shadow-[0_0_2px_0_#aaa]'>
                                        <FaChevronRight size={20} className='text-black' />
                                    </button>
                                </div>
                                {/* bottom sides */}
                                <div className='touch-pan-y overflow-hidden relative p-[20px] pt-0 w-full md:h-[80px] small:h-[75px] h-[50px] lg:rounded-[0_0_20px_20px] rounded-[0_0_16px_16px] lg:shadow-none shadow-[0_1px_2px_rgba(0,0,0,0.2)]'>
                                    <div id="maskImages" className='card_Bottom w-full h-full absolute group-hover:bottom-0 -bottom-full left-0 right-0 flex items-center justify-center bg-white dark:bg-white/80'>
                                        <h4 id='categoryTitle' className='font-bold xl:text-[24px] mobile:text-[20px] small:text-[18px] text-[16px] mb-0'>{ele.title}</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })
            }

        </div>
    )
}

export default CategoryCard