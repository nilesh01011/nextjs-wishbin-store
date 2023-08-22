/* eslint-disable no-undef */
'use client'

import Footer from '../../../components/Footer';
import Header from '../../../components/Header';
import Loading from '../../../components/Loading';
import ThemeChanged from '../../../components/ThemeChanged';
import { client } from '../../../sanity';
import Image from 'next/image';
import { Router, useRouter } from 'next/router';
import React, { useState } from 'react'
import { FaBox, FaBoxOpen, FaCalendarCheck, FaCheckCircle, FaShippingFast } from 'react-icons/fa';
import { TiArrowBack } from 'react-icons/ti';
import { useQuery } from 'react-query';
import moment from 'moment';
import { useTheme } from 'next-themes';
// import { useSession } from 'next-auth/react';
import CommonHead from '../../../components/CommonHead';

const fetchData = async (id) => {
    try {
        // order fetch by Id 
        const orderId = id ? id : null;
        const query = `*[_type == 'order' && orderId == $orderId][0]`;
        const getOrdersStatus = await client.fetch(query, { orderId });
        // user data fetch
        const userId = getOrdersStatus ? getOrdersStatus.user._ref : null;
        const userQuery = `*[_type == 'user' && _id == $userId][0]`;
        const userData = await client.fetch(userQuery, { userId });
        // product data fetch
        const productId = getOrdersStatus ? getOrdersStatus.product._ref : null;
        const productQuery = `*[_type == 'product' && _id == $productId]{
            _id,
            name,
            price,
            "image":image.asset->url
        }[0]`;
        const productData = await client.fetch(productQuery, { productId });

        return { order: getOrdersStatus, user: userData, product: productData };

    } catch (error) {
        console.log('error for fetching order status', error);
    }
}

function Index() {
    const router = useRouter();
    const { id } = router.query;

    // user exists
    // const User = Cookies.get('userInfo');
    // const [getUser, setUser] = useState([])

    // useEffect(() => {
    //     if (!User) {
    //         window.location.href = '/login'
    //         return router.push('/cart');
    //     }
    //     if (User) {
    //         setUser(JSON.parse(User));
    //     }
    // }, [User])
    // const { data: session } = useSession();

    // useEffect(() => {
    //     if (!session) return router.push('/login')
    // }, [session])

    const { theme } = useTheme();

    const [loading, setLoading] = useState(false);

    Router.events.on("routeChangeStart", () => {
        console.log("Route is staring...")
        setLoading(true)
    })

    Router.events.on("routeChangeComplete", () => {
        console.log("Route is completed...")
        setLoading(false)
    })

    const [rotation, setRotation] = useState(0);

    const tracksStatus = [
        {
            id: 1,
            text: 'Order placed',
            status: 1,
            icons: <FaCalendarCheck size={20} />
        },
        {
            id: 2,
            text: 'Order confirmation',
            status: 2,
            icons: <FaCheckCircle size={20} />
        },
        {
            id: 3,
            text: 'Packing',
            status: 3,
            icons: <FaBoxOpen size={20} />
        },
        {
            id: 4,
            text: 'Out for delivery',
            status: 4,
            icons: <FaShippingFast size={20} />
        },
        {
            id: 5,
            text: 'Completed',
            status: 5,
            icons: <FaBox size={20} />
        }
    ];

    const { data, error, isLoading, isError, refetch } = useQuery('orderId', () => fetchData(id), {
        enabled: id !== undefined
    });


    if (isError) {
        console.error('Errors in UseSwr orderId pages:', isError);
    }

    if (error) {
        console.error('Errors in orderId pages:', error);
    }

    if (isLoading) {
        return <Loading />;
    }

    const handleReload = () => {
        refetch();
    }

    const isActive = Number(data.order.status.split(',')[1]);

    return (
        <>
            <CommonHead title="Order Items Status - WishBin Store | Online Shopping site in India" />

            {
                loading === true ? (
                    <Loading />
                ) : (
                    <>
                        <div className='w-full h-full'>
                            <Header navbar={false} sticky={false} />

                            <main className="max-w-[1366px] mx-auto w-full h-full xl:px-[3rem] md:px-[1.5rem] px-[1rem] xl:mb-[6.7rem] md:mb-[6.4rem] xs:mb-[6rem] mb-[7.2rem] mt-[20px]">
                                <div className='w-full h-full mb-[20px] flex xs:flex-row flex-col sm:items-center xs:gap-0 gap-[10px] justify-between'>
                                    <div className='flex sm:items-center sm:flex-row flex-col sm:gap-[20px] gap-[10px]'>
                                        <button type='button' onClick={() => router.push('/orders')} role='button' aria-label='go-back' className='w-max p-[0.6rem_1.5rem] hover:opacity-75 bg-white dark:bg-[#262936] rounded-[10px] text-black dark:text-[#BABECD] flex items-center gap-[6px]'>
                                            <TiArrowBack size={18} />
                                            Go back
                                        </button>
                                        {/* title */}
                                        <h1 className='text-[1.5rem] font-[600] text-black dark:text-[#BABECD]'>Track delivery status</h1>
                                    </div>
                                    {/* order ID */}
                                    <h6 className='w-max h-max text-[1rem] font-[600] text-[#28c76f] p-[0.6rem_1.5rem] bg-white dark:bg-[#262936] rounded-[10px]'>#{id}</h6>
                                </div>
                                {/* contents */}
                                <div className='w-full h-full flex xl:flex-row flex-col gap-[20px]'>
                                    {/* left side tracks */}
                                    <div className='xl:w-1/2 w-full h-max p-[20px] bg-white dark:bg-[#262936] rounded-[10px] xl:sticky xl:top-0'>
                                        <div className='w-ful flex items-center justify-between'>
                                            {/* title arriving */}
                                            <h3 className='text-[1.2rem] text-black dark:text-[#BABECD] flex sm:items-center sm:flex-row flex-col gap-[5px]'>Arriving: <span className='font-[500] sm:text-[1.2rem] text-[1rem]'>After 3 days of your order dates expected.</span></h3>
                                            {/* reload mutation */}
                                            <button type='button' role='button' onClick={() => { handleReload(), setRotation(rotation + 180) }} className='w-max h-max relative p-[6px_8px] group rounded-[5px] border-[1px] border-[#d5dbdb] dark:border-[#BABECD]'>
                                                <svg className={`transition-transform duration-500`} style={{ transform: `rotate(${rotation}deg)` }} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M19.1819 9.30273C18.7149 9.30273 18.3299 9.64172 18.3299 10.1114C18.2889 13.1704 16.5193 15.9354 13.8117 17.4179C9.73181 19.6519 4.96374 17.6466 3.1368 14.9266L5.71336 15.4616C6.13937 15.5474 6.60635 15.2901 6.69237 14.8245C6.77839 14.3997 6.52033 13.9341 6.05335 13.8484L0.98626 12.7865C0.691328 12.7171 -0.0828679 12.9294 0.00725012 13.7218L0.646269 18.8187C0.687232 19.2435 1.03132 19.5416 1.45733 19.5416C2.09225 19.5416 2.35032 19.076 2.30936 18.6064L2.01033 16.1191C6.15166 21.0732 11.4072 20.383 14.5777 18.9494C17.8588 17.2055 19.9479 13.8525 19.9889 10.1522C19.993 9.68664 19.6489 9.30273 19.1819 9.30273Z" fill={`${theme === 'dark' ? '#BABECD' : 'black'}`} />
                                                    <path d="M0.813992 10.6953C1.28097 10.6953 1.66602 10.3563 1.66602 9.8866C1.70698 6.82759 3.47657 4.06264 6.18421 2.5801C10.2641 0.346086 15.0322 2.35139 16.8591 5.07142L14.2825 4.5364C13.8565 4.45063 13.3896 4.70793 13.3035 5.17352C13.2175 5.59827 13.4756 6.06386 13.9426 6.14963L19.0137 7.2115C19.3087 7.28093 20.0829 7.06856 19.9927 6.27624L19.3537 1.17925C19.3128 0.754498 18.9687 0.456357 18.5427 0.456357C17.9077 0.456357 17.6497 0.921948 17.6906 1.39162L17.9856 3.87885C13.8442 -1.07111 8.58872 -0.384973 5.4182 1.05264C2.13709 2.79248 0.0479887 6.14963 0.00292969 9.84576C0.00292969 10.3154 0.347017 10.6953 0.813992 10.6953Z" fill={`${theme === 'dark' ? '#BABECD' : 'black'}`} />
                                                </svg>

                                                {/* tooltips */}
                                                {/* <div className='group-hover:block hidden w-max h-max p-[0.4rem_0.8rem] shadow-lg bg-white dark:bg-[#262936] rounded-[5px] text-black dark:text-[#BABECD] absolute -bottom-[50px] z-50'>
                                                    Reload
                                                   sharp icons cons
                                                    <span className="absolute border-[9px] inner-block top-1/2 right-[99%] -translate-y-1/2 border-t-transparent border-b-transparent border-l-0 border-r-white shadow-2xl"></span>
                                                </div> */}
                                            </button>
                                        </div>
                                        {/* line */}
                                        <div className='w-full h-[1px] bg-[#d5dbdb] dark:bg-[#96a0a5cc]/40 my-[1rem]'></div>

                                        {/* track status */}
                                        <div className='w-full h-full'>
                                            <ul className='w-full h-full'>
                                                {
                                                    tracksStatus && tracksStatus.map((ele, index) => {
                                                        const { text, icons, id, status } = ele;

                                                        const lastLength = tracksStatus.length - 1;

                                                        return (
                                                            <li key={id} className={`w-full flex  justify-between xs:flex-row flex-col relative ${lastLength + 1 === id ? 'pb-0' : 'pb-[30px]'}`}>
                                                                {/* left side */}
                                                                <div className='flex items-center'>
                                                                    {/* icons */}
                                                                    <span className={`
                                                                    ${index < isActive ? `text-[#96a0a5]` : index === isActive ? 'text-green-500' : 'text-black dark:text-[#BABECD]'}`}>
                                                                        {icons && icons}
                                                                    </span>
                                                                    {/* dots */}
                                                                    <p className={`relative mx-[20px] w-[10px] h-[10px] rounded-full `}>
                                                                        {/* dots */}
                                                                        {/* bg-[#96a0a5] */}
                                                                        <span className="relative flex h-[10px] w-[10px]">
                                                                            {
                                                                                isActive + 1 === status &&
                                                                                <>
                                                                                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full transition-all duration-[1.5s] bg-green-400 opacity-75`}></span>
                                                                                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full transition-all duration-[1s] bg-green-300 opacity-75`}></span>
                                                                                </>
                                                                            }

                                                                            <span className={`relative inline-flex rounded-full h-[10px] w-[10px] ${index < isActive ? `bg-[#96a0a5]` : index === isActive ? 'bg-green-500' : 'bg-black dark:bg-[#BABECD]'}`}></span>
                                                                        </span>
                                                                        {/* line */}
                                                                        <span className={`${lastLength + 1 === id ? '' : `absolute left-[40%] xs:h-[26px] h-[44px] w-[2px] ${index < isActive ? `bg-[#96a0a5]` : index === isActive ? 'bg-green-500' : 'bg-black dark:bg-[#BABECD]'} top-0 mt-[20px]`}`}></span>
                                                                    </p>
                                                                    {/* text */}
                                                                    {/* leading-[12px] */}
                                                                    <p className={`md:text-[18px] text-[16px] ${index < isActive ? `text-[#96a0a5]` : index === isActive ? 'text-green-500 font-[600]' : 'text-black dark:text-[#BABECD]'}`}>{text}</p>
                                                                </div>
                                                                {/* time status */}
                                                                {
                                                                    index < isActive &&
                                                                    <span className='xs:pl-0 pl-[70px] xs:pt-0 pt-[5px] md:text-[14px] xs:text-[12px] text-[10px] font-[500] text-[#96a0a5] flex items-center'>
                                                                        {moment(data.order._updatedAt).format("llll")}
                                                                    </span>
                                                                }
                                                            </li>
                                                        )
                                                    })
                                                }
                                            </ul>
                                        </div>
                                    </div>
                                    {/* right side summary */}
                                    <div className='xl:w-1/2 w-full h-max p-[20px] bg-white dark:bg-[#262936] rounded-[10px]'>
                                        {/* heading */}
                                        <div className='w-ful flex items-center justify-between'>
                                            {/* left side logo images */}
                                            <div className='h-[100px] w-max'>
                                                <Image src='/logo.svg'
                                                    alt='logo' width={150}
                                                    height={100}
                                                    loading="lazy"
                                                    decoding="async"
                                                    quality={80}
                                                    importance="high"
                                                    rel="none"
                                                    className='w-full h-[100px] object-contain' />
                                            </div>
                                            {/* right side text */}
                                            <h1 className='md:text-[1.5rem] text-[1.3rem] text-right font-bold text-black dark:text-[#BABECD]'>Your Order Confirmed!</h1>
                                        </div>
                                        {/* line */}
                                        <div className='w-full h-[1px] bg-[#d5dbdb] dark:bg-[#96a0a5cc]/40 my-[1rem]'></div>
                                        {/* user contents */}
                                        <div className='w-full h-full flex md:flex-row flex-col gap-[20px] justify-between'>
                                            {/* order date */}
                                            <p className='md:w-max w-full flex-wrap flex md:flex-col flex-row md:justify-normal justify-between text-[12px] font-bold gap-[3px]'>
                                                <span className='text-[#96a0a5]'>Order Date :</span>
                                                <span className='text-black dark:text-[#BABECD]'>{moment(data.order._createdAt).format("ll")}</span>
                                            </p>
                                            {/* order date */}
                                            <p className='md:w-max w-full flex-wrap flex md:flex-col flex-row md:justify-normal justify-between text-[12px] font-bold gap-[3px]'>
                                                <span className='text-[#96a0a5]'>Order ID :</span>
                                                <span className='text-black dark:text-[#BABECD]'>{id}</span>
                                            </p>
                                            {/* order date */}
                                            <p className='md:w-max w-full flex-wrap flex md:flex-col flex-row md:justify-normal justify-between text-[12px] font-bold gap-[3px]'>
                                                <span className='text-[#96a0a5]'>Phone no. :</span>
                                                <span className='text-black dark:text-[#BABECD]'>09359872268</span>
                                            </p>
                                            {/* order date */}
                                            <p className='md:w-max w-full flex-wrap flex md:flex-col flex-row md:justify-normal justify-between text-[12px] font-bold gap-[3px]'>
                                                <span className='text-[#96a0a5]'>Shipping Address :</span>
                                                <span className='text-black dark:text-[#BABECD]'>
                                                    {data.order.address.length >= 30 ? `${data.order.address.slice(0, 30)}...` : data.order.address}
                                                </span>
                                            </p>
                                        </div>
                                        {/* line */}
                                        <div className='w-full h-[1px] bg-[#d5dbdb] dark:bg-[#96a0a5cc]/40 my-[1rem]'></div>
                                        {/* product details */}
                                        <div className='w-full h-full flex items-center gap-[20px]'>
                                            {/* images */}
                                            <div className='h-[60px] w-max'>
                                                <Image
                                                    src={data.product.image}
                                                    alt='logo'
                                                    width={100}
                                                    height={60}
                                                    loading="lazy"
                                                    decoding="async"
                                                    quality={50}
                                                    importance="high"
                                                    rel="none"
                                                    className='w-full h-[60px] object-contain' />
                                            </div>
                                            {/* right side prices */}
                                            <div className='w-full flex xs:items-center xs:flex-row flex-col justify-between gap-[8px]'>
                                                <div className='flex flex-col gap-[4px]'>
                                                    {/* product title */}
                                                    <h5 className='text-[1rem] font-bold text-black dark:text-[#BABECD]'>{data.product.name}</h5>
                                                    {/* qty */}
                                                    <p className='text-[#96a0a5] text-[0.8rem]'>Quantity: x{data.order.quantity}</p>
                                                </div>
                                                {/* price */}
                                                <h6 className='text-[0.9rem] font-bold text-black dark:text-[#BABECD]'>₹{new Intl.NumberFormat().format(data.product.price)}</h6>
                                            </div>
                                        </div>
                                        {/* line */}
                                        <div className='w-full h-[1px] bg-[#d5dbdb] dark:bg-[#96a0a5cc]/40 my-[1rem]'></div>
                                        {/* subtotals */}
                                        <div className='xs:w-[50%] mobile:w-[60%] w-full ml-auto text-[0.8rem]'>
                                            <div className='flex items-center flex-col gap-[10px]'>
                                                {/* payment mode */}
                                                <div className='w-full flex items-center justify-between'>
                                                    <span className='font-bold text-[#96a0a5]'>Payment Mode :</span>
                                                    {/* types */}
                                                    <span className={`font-bold text-black dark:text-[#BABECD] ${data.order.paymentType === 'cod' ? 'uppercase' : 'capitalize'} `}>{data.order.paymentType}</span>
                                                </div>
                                                {/* payment mode */}
                                                <div className='w-full flex items-center justify-between'>
                                                    <span className='font-bold text-[#96a0a5]'>Subtotal  :</span>
                                                    {/* types */}
                                                    <span className='font-bold text-black dark:text-[#BABECD]'>₹{new Intl.NumberFormat().format(data.order.subTotal)}</span>
                                                </div>
                                                {/* payment mode */}
                                                <div className='w-full flex items-center justify-between'>
                                                    <span className='font-bold text-[#96a0a5]'>Shipping Fees :</span>
                                                    {/* types */}
                                                    <span className='font-bold text-green-500'>FREE</span>
                                                </div>
                                            </div>
                                            {/* line */}
                                            <div className='w-full h-[1px] bg-[#d5dbdb] dark:bg-[#96a0a5cc]/40 my-[1rem]'></div>
                                            <div className='w-full flex items-center justify-between text-[0.8rem]'>
                                                <span className='text-black font-bold dark:text-[#BABECD]'>Total :</span>
                                                <span className='text-black font-bold dark:text-[#BABECD]'>₹{new Intl.NumberFormat().format(data.order.subTotal)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
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

export default Index