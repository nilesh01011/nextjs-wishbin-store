/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
'use client'

import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
// image fetch with sanity and added to the imageURL builder
import imageUrlBuilder from '@sanity/image-url';
import toast, { Toaster } from 'react-hot-toast';
import Image from 'next/image';
import { FaRegTrashAlt, FaTrashAlt } from 'react-icons/fa';
import { deleteFromCart, updateCart } from '../slices/cartSlice';
// import { useSession } from 'next-auth/react';

const builder = imageUrlBuilder({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECTID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
})
const urlFor = (source) => builder.image(source);

// eslint-disable-next-line react/prop-types
function CheckoutCart({ product }) {

    // user exists
    // const { data: session } = useSession();

    // useEffect(() => {
    //     if (!session) return router.push('/login')
    // }, [session])

    // const User = Cookies.get('userInfo');
    // const [getUser, setUser] = useState([])

    // useEffect(() => {
    //     if (!User) return router.push('/login');

    //     if (User) {
    //         setUser(JSON.parse(User));
    //     }
    // }, [User])

    const dispatch = useDispatch();
    const [removeCartIcons, setRemoveCartIcons] = useState(false);

    // product quantity update
    const updateCartItem = (e, key, product) => {
        let payload = {
            key,
            val: key === "quantity" ? parseInt(e.target.value) : e.target.value,
            id: product._id,
        };

        dispatch(updateCart(payload));
        // success notify
        toast.success(`${product.name} item updated by ${parseInt(e.target.value)}.`, {
            position: "top-center",
            autoClose: 5000,
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

    return (
        <>
            <div className='fixed top-0 z-[99999]'>
                <Toaster position="top-center"
                    reverseOrder={false}
                />
            </div>

            {/* checkout carts */}
            <div className='w-full h-auto flex gap-[14px]'>
                {/* left side product image */}
                <div className='w-[20%] bg-[#E7EDEF] dark:bg-[#101219]/30 rounded-[5px]'>
                    <Image
                        src={urlFor(product.image).url()}
                        width={75} height={75} alt='product-image'
                        title={product.name}
                        className='w-full h-full max-h-[75px] object-contain p-[0.3rem]' />
                </div>
                {/* right side contents */}
                <div className='w-[80%] flex flex-col gap-[6px] justify-between'>
                    {/* product name */}
                    <p className='w-max font-semibold text-black dark:text-[#BABECD] text-[14px]'>{product.name}</p>

                    {/* qty and price */}
                    <div className='w-full flex items-end justify-between'>
                        {/* qty and delete event */}
                        <div className='flex items-center gap-[20px]'>
                            {/* qty */}
                            <div className='w-max mb-1'>
                                <select
                                    className="w-max hover:text-black dark:hover:text-[#BABECD] outline outline-1 outline-[#aaa] p-[0.2rem_0.4rem] rounded-[3px] cursor-pointer m-0 text-[14px]"
                                    onChange={(e) => updateCartItem(e, "quantity", product)}
                                    value={product.quantity}
                                >
                                    {Array.from({ length: product.qty || 0 }, (_, i) => i + 1).map((q, i) => (
                                        <option key={i} value={q}>
                                            {q}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {/* delete button */}
                            <div className='w-max'>
                                {/* handleCartDelete(product, product?.price) */}
                                <button type='button' onClick={() => handleCartDelete(product)} onMouseOver={() => setRemoveCartIcons(true)} onMouseLeave={() => setRemoveCartIcons(false)} role='button' aria-label='remove-cart' className='flex hover:text-[#D90202] text-black dark:text-[#BABECD] dark:hover:text-[#D90202] items-baseline gap-[5px] text-[14px]'>
                                    {
                                        removeCartIcons === true ? (
                                            <FaTrashAlt size={13} />
                                        ) : (
                                            <FaRegTrashAlt size={13} />
                                        )
                                    }
                                    Remove
                                </button>
                            </div>
                        </div>
                        {/* prices */}
                        <span className='text-[14px] font-[500] text-black dark:text-[#BABECD]'>₹{new Intl.NumberFormat().format(product.price)}</span>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CheckoutCart