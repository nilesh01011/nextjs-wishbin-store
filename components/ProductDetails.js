/* eslint-disable no-inner-declarations */
/* eslint-disable no-async-promise-executor */
/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
'use client'

import Image from 'next/image'
import React, { useState } from 'react';
import Rating from './Rating';
import { MdFacebook, MdMail } from 'react-icons/md';
import { FaInstagram, FaTwitterSquare } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../slices/cartSlice';
import { TiArrowBack } from 'react-icons/ti';
import { FiCheckCircle } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
// import { useSession } from 'next-auth/react';
import { getDiscountedPricePercentage } from '../utils/getDiscountPrice';
import { urlFor } from '../sanity';

function ProductDetails({ product }) {
    const router = useRouter()
    const proPrice = new Intl.NumberFormat().format(product.price);
    const proMrp = new Intl.NumberFormat().format(product.mrp);

    // add to cart functionality
    const dispatch = useDispatch();

    // micro-interaction
    const [isItemsInCart, setIsItemsInCart] = useState(false);

    // active product in cart
    const { cartItems } = useSelector((state) => state.cart);

    if (!cartItems) {
        console.log('empty cart items');
    }

    // ATC button
    const handleAddToCart = (ele, price) => {
        dispatch(
            addToCart({
                // first product data
                ...ele,
                // product price
                oneQuantityPrice: price,
            })
        )
        // success notify
        toast.success(`${ele.name} item add successful to your cart :)`, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });

        setIsItemsInCart(true);
    }

    // user exists
    const setUser = useSelector((state) => state.user);

    // const { data: session } = useSession();
    // const User = Cookies.get('userInfo');
    // const [getUser, setUser] = useState([])

    // useEffect(() => {

    //     if (User) {
    //         setUser(JSON.parse(User));
    //     }
    // }, [User])

    const [isLoading, setIsLoading] = useState(false)

    // Buy now button handle
    const handleBuyNow = async (product, price) => {
        // payments page
        if (!setUser) {
            return toast.error(`!Please login to credentials 🔐`, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        }

        if (setUser) {

            setIsLoading(true)

            function redirectToCheckout(product, price) {
                return new Promise(async (resolve, reject) => {
                    try {
                        const checkoutCart = setTimeout(async () => {
                            dispatch(
                                addToCart({
                                    // first product data
                                    ...product,
                                    // product price
                                    oneQuantityPrice: price,
                                })
                            )

                            router.push('/checkout-summary')
                            setIsLoading(false)

                        }, 1000)

                        resolve(checkoutCart);
                    } catch (error) {
                        // If there was an error during the save operation, reject the promise with the error
                        reject(error);
                    }
                });
            }

            toast.promise(
                redirectToCheckout(product, price),
                {
                    loading: 'Redirecting Please wait...',
                    success: 'Success you will redirect to checkout page',
                    error: 'Opps something went wrong to redirect.',
                }
            );
        }
    }

    return (
        <>
            <div className='fixed top-0 z-[99999]'>
                <Toaster />
            </div>
            <div className='w-full h-full'>
                <div className='w-full h-full flex slg:flex-row flex-col md:gap-[20px]'>
                    {/* left side */}
                    <div className='slg:w-[70%] w-full bg-white dark:bg-[#262936] md:p-[20px] px-[20px] pt-[20px] md:rounded-[10px] flex lg:flex-row flex-col md:gap-[20px]'>
                        {/* images */}
                        <div className='lg:w-[40%] w-full flex flex-col'>
                            {/* back button */}
                            <button onClick={() => router.back()} role='button' type='button' aria-label='go-back' className='w-max h-max text-[14px] py-[0.5rem] px-[1.5rem] rounded-[5px] dark:text-[#BABECD] border-[1px] border-black/70 dark:border-[#BABECD]/70 dark:hover:border-black hover:bg-black dark:hover:bg-[#BABECD] hover:text-white dark:hover:text-black flex items-center justify-center gap-[5px]'>
                                <TiArrowBack size={14} />
                                Go Back
                            </button>

                            <div className='mt-[20px] smd:mb-0 mb-[8px] w-full text-center lg:sticky lg:top-0 flex flex-col items-center justify-center gap-[6px]'>
                                {
                                    product.image.asset._ref &&
                                    <Image
                                        src={urlFor(product.image.asset._ref).url()}
                                        loading="lazy"
                                        quality={80}
                                        importance="high"
                                        rel="none"
                                        height={300}
                                        width={316}
                                        title={product.name}
                                        alt={product._id}
                                        className='w-[316px] h-[250px] object-contain mb-[6px]' />
                                }

                                {/* text */}
                                <span className='text-[#565959] dark:text-[#96a0a5] font-[500]'>{product.name}</span>
                            </div>
                            {/* line divide */}
                            <div className='w-full h-[1px] md:hidden block bg-[#d6d6d6] dark:bg-[#d6d6d6]/20 my-[10px]'></div>
                        </div>
                        {/* content */}
                        <div className='lg:w-[60%] w-full divide-y-[1px] divide-[#d6d6d6] dark:divide-[#d6d6d6]/20'>
                            {/* description, rating and rating number */}
                            <div className='h-max pb-[10px]'>
                                {/* description */}
                                <h1 className='xl:text-[30px] sm:text-[26px] xs:text-[24px] text-[22px] leading-[40px] font-[500] text-black dark:text-[#BABECD]'>
                                    {product.description}
                                </h1>
                                {/* rating */}
                                <div className='flex items-center mt-[0.7rem] divide-x-[1px] divide-[#d6d6d6] dark:divide-[#d6d6d6]/20'>
                                    {/* rating stars */}
                                    <div className='flex items-center gap-[0.2rem] pr-[0.5rem]'>
                                        <Rating rating={product.rating} sizes={18} />
                                    </div>
                                    {/* rats */}
                                    <span className='text-[#2d90a1] dark:text-[#34adc2] pl-[0.5rem]'>{new Intl.NumberFormat().format(product.rating_number)}</span>
                                </div>
                            </div>
                            {/* prices */}
                            <div className='w-full leading-[32px] py-[10px]'>
                                <div className='flex items-center gap-[20px] pt-[8px]'>
                                    {/* discount percentage */}
                                    <h2 className='text-[2rem] font-[200] text-[#cc0c39]'>
                                        {/* -70% */}
                                        -{getDiscountedPricePercentage(
                                            product.mrp,
                                            product.price
                                        )}
                                    </h2>
                                    {/* price */}
                                    <div className='flex items-start gap-[0.2rem]'>
                                        {/* price icon */}
                                        <span className='text-[14px]'>₹</span>
                                        {/* price */}
                                        <h2 className='text-[2rem] font-[500] text-black dark:text-[#BABECD]'>{proPrice}</h2>
                                        {/* 00 */}
                                        <span className='text-[14px]'>.00</span>
                                    </div>
                                </div>
                                <p className='text-[#565959] dark:text-[#96a0a5] pt-[4px]'>M.R.P : <span className='line-through'>₹{proMrp}</span></p>
                            </div>
                            {/* tableDetails data */}
                            {
                                product.tableDetails &&
                                <div className='py-[10px]'>
                                    {
                                        product.tableDetails.map((item) => {
                                            const { _key, column1, column2 } = item;

                                            const lastArray = product.tableDetails[product.tableDetails.length - 1];

                                            return (
                                                <div key={_key} className={`grid grid-cols-2 ${lastArray._key === _key ? 'pb-0' : 'pb-[7px]'}`}>
                                                    {/* title */}
                                                    <h6 className='text-[14px] text-black dark:text-[#BABECD] w-[70%]'>{column1}</h6>
                                                    {/* text */}
                                                    <span className='text-[14px] text-black dark:text-[#96a0a5]'>{column2}</span>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            }
                            {/* about_details */}
                            {
                                product.about_details &&
                                <div className='w-full pt-[10px]'>
                                    {/* title */}
                                    <h1 className='mb-[0.5rem] text-black dark:text-[#BABECD]'>About this item</h1>
                                    {/* about details list */}
                                    <ul className='w-full flex flex-col gap-[5px]'>
                                        {
                                            product.about_details.map((item, i) => {

                                                return (
                                                    <li key={i} className={`text-[13px] list-disc ml-[15px] text-black dark:text-[#96a0a5]`}>{item}</li>
                                                )
                                            })
                                        }
                                    </ul>
                                </div>
                            }
                        </div>
                        {/* line divide */}
                        <div className='w-full h-[1px] md:hidden block bg-[#d6d6d6] dark:bg-[#d6d6d6]/20 my-[15px]'></div>
                    </div>
                    {/* right side */}
                    <div className='slg:w-[30%] w-full h-max flex flex-col md:gap-[20px] sticky top-0'>
                        {/* share list */}
                        <div className='bg-white dark:bg-[#262936] md:rounded-[10px] md:p-[20px] px-[20px] py-[10px] md:order-1 order-2'>
                            <div className='flex items-center justify-center gap-[8px]'>
                                <span className='text-[#565959] dark:text-[#BABECD]'>Share</span>
                                <div className='flex items-center gap-[5px]'>
                                    <span>
                                        <MdMail size={16} />
                                    </span>
                                    <span>
                                        <MdFacebook className='text-[#007aff]' size={16} />
                                    </span>
                                    <span>
                                        <FaInstagram size={16} className='text-[#e84393]' />
                                    </span>
                                    <span>
                                        <FaTwitterSquare size={16} className='text-[#74b9ff]' />
                                    </span>
                                </div>
                            </div>
                            <div className='w-full h-[1px] bg-[#d6d6d6] dark:bg-[#d6d6d6]/20 md:mt-[6px] mt-[14px] md:mb-[3px] mb-[6px]'></div>
                        </div>
                        {/* product price and add to cart or buy now button */}
                        <div className='bg-white dark:bg-[#262936] md:rounded-[10px] md:p-[20px] px-[20px] pb-[10px] md:order-2 order-1'>
                            {/* price */}
                            <div className='flex items-center gap-[0.2rem] text-black dark:text-[#BABECD]'>
                                {/* price icon */}
                                <span className='text-[14px]'>₹</span>
                                {/* price */}
                                <h2 className='text-[2rem] font-[500]'>{proPrice}</h2>
                                {/* 00 */}
                                <span className='text-[14px]'>.00</span>
                            </div>
                            {/* product status */}
                            {product.status === true ? (<span className='text-[1.2rem] text-[#007600] font-[500]'>In Stock</span>) : (<span className='text-[1.2rem] text-[#cc0c39] font-[500]'>Out of Stock</span>)}

                            {/* product sold by company name */}
                            <p className='text-[14px] text-black dark:text-[#96a0a5]'>Sold by
                                <span className='capitalize text-[#2d90a1] dark:text-[#34adc2] px-[2px] font-[600]'>
                                    {product.soldBy}
                                </span>
                                and Fulfilled by WB.
                            </p>

                            <div className='w-full flex slg:flex-col sm:flex-row flex-col mt-[0.8rem] gap-[0.8rem]'>
                                {/* add to cart button */}
                                <button onClick=
                                    {() => handleAddToCart(product, product.price)}
                                    role='button'
                                    type='button'
                                    aria-label='add-to-cart'
                                    className={`w-full h-[50px] p-[0.6rem_1.4rem] ${isItemsInCart === true ? 'bg-[#52A382] text-white' : 'bg-[#101219] text-white dark:text-[#BABECD]'} flex items-center justify-center gap-[5px] shadow-[0_2px_4px_rgba(0,0,0,0.3)] hover:shadow-none hover:opacity-[0.85] rounded-[5px] text-[18px]`}
                                >
                                    {
                                        isItemsInCart === true ? (
                                            <>
                                                <FiCheckCircle id="atc_btn_icons" size={16} className={`active`} />
                                                Added
                                            </>
                                        ) : 'Add to Cart'
                                    }
                                </button>

                                {/* buy now button */}
                                <button
                                    onClick={() => handleBuyNow(product, product.price)}
                                    role='button'
                                    type='button'
                                    aria-label='buy-now'
                                    className='w-full h-[50px] flex items-center justify-center p-[0.6rem_1.4rem] bg-transparent hover:opacity-[0.85] shadow-[0_2px_4px_rgba(0,0,0,0.3)] hover:shadow-none border-[1px] border-black dark:border-[#BABECD] rounded-[5px] text-black dark:text-[#BABECD] text-[18px]'>

                                    {
                                        isLoading === true &&
                                        <span>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black dark:text-[#BABECD]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        </span>
                                    }
                                    Buy Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* product description */}
                {
                    product.body &&
                    <div className='w-full h-max bg-white dark:bg-[#262936] md:p-[20px] px-[20px] pt-[6px] pb-[20px] md:rounded-[10px] md:mt-[20px] md:mb-[6.5rem] xs:mb-[6rem] mb-[7.3rem]'>
                        {/* title */}
                        <h6 className='text-black dark:text-[#BABECD]'>Product description</h6>
                        <div className='text-[13px] text-[#565959] dark:text-white/60 md:pl-[2rem] mt-[1rem]'>
                            {
                                product.body.map((ele) => {

                                    const text = ele.children.map((child) => {
                                        return child.text
                                    })

                                    return (
                                        <div key={ele._key}>
                                            {text}
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                }
            </div>
        </>
    )
}

export default ProductDetails