/* eslint-disable no-undef */
/* eslint-disable no-async-promise-executor */
'use client'

import CommonHead from '../components/CommonHead'
import { registerSchema } from '../formikSchema';
import { useFormik } from 'formik';
import Link from 'next/link'
import { Router, useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import {
    // FaApple,
    FaCheck,
    FaRegEye,
    FaRegEyeSlash
} from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { setUser } from '../slices/userSlice';
import { client } from '../sanity';
import bcrypt from 'bcryptjs';
import toast, { Toaster } from 'react-hot-toast';
// import { signUp } from 'next-auth-sanity/client';
import LoadingButton from '../components/LoadingButton';
import axios from 'axios';
// import jsCookie from 'js-cookie';
import { TiArrowBack } from 'react-icons/ti';
import { MdMail, MdMailOutline } from 'react-icons/md';
// import { signIn } from 'next-auth/react';
import { setUserDataCookie } from '../utils/cookiesAuth';
import Loading from '../components/Loading';

const notify = () => {
    toast.error("!!Email is already existing, Please Login to credentials :(", {
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
    confirm_password: "",
    username: "",
    mobile_number: "",
    address: ""
}

function RegisterPage() {
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

    const router = useRouter();

    const dispatch = useDispatch();

    // popup open state
    const [isOpenPopup, setIsOpenPopup] = useState(false);

    // steps counts
    const [isCurrentStep, setIsCurrentStep] = useState(false)

    // password useState
    const [passwordOpen, setPasswordOpen] = useState(false);
    const [passwordOpen_2, setPasswordOpen_2] = useState(false);

    // when user clicks to submit button hold for a time
    const [busy, setBusy] = useState(false);

    // useFormik
    const { values, errors, touched, handleBlur, handleChange, handleSubmit } = useFormik({
        validationSchema: registerSchema,
        initialValues: initialValues,
        onSubmit: async (values, action) => {
            setBusy(true)

            const { email, password, username, mobile_number, address } = values;

            const passwordProtect = bcrypt.hashSync(password);

            const user = await client.fetch(`*[_type == "user" && email == $email][0]`, {
                email: values.email,
            });

            if (user) {
                notify();
                setIsCurrentStep(false);
            }

            // ================== customs auth ==================
            if (!user) {
                // eslint-disable-next-line no-inner-declarations
                function signUpCredentials() {
                    return new Promise(async (resolve, reject) => {
                        try {
                            const checkoutCart = setTimeout(async () => {
                                const response = await axios.post('/api/welcome-email', {
                                    userEmail: values.email
                                });

                                console.log(response);
                                // get user data and added to the sanity.io account
                                const createUser = await client.create({ _type: 'user', email, passwordProtect, username, mobile_number, address, isAdmin: false });
                                // Set the user data cookies
                                setUserDataCookie(createUser)
                                // Dispatch the setUser action to update the user data
                                dispatch(setUser(createUser));

                                setBusy(false);

                                if (response.status === 200) {
                                    // redirect to home page
                                    // window.location.href = '/login'
                                    router.push('/login');
                                    action.resetForm();
                                }

                            }, 600)

                            resolve(checkoutCart);
                        } catch (error) {
                            // If there was an error during the save operation, reject the promise with the error
                            reject(error);
                        }
                    });
                }

                toast.promise(
                    signUpCredentials(),
                    {
                        loading: 'Redirecting Please wait...',
                        success: 'Successful registration',
                        error: '!Opps something went wrong to registers.',
                    }
                );
            }


            // ================== next-auth ==================
            // function createUser() {
            //     return new Promise(async (resolve, reject) => {
            //         try {
            //             // const userLogout = setTimeout(async () => {
            //             //     const result = await signUp({
            //             //         redirect: false,
            //             //         email,
            //             //         password,
            //             //         username,
            //             //         mobile_number,
            //             //         address,
            //             //         callbackUrl: '/'
            //             //     });

            //             //     if (result.status === true) return router.push('/');

            //             // }, 2000)

            //             // resolve(userLogout);
            //             // const options = {
            //             //     method: 'POST',
            //             //     Headers: {
            //             //         'Content-Type': 'application/json'
            //             //     },
            //             //     body: JSON.stringify(values)
            //             // };

            //             // const createUser = await axios.post('http://localhost:3000/api/auth/signup', options)
            //             //     .then(res => res.json())
            //             //     .then(data => {
            //             //         if (data) {
            //             //             // Dispatch the setUser action to update the user data
            //             //             dispatch(setUser(data));

            //             //             setBusy(false);
            //             //             // redirect to home page
            //             //             router.push('/');
            //             //         }
            //             //     })

            //             const user = await client.fetch(`*[_type == "user" && email == $email][0]`, {
            //                 email: values.email,
            //             });
            //             if (user) {
            //                 notify();
            //                 action.resetForm();
            //                 setIsCurrentStep(false);
            //             } else {
            //                 const response = await fetch('http://localhost:3000/api/auth/signup', {
            //                     method: 'POST',
            //                     headers: {
            //                         'Content-Type': 'application/json'
            //                     },
            //                     body: JSON.stringify(values)
            //                 })

            //                 if (response.ok) {
            //                     // Extract the user data from the response
            //                     const userData = await response.json();

            //                     // Store the user data in the session
            //                     const sessionData = {
            //                         user: {
            //                             id: userData.id,
            //                             name: userData.name,
            //                             email: userData.email,
            //                             // Add other user properties if available
            //                         },
            //                         // Add any other session data if needed
            //                     };

            //                     // Dispatch the setUser action to update the user data in Redux store
            //                     dispatch(setUser(userData));

            //                     // Store the user data in the session using NextAuth.js's session callback
            //                     const session = await fetch('/api/auth/session', {
            //                         method: 'POST',
            //                         headers: {
            //                             'Content-Type': 'application/json',
            //                         },
            //                         body: JSON.stringify(sessionData),
            //                     });

            //                     if (session.ok) {
            //                         console.log('Registration successful!');
            //                         setBusy(false);
            //                         resolve(response);
            //                         // Redirect to home page
            //                         return router.push('/');
            //                     } else {
            //                         console.error('Error storing user data in session:', session.status);
            //                     }
            //                 } else {
            //                     console.error('Registration error:', response.status);
            //                 }
            //             }


            //         } catch (error) {
            //             // If there was an error during the save operation, reject the promise with the error
            //             reject('Error for Registrations promise:', error);
            //         }
            //     });
            // }

            // // toast promise
            // toast.promise(
            //     createUser(),
            //     {
            //         loading: 'Redirecting please wait...',
            //         success: 'SignUp successfully',
            //         error: '!Opps something went wrong',
            //     }
            // );

            // action.resetForm();
        }
    });

    // google login
    // const handleGoogleSignUp = async () => {

    //     function createUser() {
    //         return new Promise(async (resolve, reject) => {
    //             try {
    //                 const checkTimeOut = setTimeout(async () => {

    //                     const { email } = values;

    //                     const user = await client.fetch(`*[_type == "user" && email == $email][0]`, {
    //                         email: email,
    //                     });

    //                     if (user) return notify();

    //                     const signUpUser = await signIn('google', { callbackUrl: "http://localhost:3000" });
    //                     // Set the user data cookies
    //                     dispatch(setUser(signUpUser));

    //                     console.log(signUpUser)

    //                     // get user data and added to the sanity.io account
    //                     // const createUser = await client.create({ _type: 'user', email, passwordProtect, username, mobile_number, address });
    //                 })

    //                 resolve(createUser);
    //             } catch (error) {
    //                 // If there was an error during the save operation, reject the promise with the error
    //                 reject('Error for Registrations promise:', error);
    //             }
    //         });
    //     }

    //     // toast promise
    //     toast.promise(
    //         createUser(),
    //         {
    //             loading: 'Redirecting please wait...',
    //             success: 'SignUp successfully',
    //             error: '!Opps something went wrong',
    //         }
    //     );
    // }

    useEffect(() => {
        document.querySelector('body').style.paddingRight = '0'
    }, [])

    return (
        <>
            <CommonHead title="Register your Account to access WishBin | Online Shopping site in India" />

            {
                loading === true ? (
                    <Loading />
                ) : (
                    <>
                        <div className='fixed top-0 z-[99999]'>
                            <Toaster />
                        </div>
                        <div className='w-full h-full bg-gradient-to-r from-[#ffbf96] to-[#fe7096]'>
                            {/* registers contents */}
                            <div id='registerBG' className='h-screen w-full max-w-[1366px] mx-auto p-[2rem]'>
                                <div className='w-full h-full flex items-center flex-col gap-[20px]'>
                                    {/* logo */}
                                    <Link href='/' title="Click to visit the WishBin-store website" className='z-50 xs:w-[55px] xs:h-[55px] h-[70px] w-[70px] xs:text-[1.3rem] text-[1.6rem] flex items-center justify-center rounded-full border-2 border-white font-bold text-center fixed top-[20px] leading-[45px] text-white'>WB</Link>
                                    {/* contents */}
                                    <div className='w-full sm:h-full h-[80%] flex items-center justify-center 1x1:gap-[20px] flex-col overflow-hidden'>
                                        <div className='w-full h-auto relative'>
                                            {/* form button contents */}
                                            <div className='xs:w-[500px] w-full lg:mr-auto lg:mx-0 mx-auto lg:h-[450px] h-max flex items-center justify-center flex-col pt-[2.5rem]'>
                                                {/* title */}
                                                <h1 className='z-50 text-[2.5rem] text-white shadow-black drop-shadow-[1px_1px_#000]'>
                                                    New Here <span className='text-black'>?</span></h1>
                                                {/* paras */}
                                                <p className='z-50 text-[1.25rem] text-white tracking-[0.2px] leading-[30px] xs:w-[70%] w-full mx-auto mt-[1rem] mb-[1.5rem] font-[400] text-center'>
                                                    Ready to get started? Join us today! click to <span className='text-black'>Sign Up</span> now.
                                                    {/* One of us! click to <span className='text-black'>Sign In</span> */}
                                                </p>
                                                {/* button popup */}
                                                {/* gap-[15px] */}
                                                <div className='xs:w-[320px] w-full flex items-center flex-col justify-center transition-all duration-300'>
                                                    <button onClick={() => setIsOpenPopup(true)} type='button' role='button' aria-label='sign-up' onMouseOver={() => setAddMailIcon(true)} onMouseLeave={() => setAddMailIcon(false)} className='text-[16px] z-50 h-[65px] w-full capitalize p-[0.6rem_1.3rem] text-center bg-black text-white hover:opacity-80 rounded-[10px] border-[2px] border-black transition-all duration-300 flex items-center justify-center gap-[10px]'>
                                                        {
                                                            addMailIcon === true ? (
                                                                <MdMail size={22} />
                                                            ) : (
                                                                <MdMailOutline size={22} />
                                                            )
                                                        }
                                                        sign up
                                                    </button>
                                                    {/* google */}
                                                    {/* <button onClick={handleGoogleSignUp} type='button' role='button' aria-label='log-in-with-google' className='text-[16px] font-[500] z-50 h-[55px] w-full p-[0.6rem_1.3rem] text-center bg-black text-white hover:opacity-80 rounded-[10px] border-[2px] border-black transition-all duration-300 flex items-center justify-center gap-[10px]'>
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
                                            Sign Up with Google
                                        </button> */}
                                                    {/* sign up page */}
                                                    <p className='z-50 flex items-center gap-[5px] text-black my-[10px] text-[18px]'>
                                                        Already have an account? <Link href='/login' title="Click to visit the Login page" className='hover:underline text-black hover:underline-offset-2'> Sign In now</Link>
                                                    </p>
                                                </div>
                                                {/* new here */}
                                                {/* <button
                                        onClick={() => router.push('/login')}
                                        type='button'
                                        role='button'
                                        aria-label='sign-up'
                                        className='z-50 mt-[20px] w-full xs:w-[270px] h-[55px] border-[2px] border-black bg-transparent text-black hover:text-white hover:bg-black transition-all duration-300 rounded-[10px]'>
                                        Sign In
                                    </button> */}
                                            </div>
                                            {/* right side images */}
                                            <div className='w-[460px] h-[460px] absolute top-[1.5rem] right-[2rem] lg:block hidden bg-[url("/registersBGImages.png")] bg-no-repeat bg-contain bg-center'></div>
                                        </div>
                                    </div>
                                    {/* bottom button */}
                                    <div className='z-50 w-full flex items-center justify-center mt-[2rem]'>
                                        <Link href='/' title="Click to visit the WishBin-store website" className='text-[16px] h-[65px] xs:w-[280px] w-full rounded-[10px] border-2 border-black bg-transparent text-black hover:text-white hover:bg-black p-[0.6rem_1.3rem] font-[500] flex items-center justify-center gap-[8px] transition-all duration-300'>
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
                                            <h1 className='xs:text-[1.8rem] text-[1.8rem] mt-[0.5rem] text-center'>Create your account</h1>
                                            {/* progress bar */}
                                            <div className='w-full mt-[10px] mb-[20px] flex items-center justify-between relative'>
                                                {/* account setup */}
                                                <div className='flex items-center flex-col justify-center'>
                                                    <p className='mb-[8px]'>Account Setup</p>
                                                    <div onClick={() => setIsCurrentStep(false)} className={`cursor-pointer w-[25px] h-[25px] ${isCurrentStep === true ? 'bg-[#009c1ae1]' : 'bg-black'} rounded-full flex items-center justify-center`}>
                                                        <span className=' text-white'>
                                                            {
                                                                isCurrentStep === true ? (
                                                                    <FaCheck />
                                                                ) : ('1')
                                                            }
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* line between */}
                                                <div className={`${isCurrentStep === true ? 'w-[55%]' : 'w-0'} absolute transition-all duration-1000 top-[43px] left-[22%] h-[3px] bg-black rounded-[5px]`}></div>

                                                {/* personal details line */}
                                                <div className='flex items-center flex-col justify-center'>
                                                    <p className='mb-[8px]'>Personal Details</p>
                                                    <div onClick={() => setIsCurrentStep(true)} className={`cursor-pointer ${isCurrentStep === true ? 'opacity-[1]' : 'opacity-[0.3]'} transition-all duration-[2.8s] w-[25px] h-[25px] bg-black rounded-full flex items-center justify-center`}>
                                                        <span className={` text-white`}>2</span>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* form contents */}
                                            <form method='POST' onSubmit={handleSubmit} className='w-full h-max flex items-center overflow-hidden'>
                                                {/* Account Setup form */}
                                                <div id='form_acc' className={`${isCurrentStep === false ? 'translate-x-0' : '-translate-x-[1000px]'} w-full h-max`} style={{ transition: '1s cubic-bezier(0.46, 0.03, 0.52, 0.96)' }}>
                                                    {/* email fields */}
                                                    <div className='fields h-max mb-[20px] ' style={{ transition: '1s cubic-bezier(0.46, 0.03, 0.52, 0.96)' }}>
                                                        <input type='email' name='email' onChange={handleChange} onBlur={handleBlur} value={values.email} className={`w-full h-[60px] p-[8px_10px] rounded-[10px] border-[1px] text-[18px] ${errors.email && touched.email ? 'border-[#ea5455]' : 'border-[lightgray]'} bg-transparent focus:border-black`} placeholder='Enter email address' autoComplete='off' />
                                                        {/* error */}
                                                        {
                                                            errors.email && touched.email ?
                                                                <p className='text-[12px] text-[#ea5455] flex'>{errors.email}</p>
                                                                : null
                                                        }
                                                    </div>
                                                    {/* password fields */}
                                                    <div className='fields h-max mb-[20px]' style={{ transition: '1s cubic-bezier(0.46, 0.03, 0.52, 0.96)' }}>
                                                        <div className='w-full h-full relative'>
                                                            <input type={`${passwordOpen === true ? 'text' : 'password'}`} onChange={handleChange} onBlur={handleBlur} value={values.password} name='password' className={`w-full h-[60px] p-[8px_10px] rounded-[10px] border-[1px] text-[18px] ${errors.password && touched.password ? 'border-[#ea5455]' : 'border-[lightgray]'} bg-transparent focus:border-black`} placeholder='Enter password' autoComplete='off' />
                                                            {/* icons */}
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
                                                    </div>
                                                    {/* confirm password */}
                                                    <div className='fields h-max mb-[20px]' style={{ transition: '1s cubic-bezier(0.46, 0.03, 0.52, 0.96)' }}>
                                                        <div className='w-full h-full relative'>
                                                            <input type={`${passwordOpen_2 === true ? 'text' : 'password'}`} onChange={handleChange} onBlur={handleBlur} value={values.confirm_password} name='confirm_password' className={`w-full h-[60px] p-[8px_10px] rounded-[10px] border-[1px] text-[18px] ${errors.confirm_password && touched.confirm_password ? 'border-[#ea5455]' : 'border-[lightgray]'} bg-transparent focus:border-black`} placeholder='Enter confirm password' autoComplete='off' />
                                                            {/* icons */}
                                                            <span onClick={() => setPasswordOpen_2(!passwordOpen_2)} className='absolute right-[15px] top-[20px] cursor-pointer'>
                                                                {
                                                                    passwordOpen_2 === true ? (
                                                                        <FaRegEye size={18} />
                                                                    ) : (
                                                                        <FaRegEyeSlash size={18} />
                                                                    )
                                                                }
                                                            </span>
                                                        </div>
                                                        {/* error */}
                                                        {
                                                            errors.confirm_password && touched.confirm_password ?
                                                                <p className='text-[12px] text-[#ea5455] block'>{errors.confirm_password}</p>
                                                                : null
                                                        }
                                                    </div>

                                                    {/* next side button */}
                                                    <button onClick={() => setIsCurrentStep(true)} type='button' role='button' aria-label='next-step' className='fields w-full h-[60px] bg-black text-white rounded-[10px]'>Next Step</button>
                                                </div>

                                                {/* Personal Details form */}
                                                <div id='form_per' className={`${isCurrentStep === true ? '-translate-x-[100%]' : '-translate-x-[1000px]'} w-full h-max`} style={{ transition: '1s cubic-bezier(0.46, 0.03, 0.52, 0.96)' }}>
                                                    {/* user name fields */}
                                                    <div className='fields h-max mb-[20px]' style={{ transition: '1s cubic-bezier(0.46, 0.03, 0.52, 0.96)' }}>
                                                        <input type='text' name='username' onChange={handleChange} onBlur={handleBlur} value={values.username} className={`w-full h-[60px] p-[8px_10px] rounded-[10px] border-[1px] text-[18px] ${errors.username && touched.username ? 'border-[#ea5455]' : 'border-[lightgray]'} bg-transparent focus:border-black`} placeholder='Your name' autoComplete='off' />
                                                        {/* error */}
                                                        {
                                                            errors.username && touched.username ?
                                                                <p className='text-[12px] text-[#ea5455] flex'>{errors.username}</p>
                                                                : null
                                                        }
                                                    </div>
                                                    {/* phone number fields */}
                                                    <div className='fields h-max mb-[20px]' style={{ transition: '1s cubic-bezier(0.46, 0.03, 0.52, 0.96)' }}>
                                                        <input type='tel' name='mobile_number' onChange={handleChange} onBlur={handleBlur} value={values.mobile_number} maxLength={10} className={`w-full h-[60px] p-[8px_10px] rounded-[10px] border-[1px] text-[18px] ${errors.mobile_number && touched.mobile_number ? 'border-[#ea5455]' : 'border-[lightgray]'} bg-transparent focus:border-black`} placeholder='Your phone number' autoComplete='off' />
                                                        {/* error */}
                                                        {
                                                            errors.mobile_number && touched.mobile_number ?
                                                                <p className='text-[12px] text-[#ea5455] block'>{errors.mobile_number}</p>
                                                                : null
                                                        }
                                                    </div>
                                                    {/* address fields */}
                                                    <div className='fields h-max mb-[20px]' style={{ transition: '1s cubic-bezier(0.46, 0.03, 0.52, 0.96)' }}>
                                                        <input type='text' name='address' onChange={handleChange} onBlur={handleBlur} value={values.address} className={`w-full h-[60px] p-[8px_10px] rounded-[10px] border-[1px] text-[18px] border-[lightgray] bg-transparent focus:border-black`} placeholder='Your address [option]' autoComplete='off' />
                                                    </div>

                                                    {/* next side button */}
                                                    <div className='fields flex items-center w-full gap-[10px]'>
                                                        <button
                                                            onClick={() => setIsCurrentStep(false)}
                                                            type='button'
                                                            role='button'
                                                            aria-label='previous'
                                                            disabled={busy}
                                                            className={`w-full h-[60px] bg-transparent border-[2px] border-black text-black ${busy ? 'opacity-75' : 'opacity-100'} rounded-[10px]`}>
                                                            Previous
                                                        </button>
                                                        <button
                                                            type='submit'
                                                            role='button'
                                                            aria-label='submit'
                                                            disabled={busy}
                                                            className={`w-full h-[60px] bg-black text-white ${busy ? 'opacity-75' : 'opacity-100'} rounded-[10px] flex items-center justify-center gap-[10px]`}>
                                                            {busy && <LoadingButton />}

                                                            Submit
                                                        </button>
                                                    </div>
                                                </div>
                                            </form>
                                            {/* login button */}
                                            <div className='w-full mt-[10px]'>
                                                {/* <div className='w-full flex items-center gap-[10px] justify-center mb-[15px]'>
                                        <span className='w-full h-[2px] bg-[lightgray] rounded-[5px]'></span>
                                        <h1 className='text-[24px] whitespace-nowrap'>Or With</h1>
                                        <span className='w-full h-[2px] bg-[lightgray] rounded-[5px]'></span>
                                    </div> */}
                                                {/* OAuth buttons */}
                                                {/* <div className='w-full flex items-center gap-[10px]'>
                                        google button
                                        <button
                                            type='button'
                                            role='button'
                                            aria-label='sign-up'
                                            className='w-full h-[55px] border-[2px] border-black bg-transparent text-black transition-all duration-300 rounded-[10px] font-black flex items-center justify-center gap-[10px]'>
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
                                            className='w-full h-[55px] border-[2px] border-black bg-transparent text-black transition-all duration-300 rounded-[10px] font-black flex items-center justify-center gap-[10px]'>
                                            <span>
                                                <FaApple size={22} />
                                            </span>
                                            Apple
                                        </button>
                                    </div> */}

                                                <div className='w-full mt-[10px]'>
                                                    <div className='w-full flex items-center gap-[10px] justify-center mb-[15px]'>
                                                        <span className='w-full h-[2px] bg-[lightgray] rounded-[5px]'></span>
                                                        <h1 className='text-[24px] whitespace-nowrap'>One of us!</h1>
                                                        <span className='w-full h-[2px] bg-[lightgray] rounded-[5px]'></span>
                                                    </div>
                                                    {/* buttons */}
                                                    <button onClick={() => router.push('/login')} type='button' role='button' aria-label='sign-in' className='w-full
                                            h-[55px] border-[2px] border-black bg-transparent text-black hover:text-white hover:bg-black transition-all
                                            duration-300 rounded-[10px] font-semibold'>Sign In</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div >
                            }
                        </div>
                    </>
                )
            }
        </>
    )
}

export default RegisterPage