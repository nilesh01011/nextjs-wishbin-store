/* eslint-disable no-undef */
'use client'

import Header from '../components/Header'
import React, { useEffect, useState } from 'react'
import ThemeChanged from '../components/ThemeChanged'
import Footer from '../components/Footer'
import { useSelector } from 'react-redux'
import { Router } from 'next/router'
import { useRouter } from 'next/navigation'
import Loading from '../components/Loading'
import Image from 'next/image'
import { FaPlus } from 'react-icons/fa'
import WishlistItems from '../components/WishlistItems'
// import { useSession } from 'next-auth/react'
// import { useQuery } from 'react-query';
// import { client } from '../sanity'
// import useSWR, { mutate } from 'swr';
import orderBy from 'lodash.orderby'
import CommonHead from '../components/CommonHead'

function WishlistPage() {
    const router = useRouter();

    // user exists
    // const setUser = useSelector((state) => state.user);
    // // check use is exists or not
    // useEffect(() => {
    //     if (!setUser) {
    //         window.location.href = '/login';
    //         router.push('/login')
    //     }
    // }, [setUser])
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

    // const { data: session } = useSession();

    // wishlist functionality
    const { wishlistItems } = useSelector((state) => state.wishlist);

    const wishListProduct = orderBy(wishlistItems, ['_createdAt'], ['desc']);

    // user exists
    const setUser = useSelector((state) => state.user);

    useEffect(() => {
        if (!setUser) {
            window.location.href = '/login';
            return router.push('/login');
        }
    }, [router, setUser])

    const [loading, setLoading] = useState(false);

    Router.events.on("routeChangeStart", () => {
        console.log("Route is staring...")
        setLoading(true)
    });

    Router.events.on("routeChangeComplete", () => {
        console.log("Route is completed...")
        setLoading(false)
    });

    // home button
    const handleGoHomeButton = () => {
        return router.back();
    }

    // const fetchUserWishlistData = async () => {
    //     try {

    //         if (!setUser?.email) return null;

    //         const email = setUser ? setUser?.email : null;

    //         // fetch user from Sanity.io
    //         const userEmailQuery = `*[_type == 'user' && email == $email][0]`;
    //         const fetchUserData = await client.fetch(userEmailQuery, { email });
    //         const userId = fetchUserData ? fetchUserData._id : null;
    //         // fetch order by userId
    //         const fetchWishlistQuery = `*[_type in ["wishlist", "user"] && user._ref == $userId]`;
    //         const wishList = await client.fetch(fetchWishlistQuery, { userId });

    //         return {
    //             wishList,
    //         };

    //     } catch (error) {
    //         console.log('fetchOrdersData error :', error);
    //     }
    // }

    // const { data, error } = useSWR('/wishlist', fetchUserWishlistData);

    // // const { data, error } = useQuery('wishlist', () => fetchUserWishlistData(setUser?.email), {
    // //     enabled: setUser?.email !== undefined,
    // // })

    // console.log(data)

    // useEffect(() => {
    //     // Mutate cache on update
    //     mutate('/wishlist', fetchUserWishlistData);
    // }, [fetchUserWishlistData, data]);

    // if (error) {
    //     console.log("Error for fetching user data :", error);
    // }

    return (
        <>
            <CommonHead title="Your Wishlist Items - WishBin | Online Shopping site in India" />

            {
                loading === true ? (
                    <Loading />
                ) : (
                    <>
                        <div className='w-full h-full'>
                            <Header navbar={false} sticky={true} />

                            <main className="max-w-[1366px] mx-auto w-full h-full xl:px-[3rem] md:px-[1.5rem] px-[1rem] xl:mb-[6.7rem] md:mb-[6.4rem] xs:mb-[6rem] mb-[7.2rem] mt-[20px]">
                                <div className='w-full h-full p-[20px] bg-white dark:bg-[#262936] rounded-[10px]'>
                                    {/* title */}
                                    <h3 className='text-[1.5rem] font-[600] text-black dark:text-[#BABECD]'>My Wishlist <span className='font-[400]'>{wishlistItems && wishlistItems.length} item</span></h3>
                                    {/* line */}
                                    <div className='w-full h-[1px] bg-[#d5dbdb] dark:bg-[#96a0a5cc]/40 my-[1rem]'></div>

                                    {/* wishlistItems */}
                                    {
                                        wishlistItems && wishlistItems.length > 0 &&
                                        <div className='w-full h-auto grid xl:grid-cols-4 slg:grid-cols-3 xs:grid-cols-2 grid-cols-1 md:gap-[30px] gap-[20px]'>
                                            {/* wishlist items list */}

                                            {/* {
                                                        loading === true ? (
                                                            wishListProduct?.map((ele) => (
                                                                <div key={ele._id} className='animate-pulse xl:h-[250px] h-[290px] w-full'>
                                                                    <div className="bg-slate-400 h-full w-full"></div>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            
                                                        )
                                                    } */}

                                            {
                                                wishListProduct && wishListProduct.map((item) => (
                                                    <WishlistItems key={item._id} product={item} />
                                                ))
                                            }
                                        </div>
                                    }
                                    {/* empty wishlistItems */}
                                    {
                                        wishListProduct && wishlistItems.length < 1 && (
                                            <div className='w-full h-full'>
                                                {/* images */}
                                                <Image src='/wishList.png' alt='empty-cart' width={420} height={300} className='w-full xs:h-[300px] h-[200px] object-contain' />
                                                {/* contents */}
                                                <div className='xs:mt-[3rem] mt-[2rem] flex items-center justify-center flex-col'>
                                                    <h1 className='xs:text-[2rem] text-[24px] font-[500] text-black dark:text-[#BABECD]'>Your wishlist is empty!</h1>
                                                    <p className='text-[#96a0a5] mt-[0.4rem] xs:mb-[1rem] mb-[0.7rem] xs:text-[1.10rem] mobile:text-[15px] text-[14px]'>Explore more and shortlist some items</p>
                                                    {/* button */}
                                                    <button onClick={() => handleGoHomeButton()} type='button' role='button' aria-label='continue-shopping' className='md:w-[340px] text-[18px] shadow-[0_2px_4px_rgba(0,0,0,0.3)] hover:shadow-none w-full h-[50px] bg-[#101219] hover:opacity-75 text-white dark:text-[#BABECD] flex items-center justify-center gap-[10px] p-[0.5rem_1.4rem] rounded-[6px]'>
                                                        {/* icons */}
                                                        {/* <FaShoppingCart size={18} /> */}
                                                        <FaPlus size={18} />
                                                        Add Wishlist
                                                    </button>
                                                </div>
                                            </div>
                                        )
                                    }
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

export default WishlistPage