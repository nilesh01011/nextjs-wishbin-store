/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-async-promise-executor */
/* eslint-disable no-undef */
'use client'

import CommonHead from '../components/CommonHead';
import { loginSchema } from '../formikSchema';
import { client } from '../sanity';
import { setUser } from '../slices/userSlice';
import { useFormik } from 'formik';
import Link from 'next/link';
import Router from 'next/router';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import {
    // FaApple,
    // FaLongArrowAltLeft,
    FaRegEye,
    FaRegEyeSlash
} from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import bcrypt from 'bcryptjs';
import toast, { Toaster } from 'react-hot-toast';
// import { signIn } from 'next-auth/react';
import LoadingButton from '../components/LoadingButton';
import { MdMail, MdMailOutline } from 'react-icons/md';
import { TiArrowBack } from 'react-icons/ti';
import { setUserDataCookie } from '../utils/cookiesAuth';
import Loading from '../components/Loading';
import { addToWishlistItems } from '../slices/wishlistSlice';
import { addOrderItems } from '../slices/orderSlice';

const notify = () => {
    toast.error("!!Opps your email Id and password is invalid :(", {
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

const initialValues = {
    email: "",
    password: "",
}

function LoginPage() {
    const [loading, setLoading] = useState(false);

    Router.events.on("routeChangeStart", () => {
        console.log("Route is staring...")
        setLoading(true)
    })

    Router.events.on("routeChangeComplete", () => {
        console.log("Route is completed...")
        setLoading(false)
    })

    const [addMailIcon, setAddMailIcon] = useState(false);
    // store to redux
    const dispatch = useDispatch();
    // router
    const router = useRouter();

    // popup open state
    const [isOpenPopup, setIsOpenPopup] = useState(false);

    // password useState
    const [passwordOpen, setPasswordOpen] = useState(false);

    // when user clicks to submit button hold for a time
    const [busy, setBusy] = useState(false);

    // useFormik
    const { values, errors, touched, handleBlur, handleChange, handleSubmit } = useFormik({
        validationSchema: loginSchema,
        initialValues: initialValues,
        onSubmit: async (values, action) => {
            setBusy(true);

            function loginCredentials() {
                return new Promise(async (resolve, reject) => {
                    try {
                        const checkoutCart = setTimeout(async () => {
                            const user = await client.fetch(`*[_type == "user" && email == $email][0]`, {
                                email: values.email,
                            });

                            const userId = user ? user._id : null;
                            // ================ NextAuth ===================
                            // const userLogin = await signIn('credentials', {
                            //     redirect: false,
                            //     email: values.email,
                            //     password: values.password,
                            //     callbackUrl: '/'
                            // });

                            // if (userLogin.ok === true) {
                            //     // Set the user data cookies
                            //     // Dispatch the setUser action to update the user data
                            //     dispatch(setUser(user));
                            //     // redirect to home page
                            //     router.push(userLogin.url);

                            //     setBusy(false)
                            // }
                            // ================= Custom Auth ====================

                            if (user && bcrypt.compareSync(values.password, user.passwordProtect)) {
                                // Set the user data cookies
                                setUserDataCookie(user);
                                // Dispatch the setUser action to update the user data
                                dispatch(setUser(user));
                                // next-auth
                                // signIn();
                                setBusy(false);

                                // fetch order by userId
                                const fetchOrdersQuery = `*[_type == 'order' && user._ref == $userId] | order(_createdAt desc)`;
                                const orders = await client.fetch(fetchOrdersQuery, { userId });
                                for (const ele of orders) {
                                    // add wishlist item
                                    dispatch(addOrderItems({ ...ele }));
                                    // console.log('Orders:', ele)
                                }
                                // wishlist items fetched from Sanity.io
                                const wishlistQuery = `*[
                                _type in ["wishlist", "user"] &&
                                user._ref == $userId
                                ]`;
                                // Fetch the orders for the user from Sanity.io
                                const wishlist = await client.fetch(wishlistQuery, { userId });

                                for (const ele of wishlist) {

                                    const slug = ele.product._ref
                                    const query = `*[_type == 'product' && _id == $slug][0]`
                                    const product = await client.fetch(query, { slug })

                                    // add wishlist item
                                    dispatch(addToWishlistItems({ ...product }));
                                    // console.log('Wishlist:', ele)
                                }

                                // redirect to home page
                                // window.location.href = '/';
                                return router.push('/');
                            } else {
                                notify();
                                setBusy(false);
                            }

                        }, 1500)

                        resolve(checkoutCart);
                    } catch (error) {
                        // If there was an error during the save operation, reject the promise with the error
                        reject(error);
                    }
                });
            }

            toast.promise(
                loginCredentials(),
                {
                    loading: 'Redirecting Please wait...',
                    success: 'Login Submitted Please wait for verifying...',
                    error: '!Opps something went wrong to login.',
                }
            );

            // const status = await signIn('credentials', {
            //     redirect: false,
            //     email: values.email,
            //     password: values.password,
            //     callbackUrl: '/'
            // })

            // console.log(status)

            // if (status.ok) {

            //     toast.success(`Welcome to WishBin store :)`, {
            //         position: "top-center",
            //         autoClose: 5000,
            //         hideProgressBar: false,
            //         closeOnClick: true,
            //         pauseOnHover: true,
            //         draggable: true,
            //         progress: undefined,
            //         theme: "dark",
            //     });

            //     return router.back();
            // }
            action.resetForm();
        }
    });

    // google login
    // const handleGoogleSignIn = async () => {

    //     function googleLoginCredentials() {
    //         return new Promise(async (resolve, reject) => {
    //             try {
    //                 const checkoutCart = setTimeout(async () => {
    //                     // const user = await client.fetch(`*[_type == "user" && email == $email][0]`, {
    //                     //     email: values.email,
    //                     // });

    //                     // console.log(user)

    //                     console.log('Redirecting please wait...')

    //                     const userWithGoogle = await signIn('google', { callbackUrl: "http://localhost:3000" });
    //                     // Set the user data cookies
    //                     // dispatch(setUser(user));

    //                     // return router.push('/')
    //                     // if (user) {

    //                     // } else {
    //                     //     toast.error('User not found to this account, !Please SignUp :(', {
    //                     //         position: "top-center",
    //                     //         autoClose: 5000,
    //                     //         hideProgressBar: false,
    //                     //         closeOnClick: true,
    //                     //         pauseOnHover: true,
    //                     //         draggable: true,
    //                     //         progress: undefined,
    //                     //         theme: "dark",
    //                     //     });
    //                     // }

    //                 }, 2000)


    //                 resolve(checkoutCart);
    //             } catch (error) {
    //                 // If there was an error during the save operation, reject the promise with the error
    //                 reject(error);
    //             }
    //         });
    //     }

    //     toast.promise(
    //         googleLoginCredentials(),
    //         {
    //             loading: 'Redirecting Please wait...',
    //             success: 'Successful Data Submission',
    //             error: '!Opps something went wrong to login.',
    //         }
    //     );

    // }

    useEffect(() => {
        document.querySelector('body').style.paddingRight = '0'
    }, [])

    return (
        <>
            <CommonHead title="Login to WishBin Store | Online Shopping site in India" />

            {
                loading === true ? (
                    <Loading />
                ) : (
                    <>
                        <div className='fixed top-0 z-[99999]'>
                            <Toaster />
                        </div>
                        <div className='w-full h-full bg-gradient-to-l from-[#90caf9] to-[#047edf]'>
                            {/* registers contents */}
                            <div id='loginBGChanges' className='h-screen w-full max-w-[1366px] mx-auto p-[2rem]'>
                                <div className='w-full h-full flex items-center flex-col gap-[20px]'>
                                    {/* logo */}
                                    <Link href='/' title="Click to visit the WishBin-store website" className='z-50 xs:w-[55px] xs:h-[55px] h-[70px] w-[70px] xs:text-[1.3rem] text-[1.6rem] flex items-center justify-center rounded-full border-2 border-white font-bold text-center fixed top-[20px] leading-[45px] text-white'>WB</Link>
                                    {/* contents */}
                                    <div className='w-full sm:h-full h-[80%] flex items-center justify-center flex-col 1x1:gap-[20px] overflow-hidden'>
                                        <div className='w-full h-auto relative'>
                                            {/* left side images */}
                                            <div className='w-[460px] h-[460px] absolute left-[2rem] top-[1.5rem] lg:block hidden bg-[url("/loginBGImg.svg")] bg-no-repeat bg-contain bg-center'></div>
                                            {/* right form button contents */}
                                            <div className='md:w-[500px] w-full lg:ml-auto lg:mx-0 mx-auto lg:h-[450px] h-max flex items-center justify-center flex-col pt-[2.5rem]'>
                                                {/* title */}
                                                <h1 className='z-50 text-[2.5rem] text-white shadow-black drop-shadow-[1px_1px_#000]'>
                                                    One of us <span className='text-black'>?</span></h1>
                                                {/* paras */}
                                                <p className='z-50 text-[1.25rem] text-white tracking-[0.2px] leading-[30px] xs:w-[70%] w-full mx-auto mt-[1rem] mb-[1.5rem] font-[400] text-center'>
                                                    Ready to get started? Join us today! click to <span className='text-black'>Sign In</span> now.
                                                    {/* New Here? click to <span className='text-black'>Sign Up</span> */}
                                                </p>
                                                {/* button popup */}
                                                {/* gap-[15px] */}
                                                <div className='lg:w-[310px] w-full flex items-center flex-col justify-center transition-all duration-300'>
                                                    <button onClick={() => setIsOpenPopup(true)} onMouseOver={() => setAddMailIcon(true)} onMouseLeave={() => setAddMailIcon(false)} type='button' role='button' aria-label='sign-in' className='font-[500] z-50 h-[60px] w-full capitalize p-[0.5rem_1.3rem] text-center bg-black rounded-[10px] border-[2px] border-black text-white hover:opacity-80 transition-all duration-300 flex items-center justify-center gap-[10px] text-[18px]'>
                                                        {
                                                            addMailIcon === true ? (
                                                                <MdMail size={24} />
                                                            ) : (
                                                                <MdMailOutline size={24} />
                                                            )
                                                        }
                                                        sign in
                                                    </button>
                                                    {/* google */}
                                                    {/* <button onClick={handleGoogleSignIn} type='button' role='button' aria-label='log-in-with-google' className='font-[500] z-50 h-[55px] w-full p-[0.5rem_1.3rem] text-center bg-black text-white hover:opacity-80 rounded-[10px] border-[2px] border-black transition-all duration-300 flex items-center justify-center gap-[10px]'>
                                    icons
                                    <span>
                                        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" version="1.1" x="0px" y="0px" viewBox="0 0 48 48" enableBackground="new 0 0 48 48" height="22px" width="22px" xmlns="http://www.w3.org/2000/svg"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12
                                        c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24
                                        c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657
                                        C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36
                                        c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571
                                        c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                                        </svg>
                                    </span>
                                    text
                                    Continue with Google
                                </button> */}
                                                    {/* sign up page */}
                                                    <p className='z-50 flex items-center gap-[5px] text-white my-[10px] text-[18px] flex-wrap'>
                                                        Don't have an account? <Link href='/register' title="Click to visit the Register page" className='hover:underline text-[#343B73] hover:underline-offset-2'> Sign Up now</Link>
                                                    </p>
                                                </div>

                                                {/* new here */}
                                                {/* <button
                                onClick={() => router.push('/register')}
                                type='button'
                                role='button'
                                aria-label='sign-up'
                                className='z-50 mt-[20px] w-full xs:w-[270px] h-[55px] border-[2px] border-black bg-transparent text-black hover:text-white hover:bg-black transition-all duration-300 rounded-[10px]'>
                                Sign Up
                            </button> */}
                                            </div>

                                        </div>
                                    </div>
                                    {/* bottom button */}
                                    <div className='z-50 w-full flex items-center justify-center mt-[2rem]'>
                                        <Link href='/' title="Click to visit the WishBin-store website" className='text-[16px] h-[60px] lg:w-[280px] md:w-[500px] w-full font-[500] rounded-[10px] border-2 border-[#343B73] hover:border-black bg-transparent text-[#343B73] hover:text-white hover:bg-black p-[0.6rem_1.3rem] flex items-center justify-center gap-[8px] transition-all duration-300'>
                                            <TiArrowBack size={22} />
                                            Go to home page
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {
                                isOpenPopup === true &&
                                <div id='popup' className={`z-[9999]`} >
                                    {/* overlay */}
                                    {
                                        isOpenPopup === true &&
                                        <div onClick={() => setIsOpenPopup(false)} className='w-full h-screen fixed top-0 left-0 right-0 bottom-0 bg-black/80 z-[9990] cursor-pointer'>
                                        </div>
                                    }

                                    {/* contents */}
                                    <div className='popupContent' >
                                        <div className={`${isOpenPopup === true ? 'activePopup' : ''} xs:w-[400px] w-[85%] mx-auto h-max popupBox z-[9999] p-[1.5rem] bg-white text-black rounded-[20px] shadow-[0_2px_5px_0_rgba(0 0 4px)]`} style={{ transition: 'opacity 0.3s cubic-bezier(0.46, 0.03, 0.52, 0.96), top 1s ease-in-out, transform 1s ease-in-out' }}>
                                            {/* cross icons */}
                                            <span onClick={() => setIsOpenPopup(false)} className="text-black text-[35px] leading-[20px] cursor-pointer absolute top-[20px] right-[20px]">
                                                &times;
                                            </span>
                                            {/* title */}
                                            <h1 className='xs:text-[1.8rem] text-[1.8rem] mt-[0.5rem] mb-[10px] text-center'>Sign In</h1>
                                            {/* form contents */}
                                            <form onSubmit={handleSubmit} method='post' className='w-full h-max flex items-center overflow-hidden'>
                                                {/* Account Setup form */}
                                                <div className={`w-full h-max`} style={{ transition: '1s cubic-bezier(0.46, 0.03, 0.52, 0.96)' }}>
                                                    {/* email fields */}
                                                    <div className='fields h-max w-full mb-[20px] ' style={{ transition: '1s cubic-bezier(0.46, 0.03, 0.52, 0.96)' }}>
                                                        <input type='email' onChange={handleChange} name='email' onBlur={handleBlur} value={values.email} className={`w-full h-[55px] p-[8px_10px] rounded-[10px] border-[1px] ${errors.email && touched.email ? 'border-[#ea5455]' : 'border-[lightgrey]'} bg-transparent focus:border-black`} placeholder='Enter email address' />
                                                        {/* error */}
                                                        {
                                                            errors.email && touched.email ?
                                                                <p className='text-[12px] text-[#ea5455] flex'>{errors.email}</p>
                                                                : null
                                                        }
                                                    </div>
                                                    {/* password fields */}
                                                    <div className='fields h-max w-full mb-[20px]' style={{ transition: '1s cubic-bezier(0.46, 0.03, 0.52, 0.96)' }}>
                                                        <div className='w-full h-full relative'>
                                                            <input type={`${passwordOpen === true ? 'text' : 'password'}`} name='password' onChange={handleChange} onBlur={handleBlur} value={values.password} className={`w-full h-[55px] p-[8px_10px] rounded-[10px] border-[1px] ${errors.password && touched.password ? 'border-[#ea5455]' : 'border-[lightgrey]'} bg-transparent focus:border-black`} placeholder='Enter password' autoComplete='off' />
                                                            {/* icons */}
                                                            <span onClick={() => setPasswordOpen(!passwordOpen)} className='absolute right-[15px] top-[20px] cursor-pointer'>
                                                                {
                                                                    passwordOpen === true ? (
                                                                        <FaRegEye size={18} />
                                                                    ) : (
                                                                        <FaRegEyeSlash size={18} />
                                                                    )
                                                                }
                                                            </span>
                                                        </div>
                                                        {/* error */}
                                                        {
                                                            errors.password && touched.password ?
                                                                <p className='text-[12px] text-[#ea5455] block'>{errors.password}</p>
                                                                : null
                                                        }

                                                        <div className='mt-[0.3rem]'>
                                                            <Link href='/forgetPassword' title="Click to visit the Forget password page" className='text-[14px] text-[#047edf] font-[500] hover:underline'>Forget Password?</Link>
                                                        </div>
                                                    </div>

                                                    {/* next side button */}
                                                    <button
                                                        type='submit'
                                                        role='button'
                                                        aria-label='submit'
                                                        disabled={busy}
                                                        className={`w-full h-[60px] font-[500] bg-black text-white ${busy ? 'opacity-75' : 'opacity-100'} rounded-[10px] flex items-center justify-center gap-[10px]`}>
                                                        {busy && <LoadingButton />}

                                                        {busy ? 'Submitting' : 'Submit'}
                                                    </button>
                                                </div>
                                            </form>
                                            {/* login button */}
                                            <div className='w-full mt-[15px]'>
                                                {/* <div className='w-full flex items-center gap-[5px] justify-center mb-[15px]'>
                                <span className='w-full h-[2px] bg-black rounded-[5px]'></span>
                                <h1 className='text-[20px] whitespace-nowrap'>Or With</h1>
                                <span className='w-full h-[2px] bg-black rounded-[5px]'></span>
                            </div> */}
                                                {/* OAuth buttons */}
                                                {/* <div className='w-full flex items-center gap-[10px]'>
                                google button
                                <button
                                    onClick={() => handleGoogleSignIn()}
                                    type='button'
                                    role='button'
                                    aria-label='sign-up'
                                    className='w-full h-[55px] border-[2px] border-black bg-transparent text-black transition-all duration-300 rounded-[10px] font-semibold flex items-center justify-center gap-[10px]'>
                                    <span>
                                        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" version="1.1" x="0px" y="0px" viewBox="0 0 48 48" enableBackground="new 0 0 48 48" height="22px" width="22px" xmlns="http://www.w3.org/2000/svg"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12
                                        c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24
                                        c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657
                                        C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36
                                        c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571
                                        c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                                        </svg>
                                    </span>
                                    Google
                                </button>
                                apple button
                                <button
                                    type='button'
                                    role='button'
                                    aria-label='sign-up'
                                    className='w-full h-[55px] border-[2px] border-black bg-transparent text-black transition-all duration-300 rounded-[10px] font-semibold flex items-center justify-center gap-[10px]'>
                                    <span>
                                        <FaApple size={22} />
                                    </span>
                                    Apple
                                </button>
                            </div> */}
                                                <div className='w-full mt-[10px]'>
                                                    <div className='w-full flex items-center gap-[10px] justify-center mb-[15px]'>
                                                        <span className='w-full h-[2px] bg-[lightgrey] rounded-[5px]'></span>
                                                        <h1 className='text-[24px] whitespace-nowrap'>New Here?</h1>
                                                        <span className='w-full h-[2px] bg-[lightgrey] rounded-[5px]'></span>
                                                    </div>
                                                    {/* buttons */}
                                                    <button onClick={() => router.push('/register')} type='button' role='button' aria-label='sign-in' className='w-full
                                    h-[60px] border-[2px] border-black bg-transparent text-black hover:text-white hover:bg-black transition-all
                                    duration-300 rounded-[10px] font-semibold'>Sign Up</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                    </>
                )
            }
        </>
    )
}

export default LoginPage