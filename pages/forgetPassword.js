/* eslint-disable no-undef */
/* eslint-disable no-inner-declarations */
/* eslint-disable no-async-promise-executor */
'use client'

import React, { useState } from 'react'
import CommonHead from '../components/CommonHead'
import toast, { Toaster } from 'react-hot-toast'
import Link from 'next/link'
import { TiArrowBack } from 'react-icons/ti'
import { useFormik } from 'formik'
import { forgetPasswordSchema } from '../formikSchema'
import LoadingButton from '../components/LoadingButton'
import axios from 'axios';
import { client } from '../sanity'
import { useRouter } from 'next/navigation'
import { Router } from 'next/router'
import Loading from '../components/Loading'

function forgetPasswordPage() {

    const [loading, setLoading] = useState(false);

    Router.events.on("routeChangeStart", () => {
        console.log("Route is staring...")
        setLoading(true)
    })

    Router.events.on("routeChangeComplete", () => {
        console.log("Route is completed...")
        setLoading(false)
    })

    const router = useRouter();

    const [busy, setBusy] = useState(false);

    const [checkIsEmailShow, setCheckIsEmailShow] = useState(false);

    // useFormik
    const { values, errors, touched, handleBlur, handleChange, handleSubmit } = useFormik({
        validationSchema: forgetPasswordSchema,
        initialValues: {
            email: ''
        },
        onSubmit: async (values) => {
            setBusy(true);

            const email = values.email;

            const userExists = await client.fetch(`*[_type == 'user' && email == $email][0]`, { email });

            if (!userExists) {
                setBusy(false);
                return toast.error("!!Email Id not found, Please try again :(");
            }

            if (userExists.email === email) {
                function emailSend() {
                    return new Promise(async (resolve, reject) => {
                        try {
                            const emailSend = setTimeout(async () => {
                                const response = await axios.post('/api/send-forget-email', {
                                    userData: userExists
                                });

                                if (response.status === 200) {
                                    setBusy(false);
                                    setCheckIsEmailShow(true);
                                }
                            }, 2000);
                            resolve(emailSend);
                        } catch (error) {
                            // If there was an error during the save operation, reject the promise with the error
                            reject(error);
                        }
                    });
                }

                toast.promise(
                    emailSend(),
                    {
                        loading: 'Sending a mail...',
                        success: 'Successful sended please check your email address',
                        error: '!Opps something went wrong to send a email.',
                    }
                );
            }

            // action.resetForm();
        }
    });

    return (
        <>
            <CommonHead title="Forget password of WishBin Store | Online Shopping site in India" />
            {
                loading === true ? (
                    <Loading />
                ) : (
                    <>
                        <div className='fixed top-0 z-[99999]'>
                            <Toaster />
                        </div>
                        <div className='w-full h-full bg-white'>
                            {/* registers contents */}
                            <div className='h-screen w-full max-w-[1366px] mx-auto p-[2rem]'>
                                <div className='w-full h-full flex items-center flex-col gap-[20px]'>
                                    {/* logo */}
                                    <Link href='/' onClick={() => router.push('/')} title="Click to visit the WishBin-store website" className='z-50 w-[45px] h-[45px] text-[1.1rem] rounded-full border-2 border-black font-bold text-center fixed top-[20px] leading-[45px] text-black'>WB</Link>
                                    {/* contents */}
                                    <div className='w-full h-full flex items-center justify-center flex-col gap-[20px] overflow-hidden'>
                                        <div className='w-auto h-auto flex items-center justify-center flex-col pt-[2.5rem]'>
                                            {/* animation icons */}
                                            <p className="relative flex items-center justify-center h-[58px] w-[58px] mb-[0.8rem]">
                                                <span className={`animate-ping absolute inline-flex h-[50%] w-[50%] rounded-full transition-all duration-[3s] bg-[#fd5555]/90 opacity-75`} style={{ transition: 'all 2s cubic-bezier(0.18, 0.89, 0.43, 1.19)' }}></span>
                                                <span className={`animate-ping absolute inline-flex h-[75%] w-[75%] rounded-full transition-all duration-[1.5s] bg-[#fd5555]/70 opacity-75`} style={{ transition: 'all 1.5s cubic-bezier(0.18, 0.89, 0.43, 1.19)' }}></span>

                                                {
                                                    checkIsEmailShow === true ? (
                                                        <svg stroke="#fd5555" fill="none" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true" height="2em" width="2em" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                                    ) : (
                                                        <svg stroke="#fd5555" className='z-[10]' fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="2em" width="2em" xmlns="http://www.w3.org/2000/svg"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path></svg>
                                                    )
                                                }
                                            </p>
                                            {/* title */}
                                            <h1 className='z-50 sm:text-3xl text-2xl text-bold text-black'>
                                                {
                                                    checkIsEmailShow === true ? ("Check your email") : ("Forget password?")
                                                }

                                                {/* 🔒 */}
                                            </h1>
                                            {/* paras */}
                                            <p className={`z-50 text-[1rem] text-black w-full mx-auto mt-[1rem] mb-[1.5rem] font-[400] text-center`}>
                                                {
                                                    checkIsEmailShow === true ? (
                                                        <span>We sent a password reset link to <br /> <span className='text-[#fd5555] font-[500]'>{values.email}</span></span>
                                                    ) : ("No worries, we'll send you reset instructions")
                                                }
                                            </p>
                                            {/* button popup */}
                                            <form onSubmit={handleSubmit} className='lg:w-[350px] w-full flex items-center flex-col justify-center transition-all duration-300'>

                                                {/* email fields */}
                                                {
                                                    checkIsEmailShow === false &&
                                                    <div className='fields h-max w-full mb-[20px] ' style={{ transition: '1s cubic-bezier(0.46, 0.03, 0.52, 0.96)' }}>
                                                        <label className='text-sm font-bold mb-[0.4rem] block text-black'>Email address</label>
                                                        <input type='email' onChange={handleChange} name='email' onBlur={handleBlur} value={values.email} className={`w-full h-[55px] p-[8px_10px] rounded-[10px] border-[1px] text-black ${errors.email && touched.email ? 'border-[#ea5455]' : 'border-[lightgrey]'} bg-transparent focus:border-black`} placeholder='Enter your email' />
                                                        {/* error */}
                                                        {
                                                            errors.email && touched.email ?
                                                                <p className='text-[12px] text-[#ea5455] flex'>{errors.email}</p>
                                                                : null
                                                        }
                                                    </div>
                                                }

                                                {
                                                    checkIsEmailShow === true ? (
                                                        <Link href='https://mail.google.com/mail/u/0/?tab=rm&ogbl#inbox' target="_blank" className='font-[500] z-50 h-[55px] w-full p-[0.5rem_1.3rem] text-center bg-[#fd5555] rounded-[10px] text-white hover:bg-[#ec4b4b] transition-all duration-300 flex items-center justify-center gap-[10px]'>
                                                            Open email app
                                                        </Link>
                                                    ) : (
                                                        <button type='submit' role='button' aria-label='reset-password' className='font-[500] z-50 h-[55px] w-full p-[0.5rem_1.3rem] text-center bg-[#fd5555] rounded-[10px] text-white hover:bg-[#ec4b4b] transition-all duration-300 flex items-center justify-center gap-[10px]'>
                                                            {
                                                                busy === true &&
                                                                <LoadingButton />
                                                            }
                                                            Reset password
                                                        </button>
                                                    )
                                                }
                                                {/* login page */}
                                                <Link href='/login' title="Click to visit the login page" className='text-[16px] h-max w-max mt-[1.3rem] font-[500] rounded-[10px] text-black flex items-center justify-center gap-[8px] transition-all duration-300'>
                                                    <TiArrowBack size={22} />
                                                    back to login
                                                </Link>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )
            }
        </>
    )
}

export default forgetPasswordPage