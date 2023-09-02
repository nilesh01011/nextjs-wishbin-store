/* eslint-disable no-undef */
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react'
import { FaCouch, FaMobileAlt, FaPlaystation, FaTshirt } from 'react-icons/fa';

// when clicks outside of the box will disappear
let useClickOutSide = (handler) => {
    let domNode = useRef();

    useEffect(() => {
        const handlerEvent = (e) => {
            if (!domNode.current.contains(e.target)) {
                handler();
            }
        }

        document.addEventListener("mousedown", handlerEvent);

        return () => {
            document.removeEventListener("mousedown", handlerEvent)
        }
    }, [handler]);

    return domNode
}

function OffersContainer() {
    const [isActiveOffer, setIsActiveOffer] = useState(false);

    const footerOffersList = [
        {
            id: 1,
            name: 'Cloths',
            icons: <FaTshirt size={18} className='text-[#0984e3]' />
        },
        {
            id: 2,
            name: 'Furniture',
            icons: <FaCouch size={18} className="text-[#E9C799]" />,
        },
        {
            id: 3,
            name: 'Mobile Phones',
            icons: <FaMobileAlt size={18} className='text-black' />
        },
        {
            id: 4,
            name: 'Video Games',
            icons: <FaPlaystation size={18} className='text-[#ff4757]' />
        }
    ];

    let domNode = useClickOutSide(() => {
        setIsActiveOffer(false);
    })

    return (
        <div className='fixed w-auto right-0 xl:bottom-[25%] bottom-[35%] h-[288px] bg-[rgba(0,0,0,0.6)] z-[100] text-white sm:flex hidden'>
            <div ref={domNode} onClick={() => setIsActiveOffer(!isActiveOffer)} className='cursor-pointer p-[1.2rem_0.8rem] h-full w-[50px] flex items-center justify-between flex-col'>
                {/* icons */}
                <span className={`w-0 h-0 ${isActiveOffer === true ? 'border-r-0 border-l-[16px] border-l-white' : 'border-r-[16px] border-r-white border-l-0'} border-t-[13px] border-t-[transparent] border-b-[13px] border-b-[transparent]`}></span>
                {/* titles */}
                <h1 className='text-[20px] select-none tracking-[2px] font-[800] h-[20px] text-center align-middle -rotate-[180deg] [writing-mode:vertical-rl] whitespace-nowrap text-[#e7edef]'>FLAT ₹500 OFF</h1>
            </div>

            {/* contents */}
            {
                isActiveOffer === true &&
                <div className='w-[530px] h-full block p-[1rem] pl-[2rem] text-black' style={{ backgroundImage: 'linear-gradient(270deg, #fef9e5, #fde3f3)' }}>
                    <div className='flex h-full items-center justify-between flex-col'>
                        {/* top sides */}
                        <div className='w-full h-full flex items-center justify-between text-[#3E4152]'>
                            {/* contents adds */}
                            <div className='w-full flex justify-between flex-col'>
                                <span className='font-[500] text-[12px] w-fit'>AVAIL FLAT</span>
                                <div className='leading-[45px] mt-1'>
                                    {/* prices */}
                                    <h1 className='text-[2.5rem] font-bold w-fit'>₹500 OFF</h1>
                                    {/* shipping status */}
                                    <h1 className='text-[1.8rem] font-[500] w-fit'>+ FREE SHIPPING</h1>
                                </div>

                                <div className='mt-[12.8px] flex flex-col leading-[1.4rem]'>
                                    <p className='text-[13px] font-[500] w-fit'>Coupon Code: <span className='font-bold pl-[0.2rem]'>WISHBIN500</span></p>
                                    <span className="text-[10px]">Applicable on your first order</span>
                                </div>
                            </div>
                            {/* images */}
                            <div className='h-full'>
                                <Image src='/logo.svg'
                                    width={182} height={180}
                                    alt='wishbin-logo'
                                    loading="lazy"
                                    decoding="async"
                                    quality={80}
                                    importance="high"
                                    rel="none"
                                    title="Offer sticker image"
                                    className='w-[300px] h-full object-contain' />
                            </div>
                        </div>
                        {/* bottom sides */}
                        <div className='w-full flex items-center'>
                            {/* left sides */}
                            <div className='w-[65%] flex gap-[8px] items-end'>
                                {
                                    footerOffersList.map((ele) => {
                                        const { id, icons, name } = ele;
                                        return (
                                            <span key={id} className='flex items-center gap-[0.1rem] flex-col text-[12px] font-[400]'>
                                                {icons} {name}
                                            </span>
                                        )
                                    })
                                }
                                <span className='text-[12px] font-[500]'>+more</span>
                            </div>

                            {/* right sides */}
                            <div className='w-[36%] text-center'>
                                <h4 className='font-bold text-[1rem]'>Upcoming Offers</h4>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default OffersContainer