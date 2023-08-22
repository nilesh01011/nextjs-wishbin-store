/* eslint-disable no-undef */
'use client'

import CommonHead from '../components/CommonHead'
import Footer from '../components/Footer'
import Header from '../components/Header'
import OffersContainer from '../components/OffersContainer'
import ThemeChanged from '../components/ThemeChanged'
import { Router, useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import useSWR from 'swr';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { client } from '../sanity'
import { clearOrderItems } from '../slices/tempOrderSlice'
import { emptyCart } from '../slices/cartSlice'
import Loading from '../components/Loading'
// import { useSession } from 'next-auth/react'
import { addOrderItems } from '../slices/orderSlice'

// get unique identifier length of 6 for order ID
function generateShortUUID(length) {
    const uuid = uuidv4().replace(/-/g, ''); // Generate a standard UUID v4 and remove hyphens
    return uuid.substr(0, length); // Extract the desired number of characters
}

function SuccessPage() {

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

    const router = useRouter();
    // eslint-disable-next-line no-undef
    const params = new URLSearchParams(router.asPath.split(/\?/)[1]);
    const sessionId = params.get('session_id');

    useEffect(() => {
        if (!sessionId) {
            return router.push('/')
        }
    }, [sessionId])

    const dispatch = useDispatch();

    const setUser = useSelector((state) => state.user);
    // const [getUser, setUser] = useState([])

    // useEffect(() => {
    //     if (!User) {
    //         window.location.href = '/login';
    //         return router.push('/login');
    //     }

    //     if (User) {
    //         setUser(JSON.parse(User));
    //     }
    // }, [User])

    // const { data: session } = useSession();

    const { cartItems } = useSelector((state) => state.cart);
    const tempOrderItems = useSelector((state) => state.tempOrder);

    const [showSuccess, setShowSuccess] = useState(false);
    const [hideBalls, setHideBalls] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line no-undef
        setTimeout(() => {
            setShowSuccess(true);
        }, 500);

        // eslint-disable-next-line no-undef
        setTimeout(() => {
            setHideBalls(true);
        }, 850)
    }, [showSuccess])

    // create order with paymentType
    const createPaymentTypeOrders = async () => {
        try {

            // fetch user from Sanity.io
            const email = setUser.email;
            const userEmailQuery = `*[_type == 'user' && email == $email][0]`;
            const user = await client.fetch(userEmailQuery, { email });

            const orderItemRefs = [];

            for (const product of cartItems) {
                // Generate a unique ID for each order
                const uniqueID = generateShortUUID(12);
                // create a new orders object schema
                const response = await client.create({
                    _type: 'order',
                    user: {
                        _type: "reference",
                        _ref: user._id,
                    },
                    product: {
                        _type: "reference",
                        _ref: product._id, // product id
                    },
                    orderId: uniqueID,
                    quantity: product.quantity,
                    subTotal: product.oneQuantityPrice * product.quantity,
                    status: 'placed,1',
                    address: tempOrderItems.address.address,
                    city: tempOrderItems.address.city,
                    country: tempOrderItems.address.country,
                    zipCode: Number(tempOrderItems.address.zip_code),
                    paymentType: tempOrderItems.paymentType,
                });

                // add orders items
                dispatch(addOrderItems(response));

                // Add the reference to the order item to the array
                orderItemRefs.push({
                    _type: 'reference',
                    _ref: response._id,
                    _key: uniqueID
                });
            }
            // clear tempOrders
            dispatch(clearOrderItems());
            // empty cart
            return dispatch(emptyCart());

        } catch (error) {
            console.error('Creating order:', error);
        }
    }

    // eslint-disable-next-line no-unused-vars
    const { data, error } = useSWR(sessionId ? `/api/checkout-session/${sessionId}` : null,
        // eslint-disable-next-line no-undef
        async (url) => fetch(url ? url : null, {
            method: "GET",
            headers: {
                Authorization: "Bearer " + process.env.NEXT_PUBLIC_HEADER_KEY,
                "Content-Type": "application/json",
            },
        }).then(res => res.data),
        {
            async onSuccess() {
                createPaymentTypeOrders();
            }
        }
    )

    if (error) {
        // eslint-disable-next-line no-undef
        console.log('error to fetch data in /success?session_id', error);
    }

    return (
        <>
            <CommonHead title="Your Order Successful - WishBin Store | Online Shopping site in India" />

            {
                loading === true ? (
                    <Loading />
                ) : (
                    <>
                        <div className='w-full h-full'>
                            <Header sticky={true} navbar={false} />

                            <main className="max-w-[1366px] mx-auto w-full h-full xl:px-[3rem] md:px-[1.5rem] px-0 mt-[1rem] xs:mb-[6.5rem] mb-[7rem]">

                                <div className='w-full h-[400px] bg-white dark:bg-[#262936] p-[20px] flex items-center flex-col justify-center md:rounded-[20px]'>
                                    {/* title */}
                                    <h1 className='md:text-[1.8rem] text-[1.4rem] text-center text-black dark:text-[#BABECD]'>Your order has been received</h1>

                                    {/* contents */}
                                    <div className='mt-[2rem] mb-[1.8rem] flex items-center flex-col gap-[10px]'>
                                        {/* icons */}
                                        <p id="successIcons"
                                            className={`relative p-[10px] after:absolute after:content-[""] after:h-[68px] after:w-[68px] after:rounded-full before:absolute before:content-[""] before:h-[48px] before:w-[48px] before:rounded-full ${showSuccess === true ? 'active after:animate-ping after:bg-green-500 after:transition-all after:duration-[2s] after:opacity-75 before:animate-ping before:bg-green-400 before:transition-all before:duration-[3s] before:opacity-75' : ''}`}>
                                            <svg className='z-[10] shadow-[0_2px_4px_rgba(0,0,0,0.3)] rounded-full' width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <rect x="8" y="8" width="32" height="32" rx="16" fill="white" />
                                                <path d="M48 24C48 30.3652 45.4714 36.4697 40.9706 40.9706C36.4697 45.4714 30.3652 48 24 48C17.6348 48 11.5303 45.4714 7.02944 40.9706C2.52856 36.4697 0 30.3652 0 24C0 17.6348 2.52856 11.5303 7.02944 7.02944C11.5303 2.52856 17.6348 0 24 0C30.3652 0 36.4697 2.52856 40.9706 7.02944C45.4714 11.5303 48 17.6348 48 24ZM36.09 14.91C35.8757 14.6965 35.6206 14.5283 35.3398 14.4156C35.059 14.303 34.7584 14.2481 34.456 14.2542C34.1535 14.2604 33.8554 14.3275 33.5795 14.4515C33.3035 14.5755 33.0554 14.7539 32.85 14.976L22.431 28.251L16.152 21.969C15.7255 21.5716 15.1613 21.3552 14.5784 21.3655C13.9955 21.3758 13.4394 21.6119 13.0271 22.0241C12.6149 22.4364 12.3788 22.9925 12.3685 23.5754C12.3582 24.1583 12.5746 24.7225 12.972 25.149L20.91 33.09C21.1238 33.3035 21.3785 33.4717 21.6588 33.5846C21.939 33.6975 22.2391 33.7528 22.5412 33.7472C22.8433 33.7416 23.1412 33.6752 23.4171 33.552C23.693 33.4288 23.9412 33.2512 24.147 33.03L36.123 18.06C36.5313 17.6355 36.7568 17.0678 36.7512 16.4789C36.7456 15.8899 36.5093 15.3266 36.093 14.91H36.09Z" fill="#0F902C" />
                                            </svg>

                                            {/* small balls */}
                                            <span className={`absolute z-[5] ${showSuccess === true ? `${hideBalls === true ? 'hide' : ''} -top-[10px] left-[16%]` : 'top-[45%] left-[35%]'} transition-all duration-300 w-[10px] h-[10px] block rounded-full bg-yellow-500`}></span>
                                            <span className={`absolute z-[5] ${showSuccess === true ? `${hideBalls === true ? 'hide' : ''} top-[45%] -left-[14px]` : 'top-[45%] left-[45%]'} transition-all duration-300 w-[10px] h-[10px] block rounded-full bg-green-500`}></span>
                                            <span className={`absolute z-[5] ${showSuccess === true ? `${hideBalls === true ? 'hide' : ''} bottom-[9px] -right-[8px]` : 'bottom-[40%] right-[45%]'} w-[10px] transition-all duration-300 h-[10px] block rounded-full bg-orange-500`}></span>
                                            <span className={`absolute z-[5] ${showSuccess === true ? `${hideBalls === true ? 'hide' : ''} -bottom-[12px] left-[25%]` : 'bottom-[40%] left-[35%]'} w-[10px] transition-all duration-300 h-[10px] block rounded-full bg-red-500`}></span>
                                            <span className={`absolute z-[5] ${showSuccess === true ? `${hideBalls === true ? 'hide' : ''} -top-0 -right-[2px]` : 'top-[40%] right-[45%]'} transition-all duration-300 w-[10px] h-[10px] block rounded-full bg-sky-500`}></span>

                                        </p>
                                        {/* subtitle */}
                                        <h2 className='md:text-[1.2rem] text-[1rem] text-black dark:text-[#BABECD]'>Thank you for your purchase !</h2>
                                        {/* order id */}
                                        <div className='flex items-center gap-[5px] relative'>
                                            <button onClick={() => router.push('/orders')} type='button' role='button' aria-label='check-order-status' className='group text-[#96a0a5] flex items-center gap-[2px]'>
                                                Check your order status
                                                <svg className={`-rotate-90 dark:group-hover:text-[#BABECD] group-hover:text-black transition-all duration-300`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"></path><path fill="currentColor" d="M12 13.172l4.95-4.95 1.414 1.414L12 16 5.636 9.636 7.05 8.222z"></path></svg>
                                            </button>
                                        </div>
                                        {/* some text */}
                                        <p className='text-center text-[#96a0a5]'>You will received an order confirmation email with details of your order.</p>
                                    </div>

                                    {/* button */}
                                    <div className='w-full flex items-center justify-center'>
                                        <button onClick={() => router.push('/')} type='button' role='button' aria-label='continue-shopping' className="md:w-[340px] text-[16px] shadow-[0_2px_4px_rgba(0,0,0,0.3)] hover:shadow-none w-full h-[50px] bg-[#101219] hover:opacity-75 text-white dark:text-[#BABECD] flex items-center justify-center gap-[10px] p-[0.5rem_1.4rem] rounded-[6px] uppercase">continue shopping</button>
                                    </div>
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

export default SuccessPage