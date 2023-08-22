/* eslint-disable no-async-promise-executor */
/* eslint-disable no-undef */
'use client'

import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import { TiArrowBack } from 'react-icons/ti'
import CommonHead from '../components/CommonHead';
import { useFormik } from 'formik';
import { newPasswordSchema } from '../formikSchema';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import LoadingButton from '../components/LoadingButton';
import { useRouter } from 'next/navigation';
import { verifyResetToken } from '../utils/resetpasswordToken';
import bcrypt from 'bcryptjs';
import { client } from '../sanity';

function ResetPasswordPage() {
    const router = useRouter();

    const [getDecodeToken, setGetDecodeToken] = useState('');

    let token;

    if (router.query) {
        token = router.query.token;
    }

    useEffect(() => {
        if (!token) {
            return router.push('/login')
        }
    }, [token])

    useEffect(() => {
        async function checkTokenExpiration() {
            if (token) {
                try {
                    const decodedToken = verifyResetToken(token);
                    console.log('Decoded Token:', decodedToken);

                    const { email, exp } = decodedToken;
                    setGetDecodeToken(email);

                    // Get the current time in seconds (Unix timestamp)
                    const currentTimeInSeconds = Math.floor(Date.now() / 1000);

                    if (currentTimeInSeconds >= exp) {
                        console.log('Token has expired.');

                        return setTimeout(() => {
                            toast.error('Token has expired please send it again a forget email...!');
                            router.push('/login');
                        }, 1000);
                    } else {
                        console.log('Token is still valid.');
                    }
                } catch (error) {
                    console.error('Invalid token: ' + error.message);
                }
            }
        }

        checkTokenExpiration();
    }, [token]); // Run the effect whenever 'token' changes

    console.log(getDecodeToken)

    const [loading, setLoading] = useState(false);

    const [ShowPasswordSuccess, setShowPasswordSuccess] = useState(false);

    const [passwordOpen, setPasswordOpen] = useState(false);

    const [passwordOpen_2, setPasswordOpen_2] = useState(false);

    // useFormik
    const { values, errors, touched, handleBlur, handleChange, handleSubmit } = useFormik({
        validationSchema: newPasswordSchema,
        initialValues: {
            password: '',
            confirm_password: '',
        },
        onSubmit: async (values) => {
            setLoading(true);

            function passwordCredentials() {
                return new Promise(async (resolve, reject) => {
                    try {
                        const emailSend = setTimeout(async () => {

                            const userExists = await client.fetch(`*[_type == "user" && email == $email][0]`, {
                                email: getDecodeToken,
                            });

                            if (!userExists) {
                                return toast.error('User not found');
                            }

                            const passwordProtect = bcrypt.hashSync(values.password);
                            // Update user data using Sanity.io client
                            const updateUserDataWithPassword = await client
                                .patch(userExists._id)
                                .set({ passwordProtect })
                                .commit();

                            console.log(updateUserDataWithPassword)

                            setLoading(false);
                            setShowPasswordSuccess(true);

                            return updateUserDataWithPassword;

                        }, 2000);

                        resolve(emailSend);
                    } catch (error) {
                        // If there was an error during the save operation, reject the promise with the error
                        reject(error);
                    }
                });
            }

            toast.promise(
                passwordCredentials(),
                {
                    loading: 'Updating a password...',
                    success: 'Successful updated your password now you can login...!',
                    error: '!Opps something went wrong to update a password.',
                }
            );
            // action.resetForm();
        }
    });
    return (
        <>
            <CommonHead title="Forget password of WishBin Store | Online Shopping site in India" />
            <div className='fixed top-0 z-[99999]'>
                <Toaster />
            </div>
            {/* from-[#f3f3f3] to-[#e7edef] */}
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
                                    <span className={`animate-ping absolute inline-flex h-[65%] w-[65%] rounded-full transition-all duration-[3s] ${ShowPasswordSuccess === true ? 'bg-green-500' : 'bg-[#fd5555]/90'} opacity-75`} style={{ transition: 'all 2s cubic-bezier(0.18, 0.89, 0.43, 1.19)' }}></span>
                                    <span className={`animate-ping absolute inline-flex h-[80%] w-[80%] rounded-full transition-all duration-[1.5s] ${ShowPasswordSuccess === true ? 'bg-green-500' : 'bg-[#fd5555]/70'} opacity-75`} style={{ transition: 'all 1.5s cubic-bezier(0.18, 0.89, 0.43, 1.19)' }}></span>

                                    {
                                        ShowPasswordSuccess === true ? (
                                            <svg className='z-[10] shadow-[0_2px_4px_rgba(0,0,0,0.3)] rounded-full' width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <rect x="8" y="8" width="32" height="32" rx="16" fill="white" />
                                                <path d="M48 24C48 30.3652 45.4714 36.4697 40.9706 40.9706C36.4697 45.4714 30.3652 48 24 48C17.6348 48 11.5303 45.4714 7.02944 40.9706C2.52856 36.4697 0 30.3652 0 24C0 17.6348 2.52856 11.5303 7.02944 7.02944C11.5303 2.52856 17.6348 0 24 0C30.3652 0 36.4697 2.52856 40.9706 7.02944C45.4714 11.5303 48 17.6348 48 24ZM36.09 14.91C35.8757 14.6965 35.6206 14.5283 35.3398 14.4156C35.059 14.303 34.7584 14.2481 34.456 14.2542C34.1535 14.2604 33.8554 14.3275 33.5795 14.4515C33.3035 14.5755 33.0554 14.7539 32.85 14.976L22.431 28.251L16.152 21.969C15.7255 21.5716 15.1613 21.3552 14.5784 21.3655C13.9955 21.3758 13.4394 21.6119 13.0271 22.0241C12.6149 22.4364 12.3788 22.9925 12.3685 23.5754C12.3582 24.1583 12.5746 24.7225 12.972 25.149L20.91 33.09C21.1238 33.3035 21.3785 33.4717 21.6588 33.5846C21.939 33.6975 22.2391 33.7528 22.5412 33.7472C22.8433 33.7416 23.1412 33.6752 23.4171 33.552C23.693 33.4288 23.9412 33.2512 24.147 33.03L36.123 18.06C36.5313 17.6355 36.7568 17.0678 36.7512 16.4789C36.7456 15.8899 36.5093 15.3266 36.093 14.91H36.09Z" fill="#0F902C" />
                                            </svg>
                                        ) : (
                                            <svg stroke="#fd5555" className='z-[10]' fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="2em" width="2em" xmlns="http://www.w3.org/2000/svg"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path></svg>
                                        )
                                    }
                                </p>
                                {/* title */}
                                <h1 className='z-50 sm:text-3xl text-2xl text-bold text-black'>
                                    {
                                        ShowPasswordSuccess === true ? ("Password reset") : ("Set new password")
                                    }

                                    {/* 🔒 */}
                                </h1>
                                {/* paras */}
                                <p className='z-50 text-[1rem] text-black w-full mx-auto mt-[1rem] mb-[1.5rem] font-[400] text-center'>
                                    {
                                        ShowPasswordSuccess === true ? (
                                            <span>Your password has been successfully reset. <br /> Click below to log in Credentials.</span>
                                        ) : (
                                            <span>Your new password must be different to <br /> previously used passwords.</span>
                                        )
                                    }
                                </p>
                                {/* button popup */}
                                <form onSubmit={handleSubmit} className='lg:w-[350px] w-full flex items-center flex-col justify-center transition-all duration-300'>

                                    {/* password fields */}
                                    {
                                        ShowPasswordSuccess === false &&
                                        <div className='w-full flex flex-col gap-[8px]'>
                                            <div className='fields h-max w-full mb-[20px] ' style={{ transition: '1s cubic-bezier(0.46, 0.03, 0.52, 0.96)' }}>
                                                <label className='text-sm font-bold mb-[0.4rem] block text-black'>Password</label>
                                                <div className='w-full relative'>
                                                    {/* input */}
                                                    <input
                                                        type={`${passwordOpen === true ? 'text' : 'password'}`}
                                                        onChange={handleChange} onBlur={handleBlur} value={values.password}
                                                        name='password'
                                                        placeholder='Enter your password'
                                                        autoComplete="off"
                                                        className={`${errors.password ? 'border-[#ea5455] text-[#ea5455] dark:border-[#ea5455]' : 'border-[#d4d5d9] dark:border-[#96a0a5] text-black'} w-full h-[50px] text-[0.8rem] p-[10px_15px] border-[1px] bg-transparent placeholder:dark:text-[#96a0a5] border-[#d4d5d9] focus:border-black dark:focus:border-[#BABECD] dark:border-[#96a0a5] rounded-[5px]`} />
                                                    {/* icons */}
                                                    <span onClick={() => setPasswordOpen(!passwordOpen)} className='absolute right-[15px] top-[10px] cursor-pointer text-black'>
                                                        {
                                                            passwordOpen === true ? (
                                                                <FaRegEye size={18} />
                                                            ) : (
                                                                <FaRegEyeSlash size={18} />
                                                            )
                                                        }
                                                    </span>

                                                    {/* error */}
                                                    {
                                                        errors.password && touched.password ?
                                                            <p className='text-[12px] text-[#ea5455] flex'>{errors.password}</p>
                                                            : null
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    }

                                    {/* confirmed password fields */}
                                    {
                                        ShowPasswordSuccess === false &&
                                        <div className='w-full flex flex-col gap-[8px]'>
                                            <div className='fields h-max w-full mb-[20px] ' style={{ transition: '1s cubic-bezier(0.46, 0.03, 0.52, 0.96)' }}>
                                                <label className='text-sm font-bold mb-[0.4rem] block text-black'>Confirm Password</label>
                                                <div className='w-full relative'>
                                                    {/* input */}
                                                    <input
                                                        type={`${passwordOpen_2 === true ? 'text' : 'password'}`}
                                                        onChange={handleChange} onBlur={handleBlur} value={values.confirm_password}
                                                        name='confirm_password'
                                                        placeholder='Enter your confirm password'
                                                        autoComplete="off"
                                                        className={`${errors.confirm_password ? 'border-[#ea5455] text-[#ea5455] dark:border-[#ea5455]' : 'border-[#d4d5d9] dark:border-[#96a0a5] text-black'} w-full h-[50px] text-[0.8rem] p-[10px_15px] border-[1px] bg-transparent placeholder:dark:text-[#96a0a5] border-[#d4d5d9] focus:border-black dark:focus:border-[#BABECD] dark:border-[#96a0a5] rounded-[5px]`} />
                                                    {/* icons */}
                                                    <span onClick={() => setPasswordOpen_2(!passwordOpen_2)} className='absolute right-[15px] top-[10px] cursor-pointer text-black'>
                                                        {
                                                            passwordOpen_2 === true ? (
                                                                <FaRegEye size={18} />
                                                            ) : (
                                                                <FaRegEyeSlash size={18} />
                                                            )
                                                        }
                                                    </span>

                                                    {/* error */}
                                                    {
                                                        errors.confirm_password && touched.confirm_password ?
                                                            <p className='text-[12px] text-[#ea5455] flex'>{errors.confirm_password}</p>
                                                            : null
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    }

                                    {
                                        ShowPasswordSuccess === true ? (
                                            <Link href='/login' className='font-[500] z-50 h-[55px] w-full p-[0.5rem_1.3rem] text-center bg-[#fd5555] rounded-[10px] text-white hover:bg-[#ec4b4b] transition-all duration-300 flex items-center justify-center gap-[10px]'>
                                                Continue
                                            </Link>
                                        ) : (
                                            <button type='submit' role='button' aria-label='reset-password' className='font-[500] z-50 h-[55px] w-full p-[0.5rem_1.3rem] text-center bg-[#fd5555] rounded-[10px] text-white hover:bg-[#ec4b4b] transition-all duration-300 flex items-center justify-center gap-[10px]'>
                                                {
                                                    loading === true &&
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

export default ResetPasswordPage;