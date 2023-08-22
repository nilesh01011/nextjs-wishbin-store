/* eslint-disable no-undef */
'use client'

import orderBy from 'lodash.orderby';
import CommonHead from '../../components/CommonHead';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import Loading from '../../components/Loading';
import OrderItems from '../../components/OrderItems';
import ThemeChanged from '../../components/ThemeChanged';
import { client } from '../../sanity';
// import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { Router, useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { FaPlus } from 'react-icons/fa';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
// import { addOrderItems } from '../../slices/orderSlice';

// const fetchData = async (userSession) => {
//     try {
//         if (!userSession) return null;

//         const email = userSession ? setUser?.email : null;
//         // fetch user from Sanity.io
//         const userEmailQuery = `*[_type == 'user' && email == $email][0]`;
//         const userExists = await client.fetch(userEmailQuery, { email });

//         if (userExists) return null;

//         // get user data and added to the sanity.io account
//         const userData = await client.create({ _type: 'user', email: email, username: userSession?.username });

//         return {
//             userData
//         }

//     } catch (error) {
//         console.log('fetching user Data error :', error);
//     }
// }

// user orders
const fetchUserOrderData = async (email) => {
    try {

        if (!email) return null;

        // fetch user from Sanity.io
        const userEmailQuery = `*[_type == 'user' && email == $email][0]`;
        const fetchUserData = await client.fetch(userEmailQuery, { email });
        const userId = fetchUserData ? fetchUserData._id : null;
        // fetch order by userId
        const fetchOrdersQuery = `*[_type == 'order' && user._ref == $userId] | order(_createdAt desc)`;
        const orders = await client.fetch(fetchOrdersQuery, { userId });

        return {
            orders,
        };

    } catch (error) {
        console.log('fetchOrdersData error :', error);
    }
}

function OrderPage() {
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

    // user exists
    const setUser = useSelector((state) => state.user);

    useEffect(() => {
        if (!setUser) {
            window.location.href = '/login';
            return router.push('/login');
        }
    }, [router, setUser])

    // eslint-disable-next-line no-unused-vars
    const { data, error } = useQuery('orders', () => fetchUserOrderData(setUser && setUser.email), {
        enabled: setUser && setUser.email !== undefined,
    })

    if (error) {
        console.log("Error for fetching user data :", error);
    }


    // const { data: session } = useSession();
    // useEffect(() => {
    //     if (!session) {
    //         window.location.href = '/login'
    //         return router.push('/login');
    //     }
    // }, [session]);

    // const { data: user, error: error2 } = useQuery('users-orders', () => fetchData(setUser?.email), {
    //     enabled: setUser?.user !== undefined,
    // })

    // if (error2) {
    //     console.log("Error for fetching user data :", error2);
    // }

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

    // orders items
    const order = useSelector((state) => state.order);

    const sortItems = orderBy(order.orderItems, ['_createdAt'], ['desc']);

    // console.log(orders)

    // useEffect(() => {
    //     if (!setUser) {
    //         router.push('/login')
    //     }
    // }, [setUser])

    // home button
    const handleGoHomeButton = () => {
        return router.push('/');
    }
    return (
        <>
            <CommonHead title="Order Items - WishBin Store | Online Shopping site in India" />
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
                                    <h3 className='text-[1.5rem] font-[600] text-black dark:text-[#BABECD]'>Your Orders</h3>
                                    {/* line */}
                                    <div className='w-full h-[1px] bg-[#d5dbdb] dark:bg-[#96a0a5cc]/40 my-[1rem]'></div>
                                    {
                                        order.orderItems && order.orderItems.length > 0 &&
                                        <div className='w-full h-auto flex flex-col gap-[20px]'>
                                            {/* orders items list */}
                                            {sortItems.map((item, index) => (
                                                <OrderItems key={index} orders={item} user={setUser.username} />
                                            ))}
                                        </div>
                                    }
                                    {/* empty orders */}
                                    {
                                        order.orderItems && order.orderItems.length < 1 && (
                                            <div className='w-full h-full'>
                                                {/* images */}
                                                <Image src='/orderEmpty.png' alt='empty-orders' width={420} height={300} className='w-full xs:h-[300px] h-[200px] object-contain' />
                                                {/* contents */}
                                                <div className='xs:mt-[3rem] mt-[2rem] flex items-center justify-center flex-col'>
                                                    <h1 className='xs:text-[2rem] text-[24px] font-[500] text-black dark:text-[#BABECD]'>No orders found!</h1>
                                                    <p className='text-[#96a0a5] mt-[0.4rem] xs:mb-[1rem] mb-[0.7rem] xs:text-[1.10rem] mobile:text-[15px] text-[14px]'>Explore some items and purchased It</p>
                                                    {/* button */}
                                                    <button onClick={() => handleGoHomeButton()} type='button' role='button' aria-label='continue-shopping' className='md:w-[340px] text-[18px] shadow-[0_2px_4px_rgba(0,0,0,0.3)] hover:shadow-none w-full h-[50px] bg-[#101219] hover:opacity-75 text-white dark:text-[#BABECD] flex items-center justify-center gap-[10px] p-[0.5rem_1.4rem] rounded-[6px]'>
                                                        <FaPlus size={18} />
                                                        Buy some items
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

export default OrderPage