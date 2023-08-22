/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-async-promise-executor */
/* eslint-disable no-undef */
'use client'

import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import ThemeChanged from '../components/ThemeChanged'
import Footer from '../components/Footer'
import Loading from '../components/Loading'
import CommonHead from '../components/CommonHead'
import { Router } from 'next/router'
import Image from 'next/image'
import { FaTelegramPlane } from 'react-icons/fa'
import { useFormik } from 'formik'
import { contactSchema } from '../formikSchema'
import LoadingButton from '../components/LoadingButton'
import toast, { Toaster } from 'react-hot-toast'
import { client } from '../sanity'
import axios from 'axios'
import { FiCheckCircle } from 'react-icons/fi'

function ContactPage() {
    const [loading, setLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false)

    Router.events.on("routeChangeStart", () => {
        console.log("Route is staring...")
        setLoading(true)
    });

    Router.events.on("routeChangeComplete", () => {
        console.log("Route is completed...")
        setLoading(false)
    });

    const initialValues = {
        username: '',
        email: '',
        message: '',
    }

    const [sendSuccessMail, setSendSuccessMail] = useState(false);

    // useFormik
    const { values, errors, touched, handleBlur, handleChange, handleSubmit } = useFormik({
        validationSchema: contactSchema,
        initialValues: initialValues,
        onSubmit: async (values, action) => {
            setIsLoading(true)

            const { email, username, message } = values;

            // ================== customs auth ==================
            function contactForms() {
                return new Promise(async (resolve, reject) => {
                    try {
                        const response = await axios.post('https://wishbin-store.vercel.app/api/contact-email', {
                            userData: values
                        });

                        if (response.status === 200) {
                            // user contact message
                            await client.create({ _type: 'contact', email, message, username, status: 'pending' });
                            setIsLoading(false);
                            setSendSuccessMail(true)
                        }

                        resolve(response);
                    } catch (error) {
                        // If there was an error during the save operation, reject the promise with the error
                        reject(error);
                    }
                });
            }

            toast.promise(
                contactForms(),
                {
                    loading: 'Sending your queries...',
                    success: 'Successful sended',
                    error: '!Opps something went wrong to send queries.',
                }
            );

            action.resetForm();
        }
    });

    useEffect(() => {
        if (sendSuccessMail === true) {
            setTimeout(() => {
                setSendSuccessMail(false)
            }, 5000)
        }
    }, [sendSuccessMail])

    return (
        <>

            <CommonHead title="Contact Form - WishBin Store | Online Shopping site in India" />

            {
                loading === true ? (
                    <Loading />
                ) : (
                    <>
                        <div className='fixed top-0 z-[99999]'>
                            <Toaster />
                        </div>
                        <div id='Container' className='w-full h-full'>
                            <Header sticky={true} navbar={false} />

                            <main className="max-w-[1366px] mx-auto w-full h-full xl:px-[3rem] xs:px-[1.5rem] px-[1rem] mt-[1em] xl:mb-[7.3rem] slg:mb-[6.6rem] sm:mb-[6.8rem] xs:mb-[6rem] mb-[7.3rem]">
                                <div className='w-full mx-auto h-full flex slg:flex-row flex-col slg:items-start items-center slg:gap-[40px] bg-white dark:bg-[#262936] lg:px-[15%] slg:px-[10%] px-[20px] md:py-[30px] py-[20px] rounded-[10px]'>
                                    {/* left side */}
                                    <div className='md:w-1/2 w-full h-full'>
                                        <h1 className='sm:text-[2.3rem] text-[1.8rem] sm:leading-[50px] leading-8 mb-[1rem] font-black text-black dark:text-[#BABECD]'>Let's talk about everything!</h1>
                                        {/* images */}
                                        <Image src='/contact-form.svg' importance="high" rel="preload" priority={true} height={330} width={445} className='w-full h-[330px] object-contain slg:block hidden' alt='Contact-form-image' title={`Contact banner image`} />
                                    </div>
                                    {/* right side */}
                                    <div className='md:w-1/2 w-full h-full'>
                                        <form onSubmit={handleSubmit} method='post' className='w-full h-full'>
                                            {/* full name */}
                                            <div className='fields h-max w-full mb-[20px] ' style={{ transition: '1s cubic-bezier(0.46, 0.03, 0.52, 0.96)' }}>
                                                <label className='text-[1rem] font-bold mb-[0.4rem] block text-black dark:text-[#96a0a5]'>Full name</label>
                                                {/* input */}
                                                <input
                                                    type='text'
                                                    onChange={handleChange} onBlur={handleBlur} value={values.username}
                                                    name='username'
                                                    disabled={isLoading}
                                                    placeholder='Enter your full name'
                                                    autoComplete="off"
                                                    className={`${errors.username && touched.username ? 'border-[#ea5455] text-[#ea5455] dark:border-[#ea5455]' : 'border-[#d4d5d9] dark:border-[#96a0a5] text-black dark:text-[#BABECD]'}
                                                ${isLoading && 'cursor-not-allowed'}
                                                w-full h-[50px] text-[1.2rem] p-[10px_15px] border-[1px] bg-transparent placeholder:dark:text-[#96a0a5] border-[#d4d5d9] focus:border-black dark:focus:border-[#BABECD] dark:border-[#96a0a5] rounded-[5px]`} />

                                                {/* error */}
                                                {
                                                    errors.username && touched.username ?
                                                        <p className='text-[14px] text-[#ea5455] flex'>{errors.username}</p>
                                                        : null
                                                }
                                            </div>
                                            {/* email id */}
                                            <div className='fields h-max w-full mb-[20px] ' style={{ transition: '1s cubic-bezier(0.46, 0.03, 0.52, 0.96)' }}>
                                                <label className='text-[1rem] font-bold mb-[0.4rem] block text-black dark:text-[#96a0a5]'>Email address</label>
                                                {/* input */}
                                                <input
                                                    type='email'
                                                    onChange={handleChange} onBlur={handleBlur} value={values.email}
                                                    name='email'
                                                    disabled={isLoading}
                                                    placeholder='example@gmail.com'
                                                    autoComplete="off"
                                                    className={`${errors.email && touched.email ? 'border-[#ea5455] text-[#ea5455] dark:border-[#ea5455]' : 'border-[#d4d5d9] dark:border-[#96a0a5] text-black dark:text-[#BABECD]'}
                                                ${isLoading && 'cursor-not-allowed'}
                                                 w-full h-[50px] text-[1.2rem] p-[10px_15px] border-[1px] bg-transparent placeholder:dark:text-[#96a0a5] border-[#d4d5d9] focus:border-black dark:focus:border-[#BABECD] dark:border-[#96a0a5] rounded-[5px]`} />

                                                {/* error */}
                                                {
                                                    errors.email && touched.email ?
                                                        <p className='text-[14px] text-[#ea5455] flex'>{errors.email}</p>
                                                        : null
                                                }
                                            </div>
                                            {/* message */}
                                            <div className='fields h-max w-full mb-[20px] ' style={{ transition: '1s cubic-bezier(0.46, 0.03, 0.52, 0.96)' }}>
                                                <label className='text-[1rem] font-bold mb-[0.4rem] block text-black dark:text-[#96a0a5]'>Message</label>
                                                {/* textarea */}
                                                <textarea rows="4" cols="50"
                                                    type='text'
                                                    onChange={handleChange} onBlur={handleBlur} value={values.message}
                                                    name='message'
                                                    disabled={isLoading}
                                                    placeholder='Write your message'
                                                    autoComplete="off"
                                                    className={`${errors.message && touched.message ? 'border-[#ea5455] text-[#ea5455] dark:border-[#ea5455]' : 'border-[#d4d5d9] dark:border-[#96a0a5] text-black dark:text-[#BABECD]'}
                                                   ${isLoading && 'cursor-not-allowed'} resize-none outline-none
                                                    w-full h-max text-[1.2rem] p-[10px_15px] border-[1px] bg-transparent placeholder:dark:text-[#96a0a5] border-[#d4d5d9] focus:border-black dark:focus:border-[#BABECD] dark:border-[#96a0a5] rounded-[5px]`}
                                                />

                                                {/* error */}
                                                {
                                                    errors.message && touched.message ?
                                                        <p className='text-[14px] text-[#ea5455] flex'>{errors.message}</p>
                                                        : null
                                                }
                                            </div>

                                            {/* button */}
                                            <button type='submit' aria-label="set-message" role='button' className={`mt-[1.2rem] w-full h-[50px] rounded-[5px] p-[0.5rem_1.4rem] ${sendSuccessMail === true ? 'bg-green-500' : 'bg-[#101219]'} hover:opacity-[0.85] text-white dark:text-[#BABECD] flex items-center justify-center gap-[0.7rem] text-[1.2rem] shadow-[0_2px_4px_rgba(0,0,0,0.3)] hover:shadow-none`} style={{ transition: '0.3s cubic-bezier(0.46, 0.03, 0.52, 0.96)', }}>
                                                {
                                                    isLoading === true ? (
                                                        <LoadingButton />
                                                    ) : (
                                                        <>
                                                            {
                                                                sendSuccessMail === true ? (
                                                                    <FiCheckCircle size={20} />
                                                                ) : (

                                                                    <FaTelegramPlane size={20} />
                                                                )
                                                            }
                                                        </>
                                                    )
                                                }

                                                {
                                                    sendSuccessMail === true ? 'Message sended' : 'Send message'
                                                }
                                            </button>
                                        </form>

                                        {/* text */}
                                        <p className='text-[#96a0a5] mt-[1rem] xs:text-[16px] text-[14px]'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptas debitis, fugit natus?</p>
                                    </div>
                                </div>
                            </main>
                            {/* Footer */}
                            <Footer mainFooter={true} />
                        </div>
                        {/* theme changed */}
                        <ThemeChanged />
                    </>
                )
            }
        </>
    )
}

export default ContactPage