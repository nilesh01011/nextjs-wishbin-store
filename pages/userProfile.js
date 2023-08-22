
'use client';

import Header from '../components/Header'
import ThemeChanged from '../components/ThemeChanged'
import React, { useEffect, useState } from 'react'
import CommonHead from '../components/CommonHead'
import Footer from '../components/Footer'
import { FaCamera, FaChevronDown, FaHeart, FaShippingFast, FaShoppingCart, FaStreetView, FaTrashAlt, FaUserEdit } from 'react-icons/fa'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { clearUser } from '../slices/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import { client } from '../sanity';
import Loading from '../components/Loading'
import { toast, Toaster } from 'react-hot-toast';
import { orderNotFound } from '../slices/orderSlice';
import { useQuery } from 'react-query';
import { signOut } from 'next-auth/react';
import imageUrlBuilder from '@sanity/image-url'
import { TiArrowBack } from 'react-icons/ti';
import { Router } from 'next/router';
// import Cookies from 'js-cookie';

const builder = imageUrlBuilder({
    // eslint-disable-next-line no-undef
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECTID,
    // eslint-disable-next-line no-undef
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
})
const urlFor = (source) => {
    return source ? builder.image(source) : '';
};

// fetch the dynamic data from server
const fetchData = async (setUser) => {
    const users_json = setUser ? setUser : null;

    try {
        const userData = await client.fetch(`*[_type == 'user' && email == $email][0]`, {
            email: users_json
        });

        const userId = userData ? userData._id : null

        // Fetch the orders for the user from Sanity.io
        const fetchOrdersQuery = `*[
                _type in ["order", "user"] &&
                user._ref == $userId
              ]`;

        const orders = await client.fetch(fetchOrdersQuery, { userId });

        return {
            userData,
            orders,
        };

    } catch (error) {
        // eslint-disable-next-line no-undef
        console.log(error);
    }
}

function UserProfilePage() {
    const dispatch = useDispatch();
    const router = useRouter();

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

    // user exits in redux
    const setUser = useSelector((state) => state.user);

    useEffect(() => {
        if (!setUser) {
            // eslint-disable-next-line no-undef
            window.location.href = '/login';
            return router.push('/login');
        }
    }, [setUser])

    // next-auth session
    // const { data: session } = useSession();

    // console.log(session)

    // useEffect(() => {
    //     if (!session) {
    //         window.location.href = '/login';
    //         return router.push('/login');
    //     }
    // }, [session])

    // product in wishlist counter
    const { wishlistItems } = useSelector((state) => state.wishlist);

    // product in cart counter
    const { cartItems } = useSelector((state) => state.cart);

    const [activeCollapse, setActiveCollapse] = useState(0);

    // fetch the dynamic data from server
    const { data, error } = useQuery("/userProfile", () => fetchData(setUser.email), {
        enabled: setUser && setUser.email !== undefined,
    });

    // console.log(data?.userData?.profileImage?.asset?._ref)

    if (error) {
        // eslint-disable-next-line no-undef
        return console.log(error)
    }

    if (!data) {
        return <Loading />
    }

    // logout cookies
    const handleLogout = () => {

        function logoutUser() {
            // eslint-disable-next-line no-undef, no-async-promise-executor
            return new Promise(async (resolve, reject) => {
                try {
                    // eslint-disable-next-line no-undef
                    const userLogout = setTimeout(async () => {
                        dispatch(clearUser());
                        // Cookies.remove('userData');
                        dispatch(orderNotFound());
                        // redirect to login page
                        // return router.push('/login');

                        // next-auth
                        await signOut({ callbackUrl: '/login' });
                    }, 2000)

                    resolve(userLogout);
                } catch (error) {
                    // If there was an error during the save operation, reject the promise with the error
                    reject(error);
                }
            });
        }
        // toast promise
        toast.promise(
            logoutUser(),
            {
                loading: 'Please wait...',
                success: 'Logout successfully',
                error: '!Opps something went wrong',
            }
        );
    }

    const userDataCollapse = [
        {
            id: 1,
            icons: <FaHeart size={22} />,
            title: 'Wishlist',
            subtitle: 'All your product collection',
            head: 'Wishlist items',
            count: wishlistItems.length,
            divided: true,
            links: '/wishlist',
            linkText: 'View wishlist'
        },
        {
            id: 2,
            icons: <FaShippingFast size={22} />,
            title: 'Orders',
            subtitle: 'Check your order status',
            head: 'Your Order',
            count: data.orders.length,
            divided: true,
            links: '/orders',
            linkText: 'View orders'
        },
        {
            id: 3,
            icons: <FaShoppingCart size={22} />,
            title: 'Your product in cart',
            subtitle: 'Check your carts for faster checkout',
            head: 'Product in cart',
            count: cartItems.length,
            divided: true,
            links: '/cart',
            linkText: 'View cart'
        },
        {
            id: 4,
            icons: <FaStreetView size={22} />,
            title: 'Your shipping address',
            subtitle: 'Save addresses for a hassle-free checkout',
            head: 'Your address',
            divided: false,
            text: data.userData.address
        }
    ];

    const handleActiveCollapse = (id) => {
        if (activeCollapse === id) {
            setActiveCollapse(0)
        } else {
            setActiveCollapse(id)
        }
    }

    return (
        <>
            <CommonHead title="User Profile - WishBin | Online Shopping site in India" />

            {
                loading === true ? (
                    <Loading />
                ) : (
                    <>
                        <div className='fixed top-0 z-[99999]'>
                            <Toaster />
                        </div>
                        <div className='w-full h-full'>
                            <Header navbar={false} sticky={false} />

                            <main className="max-w-[1366px] mx-auto w-full h-full xl:px-[3rem] xs:px-[1.5rem] px-[1rem] mt-[20px]">
                                {/* user details */}
                                <div className='w-full h-max flex md:flex-row flex-col gap-[20px] justify-between bg-white dark:bg-[#262936] p-[20px] rounded-[10px]'>
                                    {/* left side */}
                                    <div className='flex items-center xs:flex-row flex-col md:order-1 order-2 gap-[20px]'>
                                        {/* images */}
                                        <div className='w-[150px] h-[150px] border-[1px] border-black dark:border-[#353740] rounded-full p-[15px] relative'>
                                            {/* camera icons */}
                                            <button onClick={() => router.push(`/uploadImage?user_id=${setUser._id}`)} type='button' role='button' aria-label='upload' className='absolute top-4 -right-0 p-[8px] bg-white dark:bg-[#262936] h-[35px] w-[35px] flex items-center justify-center border-[1px] border-black dark:border-[#353740] rounded-full'>
                                                <FaCamera size={25} className='text-black dark:text-[#BABECD]' />
                                            </button>

                                            {
                                                data.userData.profileImage ? (
                                                    <Image
                                                        onClick={() => router.push(`/uploadImage?user_id=${setUser._id}`)}
                                                        src={urlFor(data.userData.profileImage.asset._ref).url()}
                                                        alt='user-image' width={120} height={120}
                                                        className={`w-[120px] h-[120px] 'p-0 object-cover rounded-full`} />
                                                ) : (
                                                    <Image
                                                        onClick={() => router.push(`/uploadImage?user_id=${setUser._id}`)}
                                                        src='/user-secret-solid.svg'
                                                        alt='user-image' width={120} height={120}
                                                        className={`w-[120px] h-[120px] p-[10px] object-contain rounded-full`} />
                                                )
                                            }
                                        </div>
                                        {/* user name and phone number with emails */}
                                        <div className='xs:w-max w-full flex flex-col gap-[15px]'>
                                            {/* user name */}
                                            <h1 className='xs:text-[2rem] text-[24px] text-black dark:text-[#BABECD] capitalize'>
                                                {data.userData.username}
                                            </h1>
                                            {/* line */}
                                            <div className='w-full h-[1px] bg-[#d6d6d6] dark:bg-[#96a0a5cc]/40'></div>
                                            {/* email and phone number */}
                                            <div className='flex lg:items-center items-start lg:flex-row flex-col lg:gap-[20px] gap-[4.8px]'>
                                                {/* email id */}
                                                <h6 className='text-black dark:text-[#BABECD]'>Email : {" "}
                                                    <span className='font-[400] md:text-[16px] text-[14px] text-black dark:text-[#96a0a5]'>
                                                        {data.userData.email}
                                                    </span>
                                                </h6>
                                                {/* phone number */}
                                                <h6 className='text-black dark:text-[#BABECD]'>Phone number : {" "}
                                                    <span className='font-[400] md:text-[16px] text-[14px] text-black dark:text-[#96a0a5]'>
                                                        +91 {data.userData.mobile_number ? data.userData.mobile_number : 'xxxx-xxxx-xx'}
                                                    </span>
                                                </h6>
                                            </div>
                                        </div>
                                    </div>
                                    {/* right side */}
                                    <div className='md:order-2 order-1'>
                                        <button onClick={() => router.push(`/userdataupdate/${data.userData._id}`)} type='button' role='button' aria-label='edit' className='w-max h-[35px] rounded-[5px] tracking-[0.4px] bg-[#f16565] dark:hover:opacity-80 text-white px-[1.2rem] text-[16px] font-[500] shadow-[0_2px_4px_rgba(0,0,0,0.3)] hover:shadow-none flex items-center justify-center gap-[6px]'>
                                            <FaUserEdit size={16} />
                                            Edit
                                        </button>
                                    </div>
                                </div>
                                {/* contents */}
                                <div className='w-full flex flex-col gap-[20px] mt-[20px]'>
                                    {
                                        userDataCollapse && userDataCollapse.map((ele) => {
                                            const { id, icons, title, subtitle, head, divided, text, links, linkText, count } = ele;

                                            return (
                                                <div key={id} className={`w-full hover:bg-[#F5F5F6]
                                         dark:hover:bg-[#262936]/90 hover:shadow-md ${activeCollapse === id ? 'h-full shadow-md' : 'h-max'} bg-white
                                         dark:bg-[#262936] p-[20px] rounded-[10px]`}>

                                                    <div onClick={() => handleActiveCollapse(id)} className='flex items-center justify-between cursor-pointer'>
                                                        {/* left side */}
                                                        <div className='flex items-center gap-[20px]'>
                                                            {/* icons */}
                                                            <span className={`${activeCollapse === id ? 'text-black dark:text-[#BABECD]'
                                                                : 'text-[#96a0a5] dark:text-[#BABECD]/60'}`}>
                                                                {icons}
                                                            </span>
                                                            {/* title and para */}
                                                            <div className='flex flex-col gap-[0.3rem]'>
                                                                {/* title */}
                                                                <h2 className='text-[1.1rem] dark:text-[#BABECD]'>{title}</h2>
                                                                {/* para */}
                                                                <p className='text-[0.9rem] text-[#94969F] dark:text-[#96a0a5]'>{subtitle}</p>
                                                            </div>
                                                        </div>
                                                        {/* right side */}
                                                        <div>
                                                            <FaChevronDown className={`${activeCollapse === id ? '-rotate-180' : 'rotate-0'} transition-all
                                                    duration-500 text-black dark:text-[#BABECD]`} size={17} />
                                                        </div>
                                                    </div>
                                                    {/* show collapse contents */}
                                                    {
                                                        activeCollapse === id &&
                                                        <div className={`w-full flex mt-[0.8rem] ${text ? 'md:flex-row flex-col gap-[4px]' : 'items-center'}`}>
                                                            {/* items */}
                                                            <h6 className='text-[0.9rem] text-black dark:text-[#BABECD]'>
                                                                {head} : {" "}
                                                                {
                                                                    count &&
                                                                    <span className='text-[#f16565] font-bolder'>{count}</span>
                                                                }
                                                            </h6>
                                                            {/* hr line */}
                                                            {
                                                                divided === true &&
                                                                <div className='w-[1px] h-[21px] bg-[#d5d5d5] dark:bg-[#96a0a5cc]/40 block mx-[1rem]'></div>
                                                            }
                                                            {/* links */}
                                                            {
                                                                links &&
                                                                <Link href={links} title={`Click to visit the ${linkText} website`} className='group text-[0.9rem] relative text-black dark:text-[#BABECD]'>
                                                                    {linkText}
                                                                    <span className='absolute left-0 bottom-0 h-[1px] w-0 bg-black dark:bg-[#96a0a5] transition-all duration-300 group-hover:w-full'></span>
                                                                </Link>
                                                            }
                                                            {/* text */}
                                                            {
                                                                text &&
                                                                <span className='text-[#f16565] font-bolder text-[14px]'>
                                                                    {text}
                                                                </span>
                                                            }
                                                        </div>
                                                    }
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                                {/* logout button */}
                                {/* xs:flex-row flex-col */}
                                {/* xs:mt-[35px] mt-[28px] */}
                                <div className='w-full h-max mb-[5rem] flex xs:gap-[20px] gap-[12px] items-center justify-center sticky bottom-0 left-0 dark:bg-[#101219] bg-[#E7EDEF] xs:pt-[35px] pt-[28px] pb-[25px]'>
                                    <button
                                        type='button' role='button' aria-label='cancel-btn'
                                        onClick={() => router.push('/')}
                                        // bg-black dark:bg-[#262936]
                                        // dark:shadow-[0_1px_2px_1px_rgba(255,255,255,0.1)]
                                        className={`xs:w-[250px] w-full text-[16px] h-max p-[1rem] rounded-[10px] hover:opacity-80 border-2 border-black dark:border-[#BABECD] text-black dark:text-[#BABECD] font-bold uppercase flex items-center justify-center tracking-[1.5px] gap-[10px] shadow-[0_2px_4px_rgba(0,0,0,0.3)] hover:shadow-none`}>
                                        <TiArrowBack size={20} />
                                        back
                                    </button>
                                    <button type='button' role='button' aria-label='logout-btn' onClick={() => handleLogout()} className='text-[16px] xs:w-[250px] w-full h-max p-[1rem] rounded-[10px] bg-[#f16565] hover:bg-[#e65252] border-2 border-[#f16565] text-white font-bold uppercase flex items-center justify-center tracking-[1.5px] gap-[0.4rem] shadow-[0_2px_4px_rgba(0,0,0,0.3)] hover:shadow-none'>
                                        <FaTrashAlt size={16} />
                                        logout
                                    </button>
                                </div>
                            </main>

                            {/* Footer */}
                            <Footer mainFooter={true} />
                        </div>
                        <ThemeChanged bottomUpper='slg:bottom-[40px] bottom-[130px]' />
                    </>
                )
            }
        </>
    )
}

export default UserProfilePage;