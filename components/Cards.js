/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
/* eslint-disable no-inner-declarations */
/* eslint-disable no-undef */
/* eslint-disable no-async-promise-executor */
'use client'

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { FaHeart, FaPlus, FaRegHeart } from 'react-icons/fa';
import Rating from './Rating';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
// import Router from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../slices/cartSlice';
import toast, { Toaster } from 'react-hot-toast';
import { FiCheckCircle } from 'react-icons/fi';
import { addToWishlistItems, deleteFromWishlistItems } from '../slices/wishlistSlice';
import { client } from '../sanity';
import { v4 as uuidv4 } from 'uuid';
// import { useSession } from 'next-auth/react';

// get unique identifier length of 6 for order ID
function generateShortUUID(length) {
    const uuid = uuidv4().replace(/-/g, ''); // Generate a standard UUID v4 and remove hyphens
    return uuid.substr(0, length); // Extract the desired number of characters
}

function Cards({ cardsList }) {

    const router = useRouter();

    // const { data: session } = useSession();

    // user exists
    const setUser = useSelector((state) => state.user);

    // const User = Cookies.get('userInfo');
    // const [getUser, setUser] = useState([])

    // useEffect(() => {
    //     if (User) {
    //         setUser(JSON.parse(User));
    //     }
    // }, [User])

    // add to cart functionality
    const dispatch = useDispatch();

    const [isItemsInCart, setIsItemsInCart] = useState([])

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

        setIsItemsInCart((prevState) => {
            const newState = [...prevState];
            newState[ele._id] = true;
            return newState
        });

        setTimeout(() => {
            setIsItemsInCart((prevState) => {
                const newState = [...prevState];
                newState[ele._id] = false;
                return newState
            });
        }, 5000)
    }

    // wishlist functionality
    const { wishlistItems } = useSelector((state) => state.wishlist);

    const [wishlistBtn, setWishlistBtn] = useState(false);

    // add wishlist items
    const handleAddToWishlist = async (ele) => {

        if (!setUser.email) {
            return toast.error(`!Please Login to your account to add Wishlist Items`, {
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

        // ================= Fetch the user wishlist items ==============
        const userId = setUser ? setUser._id : null;
        // wishlist query
        const fetchWishlist = await client.fetch(`*[_type in ["wishlist", "user"] && user._ref == $userId]`, { userId });

        console.log('User wishlist:', fetchWishlist)

        // Add the new wishlist item to the same user's list
        if (setUser) {

            setWishlistBtn(true)

            const isProductInWishlist = fetchWishlist.some((item) => item.product._ref === ele._id);

            if (isProductInWishlist) {
                return toast.error(`Your ${ele.name} Product is already in your wishlist items`);
            }

            async function addWishlistItems() {
                return new Promise(async (resolve, reject) => {
                    try {

                        if (!isProductInWishlist) {
                            const uniqueID = generateShortUUID(12); // Generate a unique ID for each order

                            const result = await client.create({
                                _type: 'wishlist',
                                user: {
                                    _type: "reference",
                                    _ref: userId,
                                },
                                product: {
                                    _type: "reference",
                                    _ref: ele._id, // product id
                                },
                                wishlistId: uniqueID,
                            });

                            // disable button for a seconds
                            // setWishlistBtn(true);
                            // add wishlist item
                            dispatch(addToWishlistItems({ ...ele }));

                            resolve(result)
                        }
                    } catch (error) {
                        reject(error);
                        console.log('Error to add wishlist items', error)
                        toast.error('!Opps something went wrong to add your wishlist items.');
                    }
                });
            }

            toast.promise(
                addWishlistItems(),
                {
                    loading: 'Please wait...',
                    success: `${ele.name} item added to your Wishlist Items :)`,
                    error: '!Opps something went wrong to add your wishlist items.',
                }
            );
        }
    }

    // remove wishlist item
    const handleRemoveWishlist = async (ele) => {
        if (!setUser.email) {
            return toast.error(`!Please Login to your account to remove Wishlist Items`, {
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
            setWishlistBtn(true)
            async function removeWishlistItems() {
                return new Promise(async (resolve, reject) => {
                    try {
                        const userId = setUser ? setUser._id : null;

                        // const user = await client.getDocument(userId);

                        const fetchWishlist = await client.fetch(`*[
                            _type in ["wishlist", "user"] &&
                            user._ref == $userId
                          ]`, { userId });

                        // remove wishlist item
                        dispatch(
                            deleteFromWishlistItems({ id: ele._id })
                        );

                        fetchWishlist.filter(async (item) => {
                            if (item.product._ref === ele._id) {
                                console.log('fetchWishlist:', item._id)
                                return await client.delete(item._id);
                            }
                        });

                        // disable button for a seconds
                        // setWishlistBtn(true);

                        resolve(fetchWishlist);
                    } catch (error) {
                        reject(error);
                        console.log('Error to remove wishlist items', error)
                        toast.error('!Opps something went wrong to add your wishlist items.');
                    }
                })
            }

            toast.promise(
                removeWishlistItems(),
                {
                    loading: 'Please wait...',
                    success: `${ele.name} item remove from your Wishlist Items :)`,
                    error: '!Opps something went wrong to remove your wishlist items.',
                }
            );
        }

    }
    // disable wishlistBtn to false
    useEffect(() => {
        if (wishlistBtn === true) {
            // remove disable to wishlist button
            setTimeout(() => {
                setWishlistBtn(false);
                console.log('remove disabled wishlist')
            }, 2500)
        }
    }, [wishlistBtn])

    const [wishlistLightBtnClass, setWishlistLightBtnClass] = useState(false);
    const [wishlistDarkBtnClass, setWishlistDarkBtnClass] = useState(false);

    const { theme } = useTheme();

    useEffect(() => {

        if (theme === 'light') {
            setWishlistLightBtnClass(true)
        } else {
            setWishlistLightBtnClass(false)
        }

        if (theme === 'dark') {
            setWishlistDarkBtnClass(true)
        } else {
            setWishlistDarkBtnClass(false)
        }

    }, [wishlistLightBtnClass, wishlistDarkBtnClass, theme]);

    const [isLoadImage, setIsLoadImage] = useState(true);

    return (
        <>
            <div className='fixed top-0 z-[99999]'>
                <Toaster />
            </div>
            <div className='w-full h-full grid slg:grid-cols-4 sm:grid-cols-3 small:grid-cols-2 grid-cols-1 small:gap-y-[45px] gap-y-[36px] xl:gap-x-[56px] sm:gap-x-[20px] gap-x-[15px] pb-[40px] xl:px-[3rem] xs:px-[1.5rem] px-[1rem]'>
                {
                    cardsList && cardsList.map((ele) => {
                        const { _id, name, price, mrp, rating, categoryTitle } = ele;

                        const proPrice = new Intl.NumberFormat('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(price);
                        const proMrp = new Intl.NumberFormat('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(mrp);

                        let getWishlistId;

                        wishlistItems && wishlistItems.some((item) => {
                            if (item._id === ele._id) {
                                return getWishlistId = item._id;
                            }
                        });

                        return (
                            <div id='productCards'
                                key={_id}
                                className={`1x1:w-[260px] xl:w-[250px] sm:w-[90%] small:w-[93%] w-[73%] mx-auto ${categoryTitle} xl:p-[20px] sm:p-[18px_16px] xs:p-[20px] small:p-[18px_16px] p-[20px] h-max bg-white dark:bg-[#262936] rounded-[20px] group relative after:content-[""] after:absolute after:top-0 after:bottom-0 after:right-0 after:left-0 after:w-full after:h-full after:rounded-[20px] after:transition-[0.4s_cubic-bezier(0.46, 0.03, 0.52, 0.96)] after:opacity-0 before:absolute before:top-0 before:bottom-0 before:right-0 before:left-0 before:w-full before:h-full before:bg-[#d0e4e4] dark:before:bg-[#373b4d]`}
                            >
                                {/* wishlist buttons */}
                                {
                                    getWishlistId === ele._id ? (
                                        <button
                                            onClick={() => handleRemoveWishlist(ele)}
                                            aria-label="wishlist-btn"
                                            type='button'
                                            role="button"
                                            disabled={wishlistBtn}
                                            className={`add-to-wishlist ${wishlistBtn === true && 'cursor-not-allowed'} ${wishlistDarkBtnClass === true ? 'dark_theme' : ''} ${wishlistLightBtnClass === true ? 'light_theme' : ''} w-[35px] h-[35px] group relative group-hover:bg-[#e7edef] dark:group-hover:bg-[#101219] z-50 flex items-center justify-center ml-auto rounded-full lg:group-hover:shadow-[0_0_1px_#000]`}
                                            style={{ transition: 'all 0.3s cubic-bezier(0.46, 0.03, 0.52, 0.96)' }}
                                        >
                                            <FaHeart id='heart' size={18} className={`liked ${wishlistBtn === true ? 'text-[#fd5555]/80' : 'text-[#fd5555]'}`} />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleAddToWishlist(ele)}
                                            aria-label="wishlist-btn"
                                            type='button'
                                            role="button"
                                            disabled={wishlistBtn}
                                            className={`add-to-wishlist ${wishlistBtn === true && 'cursor-not-allowed'} ${wishlistDarkBtnClass === true ? 'dark_theme' : ''} ${wishlistLightBtnClass === true ? 'light_theme' : ''} w-[35px] h-[35px] group relative group-hover:bg-[#e7edef] dark:group-hover:bg-[#101219] z-50 flex items-center justify-center ml-auto rounded-full lg:group-hover:shadow-[0_0_1px_#000]`}
                                            style={{ transition: 'all 0.3s cubic-bezier(0.46, 0.03, 0.52, 0.96)' }}
                                        >
                                            {/* ${wishlistBtn === true ? 'cursor-not-allowed' : 'cursor-pointer'} */}
                                            {/* ${wishlistBtn === true ? 'text-gray-500' : 'lg:text-[#6c7878] lg:dark:text-[#BABECD] lg:group-hover:text-[#fd5555] text-[#fd5555]'} */}
                                            <FaRegHeart id='heart' className={`liked ${wishlistBtn === true ? 'text-gray-500' : 'lg:text-[#6c7878] lg:dark:text-[#BABECD] lg:group-hover:text-[#fd5555] text-[#fd5555]'} transition-colors`} size={18} />
                                        </button>
                                    )
                                }
                                {/* product images */}
                                <div className='productImage w-full flex items-center justify-center xl:h-[150px] md:h-[120px] smd:h-[90px] mobile:h-[120px] h-[100px] transition-all duration-100 lg:group-hover:-mt-[60px] group-hover:mb-[60px]'
                                    style={{ transition: '0.3s cubic-bezier(0.46, 0.03, 0.52, 0.96)' }}>
                                    <Image
                                        src={ele.image}
                                        alt={name}
                                        height={150}
                                        width={200}
                                        loading="lazy"
                                        decoding="async"
                                        quality={50}
                                        importance="high"
                                        rel="none"
                                        className={`w-full h-full max-h-40 object-contain z-[10] relative ${isLoadImage === true ? 'blur-sm' : ''}`}
                                        title={name}
                                        onLoadingComplete={() => setIsLoadImage(false)}
                                    />
                                </div>
                                {/* product title, price and rating */}
                                <div className='w-full z-50 relative'>
                                    {/* product title */}
                                    <h5 className='whitespace-nowrap overflow-hidden xl:text-[18px] lg:text-[16px] slg:text-[14px] md:text-[15px] smd:text-[16px] sm:text-[16px] mobile:text-[16px] small:text-[13px] text-[16px] xl:pt-[13px] pt-[8px] text-black dark:text-[#BABECD]'>
                                        {name.length >= 15 ? `${name.slice(0, 15)}...` : name}
                                    </h5>
                                    {/* product prices */}
                                    <div className='flex items-center gap-[10px] py-[4px] z-[50] overflow-hidden'>
                                        {/* #f16565 */}
                                        {/* lg:text-[15px] slg:text-[13px] md:text-[14px] smd:text-[13px] sm:text-[15px] mobile:text-[14px] small:text-[12px] text-[14px] */}
                                        <span className='lg:text-[15px] slg:text-[13px] smd:text-[14px] sm:text-[15px] mobile:text-[14px] small:text-[12px] text-[14px] font-[600] text-[#f16565]'>₹{proPrice}</span>
                                        <span className='lg:text-[15px] slg:text-[13px] smd:text-[14px] sm:text-[15px] mobile:text-[14px] small:text-[12px] text-[14px] font-[500] line-through text-[#858999]'>₹{proMrp}</span>
                                    </div>
                                    {/* product rating */}
                                    <div role='text' className='flex items-center mt-1 gap-[0.3rem] z-[60] relative'>
                                        <Rating rating={rating} />
                                    </div>
                                </div>
                                {/* add to cart button */}
                                <button
                                    onClick={() => handleAddToCart(ele, price)}
                                    aria-label="add-to-cart"
                                    type='button'
                                    role='button'
                                    disabled={isItemsInCart[ele._id]}
                                    className={`add-to-cart absolute flex items-center justify-center shadow-[0_2px_4px_rgba(0,0,0,0.3)] gap-[5px] lg:text-[16px] mobile:text-[14px] text-[13px] z-[1] w-[85%] mx-auto h-[45px] xl:group-hover:bottom-[108px] lg:group-hover:bottom-[103px] smd:bottom-[95px] xs:bottom-[100px] mobile:bottom-[95px] small:bottom-[90px] bottom-[98px] lg:-bottom-[5px] lg:group-hover:scale-[1] lg:scale-[0.8] scale-[1] lg:group-hover:opacity-[1] lg:opacity-0 opacity-[1] text-white font-bold left-0 right-0 rounded-[5px] ${isItemsInCart[ele._id] ? 'bg-[#52A382]' : 'bg-[#fd5555] hover:bg-[#f34545ef]'} flex items-center justify-center`}
                                    style={{
                                        transition: '0.3s cubic-bezier(0.46, 0.03, 0.52, 0.96)',
                                    }}
                                >
                                    {/* Add to Card */}
                                    {
                                        isItemsInCart[ele._id] &&
                                        <FiCheckCircle id="atc_btn_icons" size={16} className={`${isItemsInCart[ele._id] ? 'active' : ''}`} />
                                    }
                                    {/* Text */}
                                    {
                                        isItemsInCart[ele._id] ? 'Added' : 'Add to Cart'
                                    }
                                </button>
                                {/* product details button */}
                                <div className='absolute z-50 -bottom-[30px] sm:-right-[30px] small:-right-[20px] -right-[35px] xl:w-[80px] xl:h-[80px] mobile:w-[70px] mobile:h-[70px] small:w-[60px] small:h-[60px] w-[70px] h-[70px] rounded-full bg-[#e7edef] dark:bg-[#101219] flex items-center justify-center cursor-pointer'>
                                    <button role='button' onClick={() => router.push(`/product-details/${_id}`)} aria-label="product-details-page-btn" type='button' className='card_btn xl:w-[55px] xl:h-[55px] mobile:w-[45px] mobile:h-[45px] small:w-[37px] small:h-[37px] w-[45px] h-[45px] rounded-full bg-white dark:bg-[#858999] flex items-center justify-center group-hover:animate-cards-pulse'>
                                        <FaPlus className='text-black lg:text-[16px] md:text-[15px] text-[14px]' />
                                        <style jsx>
                                            {`
                                            .card_btn {
                                                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
                                            }
                                        `}
                                        </style>
                                    </button>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </>
    )
}

export default Cards