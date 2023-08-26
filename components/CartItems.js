/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import { deleteFromCart, updateCart } from '../slices/cartSlice';
import Image from 'next/image';
import React, { useState } from 'react'
import { FaHeart, FaRegHeart, FaRegTrashAlt, FaTrashAlt } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { addToWishlistItems } from '../slices/wishlistSlice';
import { v4 as uuidv4 } from 'uuid';
import { client } from '../sanity';
// import { useSession } from 'next-auth/react';

// get unique identifier length of 6 for order ID
function generateShortUUID(length) {
    const uuid = uuidv4().replace(/-/g, ''); // Generate a standard UUID v4 and remove hyphens
    return uuid.substr(0, length); // Extract the desired number of characters
}

function CartItems({ product }) {
    const [addWishlistIcon, setAddWishlistIcon] = useState(false);
    const [removeCartIcons, setRemoveCartIcons] = useState(false);
    const router = useRouter();

    const dispatch = useDispatch();

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

    // product quantity update
    const updateCartItem = (e, key) => {
        let payload = {
            key,
            val: key === "quantity" ? parseInt(e.target.value) : e.target.value,
            id: product._id,
        };

        dispatch(updateCart(payload));
        // success notify
        toast.success(`${product.name} item updated by ${parseInt(e.target.value)}.`, {
            position: "top-center",
            autoClose: 7000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });
    };

    // product delete
    const handleCartDelete = (pro) => {
        dispatch(deleteFromCart({ id: pro._id }));

        // success notify
        toast.success(`${pro.name} item remove from your cart`, {
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

    // add to product in wishlist
    const handleAddToWishlist = async (ele) => {

        if (!setUser) {
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

        // const email = session ? session?.user?.email : null;
        // const email = setUser?.email;
        // const userEmailQuery = `*[_type == 'user' && email == $email][0]`;
        // const fetchUserData = await client.fetch(userEmailQuery, { email });
        // const userId = fetchUserData ? fetchUserData._id : null;
        const userId = setUser ? setUser._id : null

        const fetchWishlist = await client.fetch(`*[
            _type in ["wishlist", "user"] &&
            user._ref == $userId
          ]`, { userId })

        if (setUser) {
            // add wishlist item
            dispatch(addToWishlistItems({ ...ele }));
            // remove from cartItems
            dispatch(deleteFromCart({ id: ele._id }));

            // success notify
            toast.success(`${ele.name} item added to your Wishlist Items :)`, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });

            const isProductInWishlist = fetchWishlist.some((item) => item.product._ref === ele._id);

            if (isProductInWishlist) {
                return toast.error(`${ele.name} Product is already in your wishlist items`);
            }

            if (!isProductInWishlist) {
                const uniqueID = generateShortUUID(12); // Generate a unique ID for each order

                await client.create({
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

            }
        } else {
            // user not found notify
            toast.error(`!Please Login to your account to add Wishlist Items`, {
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
    }

    return (
        <>
            <div className='fixed top-0 z-[99999]'>
                <Toaster position="top-center"
                    reverseOrder={false}
                />
            </div>
            <div className='w-full h-auto flex lg:flex-row flex-col gap-[20px] text-black dark:text-[#BABECD]'>
                {/* product image */}
                <div className='lg:w-[20%] w-full bg-[#E7EDEF] dark:bg-[#101219]/30 rounded-[5px]'>
                    <Image
                        onClick={() => router.push(`/product-details/${product._id}`)}
                        src={product.image}
                        width={100}
                        height={120}
                        alt='product-image'
                        loading="lazy"
                        rel="none"
                        decoding="async"
                        title={product.name}
                        className='cursor-pointer w-full h-[120px] object-contain p-[1rem]' />
                </div>
                {/* product contents */}
                <div className='xl:w-[68%] lg:w-[65%] w-full flex flex-col gap-[15px]'>
                    {/* product description */}
                    <p
                        onClick={() => router.push(`/product-details/${product._id}`)}
                        className='text-[1.2rem] font-[500] text-black dark:text-[#BABECD] hover:underline cursor-pointer w-fit'>
                        {product.description.length >= 97 ? `${product.description.slice(0, 97)}...` : product.description}
                    </p>
                    <div className='w-full flex items-center divide-x-[1px] divide-[#d5d5d5] dark:divide-[#96a0a5cc]/40'>
                        {/* qty */}
                        <div className='w-max pr-[15px]'>
                            <select
                                className="w-max hover:text-black dark:hover:text-[#BABECD] outline outline-1 outline-[#aaa] p-[0.2rem_0.4rem] rounded-[3px] cursor-pointer m-0 text-[14px]"
                                onChange={(e) => updateCartItem(e, "quantity")}
                                value={product.quantity}
                            >
                                {Array.from({ length: product.qty || 0 }, (_, i) => i + 1).map((q, i) => (
                                    <option key={i} value={q}>
                                        {q}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {/* remove button */}
                        <div className='px-[15px]'>
                            <button type='button' onClick={() => handleCartDelete(product)} onMouseOver={() => setRemoveCartIcons(true)} onMouseLeave={() => setRemoveCartIcons(false)} role='button' aria-label='remove-cart' className='flex hover:text-[#D90202] items-center gap-[5px] text-[13px]'>
                                {
                                    removeCartIcons === true ? (
                                        <FaTrashAlt size={14} />
                                    ) : (
                                        <FaRegTrashAlt size={14} />
                                    )
                                }
                                Remove
                            </button>
                        </div>
                        {/* move to wishlist */}
                        <div className='pl-[15px]'>
                            <button type='button' role='button' onClick={() => handleAddToWishlist(product)} onMouseOver={() => setAddWishlistIcon(true)} onMouseLeave={() => setAddWishlistIcon(false)} aria-label='add-to-wishlist' className='hover:text-[#fd5555] flex items-center gap-[5px] text-[13px]'>
                                {
                                    addWishlistIcon === true ? (
                                        <FaHeart size={14} />
                                    ) : (
                                        <FaRegHeart size={14} />
                                    )
                                }
                                Move to Wishlist
                            </button>
                        </div>
                    </div>
                </div>
                {/* product prices */}
                <div className='xl:w-[12%] lg:w-[14%] w-full lg:text-right text-left'>
                    <span className='text-[1rem] font-[800] w-full'>₹{new Intl.NumberFormat().format(product.price)}</span>
                </div>
            </div>
        </>
    )
}

export default CartItems