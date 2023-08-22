/* eslint-disable no-async-promise-executor */
/* eslint-disable no-undef */
'use client'

import React, { useEffect, useRef, useState } from 'react'
import CommonHead from '../components/CommonHead'
import toast, { Toaster } from 'react-hot-toast'
import Header from '../components/Header'
import { Router, useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import Footer from '../components/Footer';
import ThemeChanged from '../components/ThemeChanged';
import { FaCloudDownloadAlt, FaRegImages } from 'react-icons/fa';
import { client } from '../sanity';
import Image from 'next/image';
import { useFormik } from 'formik';
import LoadingButton from '../components/LoadingButton';
import { TiArrowBack } from 'react-icons/ti';
import Loading from '../components/Loading'

function UploadImagePage() {

    const [pageLoading, setPageLoading] = useState(false);

    Router.events.on("routeChangeStart", () => {
        console.log("Route is staring...")
        setPageLoading(true)
    })

    Router.events.on("routeChangeComplete", () => {
        console.log("Route is completed...")
        setPageLoading(false)
    })

    const router = useRouter();
    const params = new URLSearchParams(router.asPath.split(/\?/)[1]);
    const userId = params.get('user_id');

    // user exits in redux
    const setUser = useSelector((state) => state.user);

    // console.log('setUser', setUser);

    useEffect(() => {
        if (!setUser && !userId) {
            return router.push('/userProfile');
        }
    }, []);

    const imageRef = useRef();

    const [loading, setLoading] = useState(false)

    const handleImageChange = async (event) => {
        const file = event.currentTarget.files[0];
        setFieldValue('file', file);

        // Generate a local URL for the selected image file and set it to `values.imageUrl`
        const imageUrl = URL.createObjectURL(file);
        setFieldValue('imageUrl', imageUrl);
    }

    // Formik forms
    const { values, handleSubmit, setFieldValue } = useFormik({
        initialValues: {
            file: ''
        },
        onSubmit: async (values) => {
            setLoading(true)
            // upload user image
            const imageAsset = await client.assets.upload('image', values.file);

            function uploadProfile() {
                return new Promise(async (resolve, reject) => {
                    try {
                        const result = await client.patch(setUser._id).set({
                            profileImage: {
                                _type: 'image',
                                asset: {
                                    _ref: imageAsset._id
                                }
                            }
                        }).commit();

                        // Clear the file field after successful upload
                        setFieldValue('file', '');
                        setLoading(false);
                        router.push('/userProfile');
                        resolve(result);
                    } catch (error) {
                        // If there was an error during the save operation, reject the promise with the error
                        reject(error);
                    }
                });
            }

            toast.promise(
                uploadProfile(),
                {
                    loading: 'Please wait...',
                    success: 'Image Upload Successful. Please wait for the image to be uploaded.',
                    error: '!Opps something went wrong to upload profile.',
                }
            );
        }
    })

    return (
        <>
            <CommonHead title="User Image Upload in Profile - WishBin | Online Shopping site in India" />

            {
                pageLoading === true ? (
                    <Loading />
                ) : (
                    <>
                        <div className='fixed top-0 z-[99999]'>
                            <Toaster />
                        </div>
                        <div className='w-full h-full'>
                            <Header navbar={false} sticky={false} />

                            <main className="max-w-[1366px] mx-auto w-full h-full xl:px-[3rem] xs:px-[1.5rem] px-[1rem] mt-[20px] mb-[7rem] ">
                                <div className='w-full h-max bg-white dark:bg-[#262936] p-[20px] rounded-[10px]'>
                                    {/* title */}
                                    <h1 className='text-[1.5rem] text-black dark:text-[#BABECD] capitalize'>
                                        upload image
                                    </h1>
                                    {/* line */}
                                    <div className='w-full h-[1px] bg-[#d5dbdb] dark:bg-[#96a0a5cc]/40 my-[1rem]'></div>

                                    {/* forms */}
                                    <form onSubmit={handleSubmit} method='POST' className='w-full h-full'>
                                        <div
                                            onClick={() => imageRef.current.click()}
                                            className='w-full flex items-center flex-col gap-[20px] relative justify-center p-[14px] rounded-[5px] border-[1px] border-dashed border-[#707070] cursor-pointer'>
                                            {
                                                values.file === '' ? (
                                                    <span>
                                                        <FaRegImages size={100} className='text-black dark:text-[#BABECD]' />
                                                    </span>
                                                ) : (
                                                    <Image
                                                        title='UserProfile image'
                                                        height={200} width={200}
                                                        src={values.imageUrl}
                                                        alt='userProfile'
                                                        className='w-full h-[200px] object-contain'
                                                    />
                                                )
                                            }
                                            <input
                                                type="file"
                                                name='file'
                                                onChange={(e) => handleImageChange(e)}
                                                className='file:hidden appearance-none hidden'
                                                hidden
                                                ref={imageRef}
                                            />
                                            {/* text */}
                                            <p className='font-[500] capitalize text-black dark:text-[#BABECD] text-[18px]'>Choose to upload image</p>
                                        </div>
                                        {/* upload button */}
                                        <div className='w-full h-max mt-[30px] flex xs:flex-row flex-col gap-[20px] items-center justify-center'>
                                            <button
                                                type='button' role='button' aria-label='cancel-btn'
                                                onClick={() => router.push('/userProfile')}
                                                className={`xs:w-[250px] w-full h-max p-[1rem] rounded-[5px] bg-transparent hover:opacity-80 border-[1px] border-[#e65252] text-[#e65252] font-bold uppercase flex items-center justify-center tracking-[1.5px] gap-[10px] shadow-[0_2px_4px_rgba(0,0,0,0.3)] hover:shadow-none`}>
                                                <TiArrowBack size={20} />
                                                back
                                            </button>
                                            <button
                                                disabled={values.file === '' ? true : false}
                                                type='submit' role='button' aria-label='logout-btn'
                                                className={`xs:w-[250px] ${values.file === '' ? 'opacity-80 cursor-not-allowed' : 'opacity-100 cursor-pointer'} w-full h-max p-[1rem] rounded-[5px] bg-[#f16565] hover:bg-[#e65252] text-white font-bold uppercase flex items-center justify-center tracking-[1.5px] gap-[10px] shadow-[0_2px_4px_rgba(0,0,0,0.3)] hover:shadow-none`}>
                                                {
                                                    loading === true ? (
                                                        <LoadingButton />
                                                    ) : (
                                                        <FaCloudDownloadAlt size={20} />
                                                    )
                                                }
                                                Upload
                                            </button>
                                        </div>
                                    </form>
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

export default UploadImagePage