/* eslint-disable no-undef */
/* eslint-disable no-inner-declarations */
/* eslint-disable no-async-promise-executor */
/* eslint-disable react/no-unescaped-entities */
'use client'

import { Poppins } from 'next/font/google'
import CommonHead from '../components/CommonHead'
import Header from '../components/Header';
import Loading from '../components/Loading'
import ThemeChanged from '../components/ThemeChanged'
import { Router, useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { shippingAddressSchema } from '../formikSchema';
import { FaStripe } from 'react-icons/fa';
import { GiMoneyStack } from 'react-icons/gi';
import { HiOutlineLockClosed } from 'react-icons/hi';
const poppins = Poppins({ weight: ["400", "500", "600", "700", "800", "900"], subsets: ['latin'] });
import toast, { Toaster } from 'react-hot-toast';
// stripe payment method
// import { loadStripe } from '../stripe/stripe-js';
import { TiArrowBack } from 'react-icons/ti';
import { clearOrderItems, tempOrderItems } from '../slices/tempOrderSlice';
import LoadingButton from '../components/LoadingButton';
import { makePaymentRequest } from '../utils/paymentAPIRequest';
import CheckoutCart from '../components/CheckoutCart';
// import { useSession } from 'next-auth/react';
import { client } from '../sanity';
import { useQuery } from 'react-query';
import { loadStripe } from '@stripe/stripe-js';
import Image from 'next/image';
import Link from 'next/link';

const initialValues = {
    address: "",
    zip_code: "",
    city: "",
    country: ""
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const fetchData = async (userSession) => {
    try {
        if (!userSession) return null;

        const email = userSession ? userSession.email : null;
        // fetch user from Sanity.io
        const userEmailQuery = `*[_type == 'user' && email == $email][0]`;
        const user = await client.fetch(userEmailQuery, { email });

        if (!user) return null;

        return {
            ...user
        }

    } catch (error) {
        console.log('fetching user Data error :', error);
    }
}

function CheckoutSummaryPage() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const params = router.pathname;

    // const [loading, setLoading] = useState(false);

    Router.events.on("routeChangeStart", () => {
        console.log("Route is staring...")
        setLoading(true)
    })

    Router.events.on("routeChangeComplete", () => {
        console.log("Route is completed...")
        setLoading(false)
    })

    // Router.events.on("routeChangeStart", () => {
    //     console.log("Route is staring...")
    //     setLoading(true)
    // });

    // Router.events.on("routeChangeComplete", () => {
    //     console.log("Route is completed...")
    //     setLoading(false)
    // });

    // user exits in redux and cookies
    const setUser = useSelector((state) => state.user);
    // const { data: session } = useSession();
    // const User = Cookies.get('userInfo');
    // const [getUser, setUser] = useState([])

    // useEffect(() => {

    //     if (!User) {
    //         window.location.href = '/cart'
    //         return router.push('/cart');
    //     }

    //     if (User) {
    //         setUser(JSON.parse(User));
    //     }
    // }, [User])
    // const { data: session } = useSession();

    // useEffect(() => {
    //     if (!session) {
    //         window.location.href = '/login';
    //         return router.push('/login')
    //     }
    // }, [session])

    const { data, error } = useQuery('users-orders', () => fetchData(setUser), {
        enabled: setUser !== undefined,
    })

    if (error) {
        console.log("Error for fetching user data :", error);
    }

    // checkout cart
    const { cartItems } = useSelector((state) => state.cart);
    // const { checkoutCartItems } = useSelector((state) => state.checkoutCartItems);

    // useEffect(() => {
    //     if (checkoutCartItems?.length < 1) {
    //         window.location.href = '/cart'
    //         return router.push('/cart')
    //     }
    // }, [checkoutCartItems])

    // useEffect(() => {
    //     if (cartItems?.length < 1) {
    //         // window.location.href = '/cart'
    //         return router.push('/cart')
    //     }
    // }, [cartItems])

    const subTotal = useMemo(() => {
        return cartItems.reduce(
            (total, val) => total + val.price,
            0
        );
    }, [cartItems]);

    const dispatch = useDispatch();

    useEffect(() => {
        if (params === '/checkout-summary/?canceled=true') {
            dispatch(clearOrderItems())
        }
    }, [])

    // useEffect(() => {
    //     if (!User) {
    //         window.location.href = '/cart'
    //         return router.push('/cart')
    //     }
    // }, [User])


    // payment type active
    const [isPaymentType, setIsPaymentType] = useState('cod');

    // set loading state
    const [isLoading, setIsLoading] = useState(false)

    // useFormik
    const { values, errors, touched, handleBlur, handleChange, handleSubmit } = useFormik({
        validationSchema: shippingAddressSchema,
        initialValues: initialValues,
        onSubmit: async (values) => {
            setIsLoading(true)
            // ========================= stripe checkout ================================
            if (isPaymentType === 'stripe') {
                // handleStripePayment()
                const stripe = await stripePromise;
                const res = await makePaymentRequest("https://wishbin-store.vercel.app/api/stripe", {
                    products: cartItems
                });

                toast.loading("Redirecting Please wait...");

                dispatch(
                    tempOrderItems({
                        address: values, products: cartItems, paymentType: isPaymentType
                    })
                );

                setTimeout(async () => {
                    await stripe.redirectToCheckout({
                        sessionId: res.id,
                    });

                    setIsLoading(false)
                }, 2000)
            }
            // ====================== cash on delivery ===========================
            if (isPaymentType === 'cod') {

                function redirectToCheckout() {
                    return new Promise(async (resolve, reject) => {
                        try {
                            const response = setTimeout(async () => {
                                const res = await makePaymentRequest("https://wishbin-store.vercel.app/api/cod", {
                                    address: values, products: cartItems, paymentType: isPaymentType
                                });
                                // eslint-disable-next-line no-undef
                                console.log(res)
                                // order create after checkout
                                dispatch(
                                    tempOrderItems({
                                        ...res
                                    })
                                );
                                setIsLoading(false)
                                return router.push(`/success?session_id=${data._id}`);
                            }, 1000)

                            resolve(response);
                        } catch (error) {
                            // If there was an error during the save operation, reject the promise with the error
                            reject(error);
                        }
                    });
                }

                toast.promise(
                    redirectToCheckout(),
                    {
                        loading: 'Redirecting Please wait...',
                        success: 'Successfully your orders',
                        error: 'Opps something went wrong to redirect.',
                    }
                );
            }
            // action.resetForm();
        },
    });

    return (
        <>

            <CommonHead title="Checkout Summary to WishBin | Online Shopping site in India" />

            {
                loading === true ? (
                    <Loading />

                ) : (
                    <>
                        <div className='fixed top-0 z-[99999]'>
                            <Toaster position="top-center"
                                reverseOrder={false}
                            />
                        </div>

                        <div className='w-full h-full'>
                            <Header sticky={false} navbar={false} />

                            <div className={poppins.className}>
                                <main className={`max-w-[1366px] mx-auto w-full h-full xl:px-[3rem] xs:px-[1.5rem] px-[1rem]`} style={{ fontFamily: "'Poppins', sans-serif" }}>
                                    <div className='w-full flex md:items-center md:justify-center md:flex-row flex-col gap-[20px] relative my-[20px]'>
                                        <button type='button' role='button' onClick={() => router.push('/cart')} className='md:absolute md:left-0 w-max h-[40px] px-[2rem] rounded-[5px] border-[1px] border-[#101219] dark:border-[#BABECD] hover:bg-black dark:hover:bg-[#BABECD] hover:text-white dark:hover:text-black dark:text-[#BABECD] flex items-center justify-center gap-[5px] shadow-[0_2px_4px_rgba(0,0,0,0.3)] hover:shadow-none'>
                                            <TiArrowBack size={18} />
                                            Cancel
                                        </button>
                                        {/* title */}
                                        <h1 className={`uppercase font-black md:text-[2rem] text-[1.5rem] text-center dark:text-[#BABECD] text-black`} style={{ fontFamily: "'Poppins', sans-serif" }}>checkout</h1>
                                    </div>

                                    {/* contents */}
                                    <form method='post' onSubmit={handleSubmit} className='w-full h-full flex slg:flex-row flex-col items-start gap-[20px] mb-[20px]'>
                                        {/* left side */}
                                        <div className='h-full lg:w-[70%] slg:w-[60%] w-full bg-white dark:bg-[#262936] flex items-center flex-col gap-[30px] rounded-[10px] p-[20px]'>
                                            {/* personal details */}
                                            <div className='w-full h-max flex lg:flex-row flex-col justify-between'>
                                                {/* left side heading */}
                                                <div className='lg:w-[30%] w-full h-max'>
                                                    <span className='text-[14px] text-[#96a0a5] font-semibold'>01</span>
                                                    <h1 className='dark:text-[#BABECD] text-black font-black uppercase text-[16px]' style={{ fontFamily: "'Poppins', sans-serif" }}>personal details</h1>
                                                </div>
                                                {/* right side contents */}
                                                <div className='lg:w-[70%] w-full h-full'>
                                                    {/* username */}
                                                    <div className='w-full h-max'>
                                                        <label className="text-[0.75rem] m-[0_0_0_7px] p-[0_3px] text-black dark:text-[#96a0a5] bg-white dark:bg-[#262936] w-fit relative top-[0.7rem] left-[0.1rem]">Username</label>
                                                        {/* inputs */}
                                                        <input type='text'
                                                            name='username'
                                                            disabled
                                                            defaultValue={data && data.username}
                                                            // value={session ? session?.user?.username : null}
                                                            className={`w-full h-[50px] p-[8px_10px] rounded-[5px] border-[1px] border-[#d4d5d9] dark:border-[#96a0a5] focus:border-black dark:focus:border-[#BABECD] text-black/60 dark:text-[#BABECD]/75 capitalize cursor-not-allowed`} placeholder='Your name' autoComplete='off' />
                                                    </div>
                                                    {/* email and mobile number */}
                                                    <div className='w-full h-max flex items-center lg:flex-row flex-col lg:gap-[20px]'>
                                                        {/* email id */}
                                                        <div className='w-full h-max'>
                                                            <label className="text-[0.75rem] m-[0_0_0_7px] p-[0_3px] text-black dark:text-[#96a0a5] bg-white dark:bg-[#262936] w-fit relative top-[0.7rem] left-[0.1rem]">Email address</label>
                                                            {/* inputs */}
                                                            <input type='email'
                                                                name='email'
                                                                disabled
                                                                // value={session ? session?.user?.email : null}
                                                                defaultValue={data && data.email}
                                                                className={`w-full h-[50px] p-[8px_10px] rounded-[5px] border-[1px] border-[#d4d5d9] dark:border-[#96a0a5] focus:border-black dark:focus:border-[#BABECD] text-black/60 dark:text-[#BABECD]/75 cursor-not-allowed`} placeholder='Email address' autoComplete='off' />
                                                        </div>
                                                        {/* mobile number */}
                                                        <div className='w-full h-max'>
                                                            <label className="text-[0.75rem] m-[0_0_0_7px] p-[0_3px] text-black dark:text-[#96a0a5] bg-white dark:bg-[#262936] w-fit relative top-[0.7rem] left-[0.1rem]">Phone number</label>
                                                            {/* inputs */}
                                                            <input type='tel'
                                                                name='mobile_number'
                                                                disabled
                                                                defaultValue={data && data.mobile_number}
                                                                // value={session ? user?.mobile_number : null}
                                                                className={`w-full h-[50px] p-[8px_10px] rounded-[5px] border-[1px] border-[#d4d5d9] dark:border-[#96a0a5] focus:border-black dark:focus:border-[#BABECD] text-black/60 dark:text-[#BABECD]/75 cursor-not-allowed`} placeholder='Phone number' autoComplete='off' />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* shipping address */}
                                            <div className='w-full h-max flex lg:flex-row flex-col justify-between'>
                                                {/* left side heading */}
                                                <div className='lg:w-[30%] w-full h-max'>
                                                    <span className='text-[14px] text-[#96a0a5] font-semibold'>02</span>
                                                    <h1 className='dark:text-[#BABECD] text-black font-black uppercase text-[16px]' style={{ fontFamily: "'Poppins', sans-serif" }}>shipping address</h1>
                                                </div>
                                                {/* right side contents */}
                                                <div className='lg:w-[70%] w-full h-full'>
                                                    {/* address */}
                                                    <div className='w-full h-max'>
                                                        <label className="text-[0.75rem] m-[0_0_0_7px] p-[0_3px] text-black dark:text-[#96a0a5] bg-white dark:bg-[#262936] w-fit relative top-[0.7rem] left-[0.1rem]">Street address<span className='text-[#ea5455]'>*</span></label>
                                                        {/* inputs */}
                                                        <input
                                                            type='text'
                                                            name='address'
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            value={values.address}
                                                            disabled={cartItems.length < 1}
                                                            className={`w-full h-[50px] p-[8px_10px] text-black dark:text-[#BABECD] ${cartItems.length < 1 && 'cursor-not-allowed'} placeholder:text-[#96a0a5] ${errors.address && touched.address ? 'border-[#ea5455] dark:border-[#ea5455] errorsAddress' : 'border-[lightgray]'} rounded-[5px] border-[1px] border-[#d4d5d9] dark:border-[#96a0a5] bg-transparent focus:border-black dark:focus:border-[#BABECD] capitalize`} placeholder='Street address' autoComplete='off' />
                                                        {/* error */}
                                                        {
                                                            errors.address && touched.address ?
                                                                <p className='text-[12px] text-[#ea5455] flex mt-[8px]'>{errors.address}</p>
                                                                : null
                                                        }
                                                    </div>
                                                    {/* zip code | city | country */}
                                                    <div className='w-full h-max flex lg:flex-row flex-col lg:gap-[20px]'>
                                                        {/* zip code */}
                                                        <div className='w-full h-max'>
                                                            <label className="text-[0.75rem] m-[0_0_0_7px] p-[0_3px] text-black dark:text-[#96a0a5] bg-white dark:bg-[#262936] w-fit relative top-[0.7rem] left-[0.1rem]">Zip code<span className='text-[#ea5455]'>*</span></label>
                                                            {/* inputs */}
                                                            <input
                                                                type='tel'
                                                                maxLength={6}
                                                                name='zip_code'
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                disabled={cartItems.length < 1}
                                                                value={values.zip_code}
                                                                className={`w-full h-[50px] p-[8px_10px] placeholder:text-[#96a0a5] ${cartItems.length < 1 && 'cursor-not-allowed'} ${errors.zip_code && touched.zip_code ? 'border-[#ea5455] dark:border-[#ea5455] errorZipCode' : 'border-[lightgray]'} rounded-[5px] border-[1px] border-[#d4d5d9] dark:border-[#96a0a5] bg-transparent focus:border-black dark:focus:border-[#BABECD] text-black dark:text-[#BABECD]`} placeholder='Zip code' autoComplete='off' />
                                                            {/* error */}
                                                            {
                                                                errors.zip_code && touched.zip_code ?
                                                                    <p className='text-[12px] text-[#ea5455] flex mt-[8px]'>{errors.zip_code}</p>
                                                                    : null
                                                            }
                                                        </div>
                                                        {/* city */}
                                                        <div className='w-full h-max'>
                                                            <label className="text-[0.75rem] m-[0_0_0_7px] p-[0_3px] text-black dark:text-[#96a0a5] bg-white dark:bg-[#262936] w-fit relative top-[0.7rem] left-[0.1rem]">City<span className='text-[#ea5455]'>*</span></label>
                                                            {/* inputs */}
                                                            <input type='text' name='city' disabled={cartItems.length < 1} onChange={handleChange} onBlur={handleBlur} value={values.city} className={`w-full h-[50px] p-[8px_10px] capitalize ${cartItems.length < 1 && 'cursor-not-allowed'} ${errors.city && touched.city ? 'border-[#ea5455] dark:border-[#ea5455] errorCity' : 'border-[lightgray]'} rounded-[5px] border-[1px] border-[#d4d5d9] dark:border-[#96a0a5] bg-transparent focus:border-black dark:focus:border-[#BABECD] text-black dark:text-[#BABECD] placeholder:text-[#96a0a5]`} placeholder='Your city name' autoComplete='off' />
                                                            {/* error */}
                                                            {
                                                                errors.city && touched.city ?
                                                                    <p className='text-[12px] text-[#ea5455] flex mt-[8px]'>{errors.city}</p>
                                                                    : null
                                                            }
                                                        </div>
                                                        {/* country */}
                                                        <div className='w-full h-max'>
                                                            <label className="text-[0.75rem] m-[0_0_0_7px] p-[0_3px] text-black dark:text-[#96a0a5] bg-white dark:bg-[#262936] w-fit relative top-[0.7rem] left-[0.1rem]">country<span className='text-[#ea5455]'>*</span></label>
                                                            {/* inputs */}
                                                            <input type='text' name='country' disabled={cartItems.length < 1} onChange={handleChange} onBlur={handleBlur} value={values.country} className={`w-full h-[50px] p-[8px_10px] capitalize ${cartItems.length < 1 && 'cursor-not-allowed'} ${errors.country && touched.country ? 'border-[#ea5455] dark:border-[#ea5455] errorCountry' : 'border-[lightgray]'} rounded-[5px] border-[1px] border-[#d4d5d9] dark:border-[#96a0a5] bg-transparent focus:border-black dark:focus:border-[#BABECD] text-black dark:text-[#BABECD]`} placeholder='Your country name' autoComplete='off' />
                                                            {/* error */}
                                                            {
                                                                errors.country && touched.country ?
                                                                    <p className='text-[12px] text-[#ea5455] flex mt-[8px]'>{errors.country}</p>
                                                                    : null
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* payment method */}
                                            <div className='w-full h-max flex lg:flex-row flex-col justify-between'>
                                                {/* left side heading */}
                                                <div className='lg:w-[30%] w-full h-max'>
                                                    <span className='text-[14px] text-[#96a0a5] font-semibold'>03</span>
                                                    <h1 className='dark:text-[#BABECD] text-black font-black uppercase text-[16px]' style={{ fontFamily: "'Poppins', sans-serif" }}>payment method</h1>
                                                </div>
                                                {/* right side contents */}
                                                <div className='lg:w-[70%] w-full h-full flex gap-[20px] flex-col'>
                                                    <div className='flex xl:flex-row flex-col xl:gap-[20px] w-full h-full'>
                                                        {/* cash types */}
                                                        <div className='w-full h-[79px] flex items-end'>
                                                            <div onClick={() => setIsPaymentType('cod')} className={`h-[50px] w-full p-[8px_10px] rounded-[5px] border-[1px] ${isPaymentType === 'cod' ? 'border-black dark:border-[#BABECD] bg-black/5 dark:bg-black/30' : 'border-[#d4d5d9] dark:border-[#96a0a5] bg-transparent'} flex items-center justify-between cursor-pointer`}>
                                                                {/* left */}
                                                                <div className='flex items-center gap-[10px]'>
                                                                    {/* icons */}
                                                                    <span>
                                                                        <GiMoneyStack size={36} className={`${isPaymentType === 'cod' ? 'text-green-400' : 'text-[#96a0a5]'}`} />
                                                                    </span>
                                                                    {/* text */}
                                                                    <h6 className={`font-black ${isPaymentType === 'cod' ? 'text-black dark:text-[#BABECD]' : 'text-[#96a0a5]'} select-none`}>Cash on delivery</h6>
                                                                </div>
                                                                {/* right */}
                                                                <div className='w-auto'>
                                                                    <div className={`w-[18px] h-[18px] rounded-full border-[1px] flex items-center justify-center ${isPaymentType === 'cod' ? 'border-black dark:border-[#BABECD]' : 'border-[#d4d5d9] dark:border-[#96a0a5]'}`}>
                                                                        {isPaymentType === 'cod' &&
                                                                            <span className='w-[9px] h-[9px] rounded-full bg-black dark:bg-[#BABECD]'></span>
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* stripe types */}
                                                        <div className='w-full h-[79px] flex items-end'>
                                                            <div onClick={() => setIsPaymentType('stripe')} className={`h-[50px] w-full p-[8px_10px] rounded-[5px] border-[1px] ${isPaymentType === 'stripe' ? 'border-black dark:border-[#BABECD] bg-black/5 dark:bg-black/30' : 'border-[#d4d5d9] dark:border-[#96a0a5] bg-transparent'} flex items-center justify-between cursor-pointer`}>
                                                                {/* left */}
                                                                <div className='flex items-center gap-[10px]'>
                                                                    {/* icons */}
                                                                    <span>
                                                                        <FaStripe size={34} className={`${isPaymentType === 'stripe' ? 'text-[#635BFF]' : 'text-[#96a0a5]'}`} />
                                                                    </span>
                                                                    {/* text */}
                                                                    <h6 className={`font-black ${isPaymentType === 'stripe' ? 'text-black dark:text-[#BABECD]' : 'text-[#96a0a5]'} select-none`}>Stripe</h6>
                                                                </div>
                                                                {/* right */}
                                                                <div className='w-auto'>
                                                                    <div className={`w-[18px] h-[18px] rounded-full border-[1px] flex items-center justify-center ${isPaymentType === 'stripe' ? 'border-black dark:border-[#BABECD]' : 'border-[#d4d5d9] dark:border-[#96a0a5]'}`}>
                                                                        {isPaymentType === 'stripe' &&
                                                                            <span className='w-[9px] h-[9px] rounded-full bg-black dark:bg-[#BABECD]'></span>
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* summary */}
                                                    <p className='w-full text-[14px] text-[#96a0a5] flex items-center gap-[5px]'>
                                                        <span>
                                                            {
                                                                isPaymentType === 'cod' &&
                                                                <HiOutlineLockClosed size={14} />
                                                            }

                                                            {
                                                                isPaymentType === 'stripe' &&
                                                                <HiOutlineLockClosed size={14} />
                                                            }
                                                        </span>
                                                        {
                                                            isPaymentType === 'cod' &&
                                                            'Pay Cash on Delivery, UPI accepted.'
                                                        }

                                                        {
                                                            isPaymentType === 'stripe' &&
                                                            'Stripe transaction is secured with SSL encryption.'
                                                        }

                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        {/* right side */}
                                        <div className='h-max lg:w-[30%] slg:w-[40%] w-full bg-white dark:bg-[#262936] rounded-[10px] p-[20px] md:sticky md:top-0'>
                                            {/* title */}
                                            <h1 className='dark:text-[#BABECD] text-black font-black uppercase text-[18px]' style={{ fontFamily: "'Poppins', sans-serif" }}>order summary</h1>
                                            {/* line */}
                                            <div className='w-full h-[1px] bg-[#d5dbdb] dark:bg-[#353740] my-[1rem]'></div>
                                            {/* product cardsItems */}
                                            {
                                                cartItems.length > 0 &&
                                                <div id='overflowScroll' className={`w-full ${cartItems.length > 2 ? 'slg:h-[190px] h-full' : 'h-full'} flex flex-col gap-[20px] overflow-scroll`}>
                                                    {
                                                        cartItems.map((ele) => {
                                                            return (
                                                                <CheckoutCart key={ele._id} product={ele} />
                                                            )
                                                        })
                                                    }
                                                </div>
                                            }
                                            {/* cartItems empty */}
                                            {
                                                cartItems && cartItems.length < 1 &&
                                                <>
                                                    <div className='w-full flex items-center justify-center flex-col'>
                                                        {/* images */}
                                                        <Image src='/ErrorImages.png' width={160} height={100} alt='empty-cartItems' className='w-[160px] h-[100px] object-contain' />
                                                        {/* text */}
                                                        <p className='dark:text-[#BABECD] text-black text-md'>Your cart items is empty..!</p>
                                                        {/* links */}
                                                        <Link href="/cart" className="mt-[10px] w-max h-max p-[0.6rem_1.6rem] bg-[#101219] hover:opacity-80 text-white dark:text-[#BABECD] rounded-[5px] flex items-center justify-center gap-[6px]">
                                                            <span>
                                                                <TiArrowBack size={16} />
                                                            </span>
                                                            Back to cart
                                                        </Link>
                                                    </div>
                                                </>
                                            }
                                            {/* line */}
                                            <div className='w-full h-[1px] bg-[#d5dbdb] dark:bg-[#353740] my-[1rem]'></div>
                                            {/* subtotal, shipping price and total */}
                                            <div className='w-full flex flex-col gap-[10px]'>
                                                {/* subtotal */}
                                                <div className='w-full flex items-center justify-between'>
                                                    {/* text */}
                                                    <p className='capitalize text-[#96a0a5]'>subtotal</p>
                                                    {/* total */}
                                                    <p className='font-semibold text-black dark:text-[#BABECD]'>₹{new Intl.NumberFormat().format(subTotal)}</p>
                                                </div>
                                                {/* shipping cost */}
                                                <div className='w-full flex items-center justify-between'>
                                                    {/* text */}
                                                    <p className='capitalize text-[#96a0a5]'>shipping cost</p>
                                                    {/* total */}
                                                    <p className='font-semibold text-green-500'>FREE</p>
                                                </div>

                                                {/* Total */}
                                                <div className='w-full flex items-center justify-between'>
                                                    {/* text */}
                                                    <p className='capitalize text-[#96a0a5]'>Total</p>
                                                    {/* total */}
                                                    <p className='font-semibold text-black dark:text-[#BABECD]'>₹{new Intl.NumberFormat().format(subTotal)}</p>
                                                </div>
                                            </div>

                                            {/* checkout button */}
                                            <div className='slg:static fixed bottom-0 left-0 right-0 slg:p-0 xs:p-[12px_24px] p-[12px_16px] slg:bg-none bg-white dark:bg-[#262936] slg:shadow-none shadow-[0_0_50px_2px_rgba(0,0,0,0.1)]'>
                                                <button
                                                    type='submit'
                                                    role='button'
                                                    aria-label='checkout'
                                                    disabled={values.address === '' || values.zip_code === '' || values.city === '' || values.country === '' || isLoading === true}
                                                    className={`w-full text-[15px] slg:mt-[1.2rem] my-[0.7rem] flex items-center justify-center gap-[10px] shadow-[0_2px_4px_rgba(0,0,0,0.3)] hover:shadow-none uppercase h-[50px] ${values.address === '' || values.zip_code === '' || values.city === '' || values.country === '' ? 'opacity-75 cursor-wait' : 'hover:opacity-75'} bg-[#101219] text-white dark:text-[#BABECD] flex items-center justify-center gap-[7px] p-[0.5rem_1rem] rounded-[6px]`}>

                                                    {
                                                        isLoading === true ? (
                                                            <>
                                                                <LoadingButton />
                                                                Loading...
                                                            </>
                                                        ) : (
                                                            cartItems.length < 1 ? 'no cart items found...!' : values.address === '' ? 'address is required' : values.zip_code === '' ? 'Zip Code is required' : values.city === '' ? 'city is required' : values.country === '' ? 'country is required' : 'proceed to pay'
                                                        )
                                                    }
                                                </button>
                                            </div>
                                        </div>
                                    </form>

                                    {/* summary */}
                                    <p className='text-[12px] slg:mb-[20px] mb-[110px] text-[#96a0a5]'>When your order is placed, we'll send you an e-mail message acknowledging of your order. If you choose to pay using an Stripe payment method (credit card or debit card) you will be directed to Stripe payment gateway website to complete your payment. Your contract to purchase an product will not be complete until we received your Stripe payment and dispatch your product. If you choose to pay Cash on Delivery (COD), you can pay using cash, UPI when you receive your product.</p>
                                </main>
                            </div>
                        </div>
                        {/* theme changed */}
                        <ThemeChanged bottomUpper='slg:bottom-[40px] bottom-[115px]' />
                    </>
                )
            }
        </>
    )
}

export default CheckoutSummaryPage