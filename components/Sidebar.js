/* eslint-disable react/prop-types */
/* eslint-disable no-async-promise-executor */
/* eslint-disable no-undef */
import { orderNotFound } from '../slices/orderSlice';
import { clearUser } from '../slices/userSlice';
// import { getUserDataFromCookies } from '../utils/cookiesAuth';
// import Cookies from 'js-cookie';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { FiChevronRight, FiLogOut } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';
// import { useSession, signOut, getSession } from 'next-auth/react';
// import { mutate } from 'swr';
import { emptyWishlistItems } from '../slices/wishlistSlice';
import { emptyCart } from '../slices/cartSlice';

function Sidebar({ sidebarOpen, setSidebarOpen, setIsOpen }) {
    // next-auth session
    // const { data: session } = useSession();

    // dummy admin state
    // const [isAdmin, setIsAdmin] = useState(false);
    const dispatch = useDispatch();

    // user exists
    const setUser = useSelector((state) => state.user);
    // user exists
    // const User = Cookies.get('userInfo');
    // const [getUser, setUser] = useState([])

    // useEffect(() => {
    //     if (User) {
    //         setUser(JSON.parse(User));
    //     }
    // }, [User])

    // sidebar items
    const sideBarContents = [
        {
            id: 1,
            title: 'Deals of the Day',
            lists: [
                {
                    id: 1.1,
                    name: 'Best Sellers',
                    links: '/bestseller'
                },
                {
                    id: 1.2,
                    name: 'New Released',
                    links: '/'
                },
                {
                    id: 1.3,
                    name: 'Category to Bag',
                    links: '/bestseller'
                    // links: '/'
                },
            ],
            isArrowIcons: false
        },
        {
            id: 2,
            title: 'Digital Devices',
            lists: [
                {
                    id: 2.1,
                    name: 'Fire TV',
                    // links: '/'
                },
                {
                    id: 2.2,
                    name: 'Mobiles',
                    links: '/mobile'
                },
                {
                    id: 2.3,
                    name: 'Laptop',
                    // links: '',
                    itemsList: [
                        {
                            id: 21,
                            items: 'Dell Alienware',
                            goToLinks: '/product-details/7a13c8da-9ee3-41eb-8d0f-7b7987e125b3'
                        },
                        {
                            id: 22,
                            items: 'ASUS ROG Laptop',
                            goToLinks: '/product-details/2cf4269f-45fe-4fc6-bb02-2c14d065da7a'
                        }
                    ]
                },
                {
                    id: 2.4,
                    name: 'Computer & Accessories',
                    links: '/computer'
                },
            ],
            isArrowIcons: true
        },
        {
            id: 3,
            title: 'Indian Wear',
            lists: [
                {
                    id: 3.1,
                    name: "Men's Fashion",
                    links: '/cloths'
                },
                {
                    id: 3.2,
                    name: "Women's Fashion",
                    links: '/cloths'
                },
                {
                    id: 3.3,
                    name: "Kid's Fashion",
                    links: '/baby-cloths'
                },
            ],
            isArrowIcons: true
        },
        {
            id: 4,
            title: 'Help & Settings',
            lists: [
                {
                    id: 4.1,
                    name: "Your Account",
                    links: '/userProfile'
                },
                {
                    id: 4.2,
                    name: "Customer Service"
                },
                {
                    id: 4.3,
                    name: "Contact Us",
                    links: '/contact'
                },
            ],
            isArrowIcons: true
        }
    ];

    const { theme } = useTheme();

    const [isTheme, setIsTheme] = useState('');

    useEffect(() => {

        if (theme === 'light') {
            setIsTheme('light')
        }

        if (theme === 'dark') {
            setIsTheme('dark')
        }
    }, [theme]);

    const router = useRouter();
    const [isCollapse, setIsCollapse] = useState(false);
    const [isId, setIsId] = useState(0)

    // link redirection
    const handleLinksRouter = (links) => {
        if (links && links) {
            router.push(links)
        }

        setSidebarOpen(false);
        setIsOpen(false)
    }

    // logout cookies
    const handleLogout = (e) => {
        e.preventDefault();

        function logoutUser() {
            return new Promise(async (resolve, reject) => {
                try {
                    const userLogout = setTimeout(async () => {
                        dispatch(clearUser());
                        // Cookies.remove('userInfo');
                        dispatch(orderNotFound());
                        // sidebar closed
                        setSidebarOpen(false);
                        setIsOpen(false);
                        // wishlist empty
                        dispatch(emptyWishlistItems());
                        // next-auth
                        // await signOut({ callbackUrl: '/login' });
                        // empty cartItems
                        dispatch(emptyCart())
                        router.push('/login');
                    }, 1000);

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

    // handle close sidebar events
    const handleClose = () => {
        setSidebarOpen(false);
        setIsOpen(false)
    }

    return (
        <>
            {/* toaster */}
            <div className='fixed top-0 z-[99999]'>
                <Toaster />
            </div>
            {/* overflow */}
            {
                sidebarOpen === true &&
                <div onClick={() => handleClose()} className='w-full h-screen fixed top-0 left-0 right-0 bottom-0 bg-black/80 z-[9999] cursor-pointer'>
                </div>
            }
            {/* sidebar contents */}
            <div className={`fixed top-0 ${sidebarOpen === true ? 'left-0' : '-left-[200%]'} transition-all duration-500 xs:w-[360px] w-[80%] h-screen bg-white dark:bg-[#14161D] z-[9999] shadow-[0_0_15px_rgba(0,0,0,0.2)]`}>
                {/* top cancel icons */}
                <div onClick={() => handleClose()} className='absolute top-[6%] -right-[14%]'>
                    {/* h-[56px]  p-[1rem_1.6rem] */}
                    <span id='showDelayButton' className={`text-black dark:text-white text-[35px] cursor-pointer ${sidebarOpen === true ? 'showDelayButton' : ''}`}>
                        {/* &times; */}
                        <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M0.21967 0.519658C0.512563 0.226764 0.987437 0.226764 1.28033 0.519658L12 11.2393L22.7197 0.519658C23.0126 0.226765 23.4874 0.226765 23.7803 0.519658C24.0732 0.812552 24.0732 1.28743 23.7803 1.58032L13.0607 12.3L23.7803 23.0197C24.0732 23.3126 24.0732 23.7874 23.7803 24.0803C23.4874 24.3732 23.0126 24.3732 22.7197 24.0803L12 13.3606L1.28033 24.0803C0.987438 24.3732 0.512564 24.3732 0.219671 24.0803C-0.0732226 23.7874 -0.0732226 23.3126 0.219671 23.0197L10.9393 12.3L0.21967 1.58032C-0.0732233 1.28742 -0.0732233 0.812551 0.21967 0.519658Z" fill="white" />
                        </svg>
                    </span>
                </div>
                {/* overflow contents */}
                <div className='w-full h-full overflow-scroll overflow-x-hidden pt-[40px]'>
                    <div className=''>
                        {/* contents */}
                        <div className='w-full divide-y-[1px] divide-[#d5dbdb] dark:divide-[#353740]'>

                            {
                                sideBarContents.map((ele) => {
                                    const { id, title, lists, isArrowIcons } = ele;

                                    return (
                                        <div key={id} className={`w-full ${id === 1 ? 'pb-[20px]' : 'py-[20px]'}`}>
                                            {/* titles */}
                                            <h6 className='text-[19px] font-bold pl-[36px] pb-[10px] dark:text-[#BABECD] text-black'>{title}</h6>
                                            {/* content lists */}
                                            <div className='w-full'>
                                                {
                                                    lists.map((list) => {
                                                        const { id, name, itemsList, links } = list
                                                        return (
                                                            <div key={id} className='w-full h-auto'>
                                                                <div onClick={() => { handleLinksRouter(links), setIsCollapse(!isCollapse), setIsId(id) }} className={`h-full group cursor-pointer flex items-center justify-between py-[12px] pl-[36px] pr-[18px] ${isId === id && itemsList && isCollapse === true ? 'bg-[#eaeded] dark:bg-[#262936]' : ''} ${isTheme === 'light' ? 'hover:bg-[#eaeded]' : 'hover:bg-[#262936]'} '}`}>
                                                                    {/* text */}
                                                                    <div className='text-[16px] w-full h-auto text-[#96a0a5] group-hover:text-black dark:group-hover:text-[#96a0a5]'>
                                                                        {name}
                                                                    </div>
                                                                    {/* icons */}
                                                                    {
                                                                        isArrowIcons === true &&
                                                                        <span>
                                                                            <FiChevronRight size={20} className={`font-bold text-[#96a0a5] group-hover:text-black dark:group-hover:text-[#96a0a5] transition-all duration-300 ${isId === id && itemsList ? isCollapse === true ? 'rotate-90' : '' : ''}`} />
                                                                        </span>
                                                                    }
                                                                </div>

                                                                <div className='h-full w-full select-none mt-1'>
                                                                    {
                                                                        itemsList && isId === id && isCollapse === true && itemsList.map((item) => {
                                                                            return (
                                                                                <div onClick={() => { router.push(item.goToLinks), setSidebarOpen(false) }} key={item.id} className='w-full group h-max py-[12px] pl-[46px] pr-[18px] flex items-center justify-between hover:bg-[#eaeded] dark:hover:bg-[#262936]'>
                                                                                    <span className='text-[#96a0a5] group-hover:text-black dark:group-hover:text-[#96a0a5] text-[14px] cursor-pointer w-full'>{item.items}</span>
                                                                                    {/* icons */}
                                                                                    <span>
                                                                                        <FiChevronRight size={20} className="font-bold text-[#96a0a5] group-hover:text-black dark:group-hover:text-[#96a0a5]" />
                                                                                    </span>
                                                                                </div>
                                                                            )
                                                                        })

                                                                    }
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </div>
                                    )
                                })
                            }

                            {/* admin user */}
                            {
                                setUser && setUser.isAdmin === true &&
                                <div className='w-full py-[20px]'>
                                    {/* titles */}
                                    <h6 className='text-[19px] font-bold pl-[36px] pb-[10px] dark:text-[#BABECD]'>Dashboard</h6>
                                    {/* content lists */}
                                    <div className='w-full'>
                                        <div onClick={() => router.push('/studio')} className='h-[44px] group cursor-pointer flex items-center justify-between pl-[36px] pr-[18px] hover:bg-[#eaeded] dark:hover:bg-[#262936]'>
                                            {/* text */}
                                            <span className='text-[16px] text-[#96a0a5] group-hover:text-black dark:group-hover:text-[#96a0a5]'>Sanity Dashboard</span>
                                            {/* icons */}
                                            <span>
                                                <FiChevronRight size={20} className="font-bold text-[#96a0a5] group-hover:text-black dark:group-hover:text-[#96a0a5]" />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            }

                            {/* Accounts */}
                            {
                                setUser ? (
                                    // User ? (
                                    <div className='w-full py-[23px] sm:pb-[23px] pb-[5rem]'>
                                        <button onClick={(e) => handleLogout(e)} type='button' aria-label="logout" role='button' title='logout' className='logout-btn w-full text-[#ea5455] hover:bg-[#eaeded] dark:hover:bg-[#262936] font-semibold flex items-center gap-[0.5rem] pl-[36px] py-[12px]'>
                                            <span>
                                                <FiLogOut size={18} />
                                            </span>
                                            Logout
                                        </button>
                                    </div>
                                ) : (
                                    <div className='w-full py-[20px] sm:pb-[20px] pb-[5rem]'>
                                        {/* titles */}
                                        <h6 className='text-[19px] font-bold pl-[36px] pb-[10px] dark:text-[#BABECD]'>Accounts</h6>
                                        {/* content lists */}
                                        <div className='w-full'>
                                            <div onClick={() => router.push('/register')} className='h-max group cursor-pointer flex items-center justify-between pl-[36px] pr-[18px] py-[12px] hover:bg-[#eaeded] dark:hover:bg-[#262936]'>
                                                {/* text */}
                                                <span className='text-[16px] text-[#96a0a5] group-hover:text-black dark:group-hover:text-[#96a0a5]'>Sign Up</span>
                                                {/* icons */}
                                                <span>
                                                    <FiChevronRight size={20} className="font-bold text-[#96a0a5] group-hover:text-black dark:group-hover:text-[#96a0a5]" />
                                                </span>
                                            </div>

                                            <div onClick={() => router.push('/login')} className='h-max group cursor-pointer flex items-center justify-between pl-[36px] pr-[18px] py-[12px] hover:bg-[#eaeded] dark:hover:bg-[#262936]'>
                                                {/* text */}
                                                <span className='text-[16px] text-[#96a0a5] group-hover:text-black dark:group-hover:text-[#96a0a5]'>Sign In</span>
                                                {/* icons */}
                                                <span>
                                                    <FiChevronRight size={20} className="font-bold text-[#96a0a5] group-hover:text-black dark:group-hover:text-[#96a0a5]" />
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Sidebar;