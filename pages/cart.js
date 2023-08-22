/* eslint-disable no-async-promise-executor */
/* eslint-disable no-undef */
"use client"

import CartItems from '../components/CartItems'
import CommonHead from '../components/CommonHead'
import Footer from '../components/Footer'
import Header from '../components/Header'
import ThemeChanged from '../components/ThemeChanged'
// import { client } from '../sanity'
// import product from '../sanity/schema/product'
// import { emptyCart } from '../slices/cartSlice'
// import Cookies from 'js-cookie'
import Image from 'next/image'
import Link from 'next/link'
import { Router, useRouter } from 'next/router'
import React, { useEffect, useMemo, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import { useSelector } from 'react-redux'
import { BsCartPlusFill } from 'react-icons/bs'
import Loading from '../components/Loading'
// import { useSession } from 'next-auth/react'

function CartPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    Router.events.on("routeChangeStart", () => {
        console.log("Route is staring...")
        setLoading(true)
    })

    Router.events.on("routeChangeComplete", () => {
        console.log("Route is completed...")
        setLoading(false)
    })

    const { cartItems } = useSelector((state) => state.cart);

    const subTotal = useMemo(() => {
        return cartItems.reduce(
            (total, val) => total + val.price,
            0
        );
    }, [cartItems]);

    // add to cart functionality to user account
    // const dispatch = useDispatch();
    const setUser = useSelector((state) => state.user);
    // const User = Cookies.get('userInfo');
    // const [getUser, setUser] = useState([])

    // useEffect(() => {
    //     if (User) {
    //         setUser(JSON.parse(User));
    //     }
    // }, [User])

    // const { data: session } = useSession();

    // add to checkout cart 

    const handleProceedItems = () => {

        function redirectToCheckout() {
            return new Promise(async (resolve, reject) => {
                try {
                    const checkoutCart = setTimeout(async () => {

                        router.push('/checkout-summary');

                    }, 1000)

                    resolve(checkoutCart);
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
                success: 'Success you will redirect to checkout',
                error: 'Opps something went wrong to redirect.',
            }
        );

    }

    // handle text changed button
    // const handleCartButton = () => {

    //     if (!setUser && cartItems.length > 0) {
    //         return <Link
    //             href='/login'
    //             title="Click to visit the Login page"
    //             className={`w-full text-[16px] shadow-[0_2px_4px_rgba(0,0,0,0.3)] hover:shadow-none h-[50px] bg-[#101219] hover:opacity-75 text-white dark:text-[#BABECD] flex items-center justify-center gap-[7px] p-[0.5rem_1rem] rounded-[6px]`}>
    //             {/* <FaUserSlash size={18} /> */}
    //             Login to proceed
    //         </Link>
    //     } else if (setUser && cartItems.length < 1) {
    //         return <Link href='/cart' title="Click to visit the Cart page" className={`w-full text-[16px] cursor-not-allowed shadow-[0_2px_4px_rgba(0,0,0,0.3)] h-[50px] bg-[#101219] opacity-75 text-white dark:text-[#BABECD] flex items-center justify-center gap-[7px] p-[0.5rem_1rem] rounded-[6px]`}>
    //             {/* <BsCartXFill size={18} /> */}
    //             Add some items
    //         </Link>
    //     } else if (setUser && cartItems.length > 0) {
    //         // paymentOrder
    //         return <Link href='/checkout-summary' title="Click to visit the Checkout page" onClick={handleProceedItems} className={`w-full text-[16px] shadow-[0_2px_4px_rgba(0,0,0,0.3)] h-[50px] bg-[#101219] hover:opacity-75 text-white dark:text-[#BABECD] flex items-center justify-center gap-[7px] p-[0.5rem_1rem] rounded-[6px]`}>
    //             {/* <FaStripeS size={18} /> */}
    //             Proceed to checkout
    //             {/* <GrSecure size={14} /> */}
    //         </Link>
    //     }
    //     else {
    //         return <Link href='/cart' title="Click to visit the Cart page" disabled className={`w-full text-[16px] cursor-not-allowed shadow-[0_2px_4px_rgba(0,0,0,0.3)] h-[50px] bg-[#101219] opacity-75 text-white dark:text-[#BABECD] flex items-center justify-center gap-[7px] p-[0.5rem_1rem] rounded-[6px]`}>
    //             {/* <BsCartXFill size={18} /> */}
    //             Add some items
    //         </Link>
    //     }
    // }

    const handleCartButton = () => {

        if (!setUser && cartItems.length > 0) {
            return (
                <Link
                    href="/login"
                    title="Click to visit the Login page"
                    className={`w-full text-[16px] shadow-[0_2px_4px_rgba(0,0,0,0.3)] hover:shadow-none h-[50px] bg-[#101219] hover:opacity-75 text-white dark:text-[#BABECD] flex items-center justify-center gap-[7px] p-[0.5rem_1rem] rounded-[6px]`}
                >
                    {/* <FaUserSlash size={18} /> */}
                    Login to proceed
                </Link>
            )
        }

        if (setUser && cartItems.length < 1) {
            return (
                <Link
                    href="/cart"
                    title="Click to visit the Cart page"
                    className="bg-gray-800 opacity-75 text-white px-4 py-2 rounded-md flex items-center gap-2 cursor-not-allowed"
                >
                    {/* <BsCartXFill size={18} /> */}
                    Add some items
                </Link>
            )
        }

        if (setUser && cartItems.length > 0) {
            return (
                <Link
                    href="/checkout-summary"
                    title="Click to visit the Checkout page"
                    onClick={handleProceedItems}
                    className={`w-full text-[16px] cursor-not-allowed shadow-[0_2px_4px_rgba(0,0,0,0.3)] h-[50px] bg-[#101219] opacity-75 text-white dark:text-[#BABECD] flex items-center justify-center gap-[7px] p-[0.5rem_1rem] rounded-[6px]`}
                >
                    Proceed to checkout
                </Link>
            )
        }

        return (
            <Link
                href="/cart"
                title="Click to visit the Cart page"
                disabled
                className={`w-full text-[16px] cursor-not-allowed shadow-[0_2px_4px_rgba(0,0,0,0.3)] h-[50px] bg-[#101219] opacity-75 text-white dark:text-[#BABECD] flex items-center justify-center gap-[7px] p-[0.5rem_1rem] rounded-[6px]`}
            >
                {/* <BsCartXFill size={18} /> */}
                Add some items
            </Link>
        )
    }

    useEffect(() => {
        handleCartButton();
    }, [setUser, cartItems])

    // empty cart button
    const handleGoHomeButton = () => {
        return router.push('/')
    }

    return (
        <>
            <CommonHead title="Shopping Cart - WishBin | Online Shopping site in India" />

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
                            <Header navbar={false} sticky={false} />

                            <main className="max-w-[1366px] mx-auto w-full h-full xl:px-[3rem] md:px-[1.5rem] px-0 xl:mb-[6.7rem] md:mb-[6.4rem] xs:mb-[6rem] mb-[7.2rem] mt-[20px]">
                                <div className='w-full flex slg:flex-row flex-col gap-[20px]'>
                                    {/* left side */}
                                    {/* md:order-1 order-2 */}
                                    <div className='h-full xl:w-[73%] slg:w-[65%] w-full bg-white dark:bg-[#262936] md:rounded-[10px] p-[20px]'>
                                        {/* title */}
                                        <h3 className='text-[1.5rem] font-black text-black dark:text-[#BABECD]'>Your Shopping Cart</h3>
                                        {/* line */}
                                        <div className='w-full h-[1px] bg-[#d5dbdb] dark:bg-[#96a0a5cc]/40 my-[1rem]'></div>

                                        {/* cartItems list */}
                                        {
                                            cartItems && cartItems.length > 0 && (
                                                <div className='w-full h-auto flex flex-col divide-y-[1px] divide-[#d5d5d5] dark:divide-[#353740]'>
                                                    {/* cartItems list */}
                                                    {/* cartItems.length > 1 ? `py-[20px] ${cartItems[0] && 'pt-0'}` : 'pt-[20px] pb-0' */}
                                                    {cartItems.map((item, index) => (
                                                        <div key={item._id} className={`py-[20px] ${index === 0 && 'pt-0'} ${index === cartItems.length - 1 && 'pb-0'}`}>
                                                            <CartItems key={item._id} product={item} />
                                                        </div>
                                                    ))}
                                                </div>
                                            )
                                        }

                                        {/* empty cart */}
                                        {
                                            cartItems && cartItems.length < 1 && (
                                                <div className='w-full h-full'>
                                                    {/* images */}
                                                    <Image src='/emptyCart.png' alt='empty-cart' width={420} height={300} className='w-full xs:h-[300px] h-[200px] object-contain' />
                                                    {/* contents */}
                                                    <div className='xs:mt-[3rem] mt-[2rem] flex items-center justify-center flex-col'>
                                                        <h1 className='xs:text-[2rem] text-[24px] font-[500] text-black dark:text-[#BABECD]'>Your Cart is empty</h1>
                                                        <p className='text-[#96a0a5] mt-[0.4rem] xs:mb-[1rem] mb-[0.7rem] xs:text-[1.10rem] mobile:text-[15px] text-[14px]'>Buy some product as per your choice</p>
                                                        {/* button */}
                                                        <button onClick={() => handleGoHomeButton()} type='button' role='button' aria-label='continue-shopping' className='md:w-[340px] text-[18px] shadow-[0_2px_4px_rgba(0,0,0,0.3)] hover:shadow-none w-full h-[50px] bg-[#101219] hover:opacity-75 text-white dark:text-[#BABECD] flex items-center justify-center gap-[10px] p-[0.5rem_1.4rem] rounded-[6px]'>
                                                            {/* icons */}
                                                            {/* <FaShoppingCart size={18} /> */}
                                                            <BsCartPlusFill size={18} />
                                                            Continue shopping
                                                        </button>
                                                    </div>
                                                </div>
                                            )
                                        }

                                    </div>
                                    {/* onClick={handleProceedItems} */}
                                    {/* right side */}
                                    {/* md:order-2 order-1 */}
                                    <div className={`h-max xl:w-[27%] slg:w-[35%] w-full bg-white dark:bg-[#262936] md:rounded-[10px] p-[20px] md:sticky md:top-0 ${cartItems.length < 1 ? '' : 'sticky bottom-0 md:shadow-none shadow-[2px_0px_8px_rgba(0,0,0,0.2)] dark:shadow-[4px_0px_8px_rgba(6,18,25,0.6)]'}`}>
                                        {/* subtotals */}
                                        <h2 className='mb-[0.8rem] text-[20px] font-semibold text-black dark:text-[#BABECD]' style={{ fontFamily: "'Poppins', sans-serif" }}>
                                            Subtotal <span className='font-[500]'>({cartItems.length} items)</span> : ₹{new Intl.NumberFormat().format(subTotal)}
                                        </h2>

                                        {/* cartItems not exists */}
                                        {handleCartButton()}

                                    </div>
                                </div>
                            </main>
                            {/* Footer */}
                            <Footer mainFooter={true} />
                        </div>
                        <ThemeChanged bottomUpper='slg:bottom-[40px] bottom-[150px]' />
                    </>
                )
            }
        </>
    )
}

export default CartPage