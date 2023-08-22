/* eslint-disable no-inner-declarations */
/* eslint-disable no-async-promise-executor */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FaShoppingCart, FaTimes } from 'react-icons/fa';
import { addToCart } from '../slices/cartSlice';
import { useDispatch, useSelector } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';
import { deleteFromWishlistItems } from '../slices/wishlistSlice';
import { client } from '../sanity';
// import { useSession } from 'next-auth/react';

function WishlistItems({ product }) {

    const router = useRouter();
    // user exists
    const setUser = useSelector((state) => state.user);

    // const { data: session } = useSession();
    // const User = Cookies.get('userInfo');
    // const [getUser, setUser] = useState([])

    // useEffect(() => {
    //     if (!User) {
    //         window.location.href = '/login'
    //         return router.push('/login');
    //     }

    //     if (User) {
    //         setUser(JSON.parse(User));
    //     }
    // }, [User])

    const prodId = product._id;
    // const images = product?.product?._ref;

    const [getProduct, setGetProduct] = useState([]);

    const fetchWishlistItems = async (img) => {
        try {
            const productQuery = `*[_type == 'product' && _id == $img]{
                _id,
                name,
                rating,
                categoryTitle,
                mrp,
                price,
                qty,
                description,
                "image":image.asset->url
            }[0]`;

            const products = await client.fetch(productQuery, { img });

            setGetProduct(products)

            return products;

        } catch (error) {
            console.log('error for fetching product image', error)
        }
    }

    useEffect(() => {
        fetchWishlistItems(prodId);
    }, [prodId]);


    const proPrice = new Intl.NumberFormat('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(getProduct.price);
    const proMrp = new Intl.NumberFormat('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(getProduct.mrp);

    // add to cart functionality
    const dispatch = useDispatch();

    // add to product in cartItems
    const handleCartItems = async (ele, price) => {

        if (setUser) {
            try {
                const userId = setUser ? setUser._id : null;

                async function addToCartItems() {
                    return new Promise(async (resolve, reject) => {
                        try {
                            const fetchWishlist = await client.fetch(`*[
                                _type in ["wishlist", "user"] &&
                                user._ref == $userId
                              ]`, { userId });

                            // add to cartItems
                            dispatch(
                                addToCart({
                                    // first product data
                                    ...ele,
                                    // product price
                                    oneQuantityPrice: price,
                                })
                            );
                            // remove to cartItems
                            dispatch(deleteFromWishlistItems({ id: prodId }));

                            const result = fetchWishlist.some(async (item) => {
                                if (item.product._ref === prodId) {
                                    console.log('delete Wishlist:', item._id)
                                    return await client.delete(item._id);
                                }
                            });

                            resolve(result);
                        } catch (error) {
                            reject(error);
                            console.log('Error to remove wishlist items', error)
                            toast.error('!Opps something went wrong to add your wishlist items.');
                        }
                    })
                }

                toast.promise(
                    addToCartItems(),
                    {
                        loading: 'Please wait...',
                        success: `${ele.name} item added to your cart items :)`,
                        error: '!Opps something went wrong to remove your wishlist items.',
                    }
                );

            } catch (error) {
                console.log(error);
            }
        }

    }

    // remove wishlist item
    const handleRemoveWishlist = async (ele) => {

        async function deleteWishlistItems() {
            return new Promise(async (resolve, reject) => {
                try {
                    const userId = setUser ? setUser._id : null;

                    const fetchWishlist = await client.fetch(`*[
                    _type in ["wishlist", "user"] &&
                    user._ref == $userId
                    ]`, { userId });

                    // remove to cartItems
                    dispatch(deleteFromWishlistItems({ id: prodId }));

                    const result = fetchWishlist.filter(async (item) => {
                        if (item.product._ref === prodId) {
                            console.log('delete Wishlist:', item)
                            return await client.delete(item._id);
                        }
                    });

                    resolve(result);

                } catch (error) {
                    console.log(error);
                    reject(error)
                }
            })
        }

        toast.promise(
            deleteWishlistItems(),
            {
                loading: 'Please wait...',
                success: `${ele.name} item remove from your Wishlist Items :)`,
                error: '!Opps something went wrong to add to cart.',
            }
        );
    }

    // console.log('useState:', getProduct)
    // console.log('product:', prodId)

    return (
        <>
            <div className='fixed top-0 z-[99999]'>
                <Toaster />
            </div>
            <div className='w-full h-full rounded-[10px] bg-[#E7EDEF] dark:bg-[#373B4D] relative'>
                {/* delete icons */}
                <button onClick={() => handleRemoveWishlist(getProduct)} type='button' role='button' className='absolute right-[10px] top-[10px] flex items-center justify-center w-[38px] h-[38px] bg-black hover:opacity-80 rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.3)] hover:shadow-none'>
                    <FaTimes size={17} className='text-white dark:text-[#BABECD] font-[400]' />
                </button>
                {/* product image */}
                <div
                    className='sm:w-[80%] mx-auto w-full h-[53%] max-h-[53%] p-[1rem_0.5rem] rounded-[10px_10px_0_0]'>
                    {
                        getProduct.image &&
                        <Image
                            src={getProduct.image}
                            title={getProduct.name}
                            width={200}
                            height={140}
                            alt={getProduct.name}
                            quality={50}
                            importance="high"
                            rel="none"
                            loading="lazy"
                            decoding="async"
                            className='w-full h-full max-h-[126px] object-contain'
                        />
                    }
                </div>
                {/* contents */}
                <div className='w-full h-[47%] p-[10px] border-[1px] border-[#d5d5d5] dark:border-[#353740] bg-white dark:bg-[#14161D]/70 rounded-[10px] flex flex-col justify-between gap-[6px]'>
                    {/* product title */}
                    <h6 className='whitespace-nowrap font-[600] text-[18px] text-black dark:text-[#BABECD]'>
                        {getProduct.name && getProduct.name.length >= 17 ? `${getProduct.name.slice(0, 17)}...` : getProduct.name}
                    </h6>
                    {/* price and view button */}
                    <div className='w-full flex items-center justify-between'>
                        {/* product prices */}
                        <div className='flex items-center gap-[0.5rem]'>
                            {/* price */}
                            <span className='sm:text-[14px] text-[16px] font-[600] text-[#f16565]'>₹{proPrice}</span>
                            {/* mrp */}
                            <span className='sm:text-[14px] text-[16px] font-[500] line-through text-[#858999]'>₹{proMrp}</span>
                        </div>
                        {/* line */}
                        <div className='w-[1px] h-[18px] block bg-[#d5d5d5] dark:bg-[#353740]'></div>
                        {/* view button */}
                        <Link href={`/product-details/${getProduct._id}`} onClick={() => router.push(`/product-details/${getProduct._id}`)} title={`Click to visit ${getProduct.name} Product details`} className='text-[14px] text-black dark:text-[#BABECD] hover:underline hover:text-[#f16565] dark:hover:text-[#f16565]'>view..</Link>
                    </div>
                    {/* move to cart */}
                    <button onClick={() => handleCartItems(getProduct, getProduct.price)} aria-label="add-to-cart" type='button' role='button' className='w-full h-[50px] py-[0.6rem] text-[16px] flex items-center justify-center gap-[10px] bg-[#101219] text-white dark:text-[#BABECD] dark:hover:opacity-80 rounded-[5px] font-[500] hover:opacity-80 shadow-[0_2px_4px_rgba(0,0,0,0.3)] hover:shadow-none'>
                        <FaShoppingCart size={16} />
                        Move to Cart
                    </button>
                </div>
            </div>
        </>
    )
}

export default WishlistItems