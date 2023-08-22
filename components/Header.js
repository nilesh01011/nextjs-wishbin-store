/* eslint-disable react/prop-types */
'use client'

import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { FaUserSecret, FaShippingFast, FaShoppingCart, FaHeart } from 'react-icons/fa'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import { useRouter, usePathname } from 'next/navigation'
import { useSelector } from 'react-redux'
// import { useSession } from 'next-auth/react'

function Header({ navbar, sticky, smallScreenSticky }) {
    // next-auth session
    // const { data: session } = useSession();

    // console.log(session)

    // console.log(session.user);

    // console.log(session?.user?.tokens);

    // useEffect(() => {
    //     if (session) {
    //         isAuth(session.token);
    //     }
    // }, [session])

    // console.log(session)

    // const dispatch = useDispatch();
    // sidebar navigation
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const router = useRouter();

    const pathname = usePathname();

    // product in wishlist counter
    const { wishlistItems } = useSelector((state) => state.wishlist);

    // product in cart counter
    const { cartItems } = useSelector((state) => state.cart);

    // order in items
    const orders = useSelector((state) => state.order);

    // user exists
    const setUser = useSelector((state) => state.user);

    // console.log(orders)

    // handle sidebar open
    const [isOpen, setIsOpen] = useState(false);

    const handleOpen = () => {
        setSidebarOpen(true);
        setIsOpen(true)
    }

    useEffect(() => {
        // eslint-disable-next-line no-undef
        const bodyElement = document.querySelector('body');

        if (bodyElement) {
            if (isOpen) {
                bodyElement.classList.add('sidebar-open');
            } else {
                bodyElement.classList.remove('sidebar-open');
            }
        }
    }, [isOpen]);

    return (
        <>
            <div className={`w-full bg-white dark:bg-[#14161D] ${sticky === true ? 'sticky top-0' : `${smallScreenSticky && smallScreenSticky === true ? 'slg:static sticky top-0' : ''}`} z-[9998]`}>
                <div className={`max-w-[1366px] mx-auto w-full h-full py-[0.7rem] dark:text-white/60 flex items-center justify-between xl:px-[3rem] xs:px-[1.5rem] px-[1rem]`}>
                    {/* bg-[#e7edef] */}
                    {/* left side */}
                    <div className='w-max h-full flex items-center gap-[1rem]'>
                        {/* sidebar button */}
                        <button aria-label="sidebar button" onClick={() => handleOpen()} type='button' role='button' className='sidebar-btn w-[28px] flex group items-center flex-col gap-[6px] cursor-pointer'>
                            <span className='w-full h-[4px] rounded-[2px] bg-black/80 group-hover:bg-black dark:bg-[#BABECD]/80 dark:group-hover:bg-[#BABECD]'></span>
                            <span className='w-full h-[4px] rounded-[2px] bg-black/80 group-hover:bg-black dark:bg-[#BABECD]/80 dark:group-hover:bg-[#BABECD]'></span>
                            <span className='w-full h-[4px] rounded-[2px] bg-black/80 group-hover:bg-black dark:bg-[#BABECD]/80 dark:group-hover:bg-[#BABECD]'></span>
                        </button>
                        {/* user profile page button */}

                        {/* user exists */}
                        {
                            setUser ? (
                                <Link href='/userProfile' onClick={() => router.push('/userProfile')} title={`${setUser.username} your profile account`} className='w-max cursor-pointer flex items-center justify-center flex-col relative'>
                                    <FaUserSecret size={26} className={`${pathname === '/userProfile' ? 'dark:text-[#BABECD] text-black' : 'dark:text-[#BABECD]/80 dark:hover:text-[#BABECD] text-black/80 hover:text-black'}`} />
                                    {
                                        (pathname === '/userProfile' || pathname && pathname.startsWith('/userdataupdate') || pathname && pathname.startsWith('/uploadImage')) &&
                                        (<span className='absolute -bottom-[12px] h-[4px] w-[40%] rounded-[5px] bg-[#fd5555]'></span>)
                                    }
                                </Link>
                            ) : (
                                <Link href='/login' onClick={() => router.push('/login')} title={`login is required`} className='w-max cursor-pointer'>
                                    <FaUserSecret size={26} className='dark:text-[#BABECD]/80 dark:hover:text-[#BABECD] text-black/80 hover:text-black' />
                                </Link>
                            )
                        }
                    </div>
                    {/* middle side */}
                    <Link href='/' onClick={() => router.push('/')} title={`Home page`} className={`${pathname === '/' ? 'border-black dark:border-[#BABECD] dark:text-[#BABECD] text-black' : 'border-black/80 hover:border-black dark:hover:border-[#BABECD] hover:text-black dark:hover:text-[#BABECD] dark:border-[#BABECD]/80 dark:text-[#BABECD]/80 text-black/80'} w-[40px] h-[40px] rounded-full border-[2px] flex items-center justify-center font-bold cursor-pointer`}>
                        WB
                    </Link>
                    {/* right side */}
                    <div className='sm:w-[143px] flex items-center justify-between gap-[1rem]'>

                        {/* wishlist page button */}
                        <Link href={`${setUser ? '/wishlist' : '/login'}`}
                            title={`${setUser ? 'Click to visit the Wishlist page' : 'Login required for Wishlist page'}`}
                            className='flex flex-col items-center justify-center cursor-pointer gap-[3px] group relative'>
                            {/* icons */}
                            <span className='relative'>
                                <FaHeart size={18} className={`${pathname === '/wishlist' ? 'text-black dark:text-[#BABECD]' : 'text-black/80 group-hover:text-black dark:text-[#BABECD]/80 dark:group-hover:text-[#BABECD]'}`} />
                                {
                                    wishlistItems ? (
                                        wishlistItems.length > 0 && (
                                            <div className={`absolute flex items-center justify-center -top-[4px] -right-[10px] text-white w-[15px] h-[15px] rounded-full text-[10px] bg-[#fd5555] transition-[all_0.4s_cubic_bezier(0.46,0.03,0.52,0.96)]`}>
                                                {wishlistItems.length}
                                            </div>
                                        )
                                    ) : ('')
                                }
                            </span>

                            {/* text */}
                            <small className={`1x1:text-[14px] text-[12px] font-semibold ${pathname === '/wishlist' ? 'text-black dark:text-[#BABECD]' : 'text-black/80 group-hover:text-black dark:text-[#BABECD]/80 dark:group-hover:text-[#BABECD]'}`}>Wishlist</small>
                            {
                                pathname === '/wishlist' &&
                                <span className='absolute -bottom-[6px] h-[4px] w-[40%] rounded-[5px] bg-[#fd5555]'></span>
                            }
                        </Link>

                        {/* orders page button */}
                        {
                            setUser ? (
                                <Link href="/orders" title="Click to visit the Orders page"
                                    className='flex flex-col items-center justify-center cursor-pointer gap-[3px] group relative'>
                                    {/* icons */}
                                    <span className='relative'>
                                        <FaShippingFast size={18} className={`${pathname === '/orders' ? 'text-black dark:text-[#BABECD]' : 'text-black/80 group-hover:text-black dark:text-[#BABECD]/80 dark:group-hover:text-[#BABECD]'}`} />
                                        {
                                            orders.orderItems ? (
                                                orders.orderItems.length > 0 && (
                                                    <div className="absolute flex items-center justify-center -top-[4px] -right-[10px] text-white w-[15px] h-[15px] rounded-full text-[10px] bg-[#fd5555] transition-[all_0.4s_cubic_bezier(0.46,0.03,0.52,0.96)]">
                                                        {orders.orderItems.length}
                                                    </div>
                                                )
                                            ) : ('')
                                        }
                                    </span>

                                    {/* text */}
                                    <small className={`1x1:text-[14px] text-[12px] font-semibold ${pathname === '/orders' ? 'text-black dark:text-[#BABECD]' : 'text-black/80 group-hover:text-black dark:text-[#BABECD]/80 dark:group-hover:text-[#BABECD]'}`}>Orders</small>
                                    {
                                        (pathname === '/orders' || pathname && pathname.startsWith('/orders/')) &&
                                        (<span className='absolute -bottom-[6px] h-[4px] w-[40%] rounded-[5px] bg-[#fd5555]'></span>)
                                    }
                                </Link>
                            ) : (
                                <Link href="/login" title="Login required for Orders page" className='flex flex-col items-center cursor-pointer gap-[3px] group'>
                                    {/* icons */}
                                    <span className='relative'>
                                        <FaShippingFast size={18} className={`${pathname === '/orders' ? 'text-black dark:text-[#BABECD]' : 'text-black/80 group-hover:text-black dark:text-[#BABECD]/80 dark:group-hover:text-[#BABECD]'}`} />
                                    </span>

                                    {/* text */}
                                    <small className={`1x1:text-[14px] text-[12px] font-semibold ${pathname === '/orders' ? 'text-black dark:text-[#BABECD]' : 'text-black/80 group-hover:text-black dark:text-[#BABECD]/80 dark:group-hover:text-[#BABECD]'}`}>Orders</small>
                                </Link>
                            )
                        }

                        {/* cart page button */}
                        <Link href='/cart' title="Click to visit the CartItems page"
                            className='flex flex-col items-center justify-center cursor-pointer gap-[3px] group relative'>
                            {/* icons */}
                            <span className='relative'>
                                <FaShoppingCart size={18} className={`${pathname === '/cart' ? 'text-black dark:text-[#BABECD]' : 'text-black/80 group-hover:text-black dark:text-[#BABECD]/80 dark:group-hover:text-[#BABECD]'}`} />
                                {cartItems.length > 0 && (
                                    <div className="absolute flex items-center justify-center -top-[4px] -right-[10px] text-white w-[15px] h-[15px] rounded-full text-[10px] bg-[#fd5555] transition-[all_0.4s_cubic_bezier(0.46,0.03,0.52,0.96)]">
                                        {cartItems.length}
                                    </div>
                                )}
                            </span>
                            {/* text */}
                            <small className={`1x1:text-[14px] text-[12px] font-semibold ${pathname === '/cart' ? 'text-black dark:text-[#BABECD]' : 'text-black/80 group-hover:text-black dark:text-[#BABECD]/80 dark:group-hover:text-[#BABECD]'}`}>Cart</small>
                            {
                                (pathname === '/cart' || pathname && pathname.startsWith('/checkout-summary')) &&
                                (<span className='absolute -bottom-[6px] h-[4px] w-[40%] rounded-[5px] bg-[#fd5555]'></span>)
                            }
                        </Link>
                    </div>
                </div>
            </div>

            {/* nav tabs */}
            {
                navbar === false ? ('') :
                    (
                        <Navbar />
                    )
            }

            {/* sidebar */}
            <Sidebar setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen} setIsOpen={setIsOpen} isOpen={isOpen} />
        </>
    )
}

export default Header