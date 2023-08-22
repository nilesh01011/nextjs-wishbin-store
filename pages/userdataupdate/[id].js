/* eslint-disable no-undef */
/* eslint-disable no-async-promise-executor */
'use client'

import CommonHead from '../../components/CommonHead';
import Header from '../../components/Header';
import ThemeChanged from '../../components/ThemeChanged';
import { updateUserDataSchema } from '../../formikSchema';
import { client } from '../../sanity';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa'
import bcrypt from 'bcryptjs';
import { useDispatch, useSelector } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';
import Loading from '../../components/Loading';
import { useQuery } from 'react-query';
// import { useSession } from 'next-auth/react';
import { Router } from 'next/router';
import { setUser } from '../../slices/userSlice';
import LoadingButton from '../../components/LoadingButton';

const fetchData = async (user) => {
    const users_json = user;

    try {
        const userData = await client.fetch(`*[_type == 'user' && email == $email][0]`, {
            email: users_json
        });

        return userData;
    } catch (error) {
        // eslint-disable-next-line no-undef
        console.log(error);
    }
}

function Index() {

    const [loading, setLoading] = useState(false);

    Router.events.on("routeChangeStart", () => {
        // eslint-disable-next-line no-undef
        console.log("Route is staring...")
        setLoading(true)
    })

    Router.events.on("routeChangeComplete", () => {
        // eslint-disable-next-line no-undef
        console.log("Route is completed...")
        setLoading(false)
    })

    const [passwordOpen, setPasswordOpen] = useState(false)
    const [passwordOpen_2, setPasswordOpen_2] = useState(false)

    const router = useRouter();
    // const userId = router.query.id;

    const dispatch = useDispatch();

    // next-auth session
    // const { data: session } = useSession();
    // user exists
    const userExists = useSelector((state) => state.user);

    useEffect(() => {
        if (!userExists) {
            // eslint-disable-next-line no-undef
            window.location.href = '/login';
            return router.push('/login');
        }
    }, [userExists])

    // when user clicks to submit button hold for a time
    const [busy, setBusy] = useState(false);

    // fetch the dynamic data from server
    const { data, error } = useQuery("userData-update", () => fetchData(userExists.email), {
        enabled: userExists.email !== undefined,
    })

    if (error) {
        // eslint-disable-next-line no-undef
        return console.log(error)
    }

    // Formik forms
    const { values, errors, touched, handleBlur, handleChange, handleSubmit } = useFormik({
        validationSchema: updateUserDataSchema,
        initialValues: {
            oldPassword: "",
            newPassword: "",
            username: userExists && userExists.username,
            mobile_number: userExists && userExists.mobile_number,
            address: userExists && userExists.address,
        },
        onSubmit: async (values, action) => {
            setBusy(true);

            const user = await client.fetch(`*[_type == "user" && email == $email][0]`, {
                email: userExists.email,
            });

            if (values.oldPassword != '') {
                // eslint-disable-next-line no-inner-declarations
                async function saveUserData(values) {
                    // eslint-disable-next-line no-undef
                    return new Promise(async (resolve, reject) => {
                        try {
                            // Extract the necessary settings data
                            const { oldPassword, newPassword, username, mobile_number, address } = values;
                            // set hashing to new password
                            if (newPassword != '' && bcrypt.compareSync(oldPassword, user.passwordProtect)) {
                                const passwordProtect = bcrypt.hashSync(newPassword);
                                // Update user data using Sanity.io client
                                const updateUserDataWithPassword = await client
                                    .patch(user._id)
                                    .set({ passwordProtect, username, mobile_number, address })
                                    .commit();

                                // Dispatch the setUser action to update the user data
                                dispatch(setUser(updateUserDataWithPassword));

                                setBusy(false);

                                resolve(updateUserDataWithPassword);
                            }
                        } catch (error) {
                            // If there was an error during the save operation, reject the promise with the error
                            reject(error);
                        }
                    });
                }

                toast.promise(
                    saveUserData(values),
                    {
                        loading: 'Saving...',
                        success: 'Your data successfully added to the server, Please refresh to see your current data :)',
                        error: 'Could not save your data :(',
                    }
                );
            } else {
                // eslint-disable-next-line no-inner-declarations
                async function saveUserData(values) {
                    // eslint-disable-next-line no-undef
                    return new Promise(async (resolve, reject) => {
                        try {
                            // Extract the necessary settings data
                            const { username, mobile_number, address } = values;

                            // Update user data using Sanity.io client
                            const updateUserData = await client
                                .patch(user._id)
                                .set({ username, mobile_number, address })
                                .commit();

                            // Dispatch the setUser action to update the user data
                            dispatch(setUser(updateUserData));

                            setBusy(false);

                            // Resolve the promise with the updated user data
                            resolve(updateUserData);
                        } catch (error) {
                            // If there was an error during the save operation, reject the promise with the error
                            reject(error);
                        }
                    });
                }

                // notify the user data successfully added to server
                toast.promise(
                    saveUserData(values),
                    {
                        loading: 'Saving...',
                        success: 'Your data successfully added to the server, Please wait for update your current data :)',
                        error: 'Could not save your data :(',
                    }
                );

                // action.resetForm();
            }

            action.resetForm();
        }
    });

    if (!data) {
        return <Loading />
    }

    return (
        <>
            <CommonHead title="Update your profile - WishBin Store | Online Shopping site in India" />

            {
                loading === true ? (
                    <Loading />
                ) : (
                    <>
                        {/* notify */}
                        <div className='fixed top-0 z-[999999]'>
                            <Toaster />
                        </div>
                        {/* form contents */}
                        <div className='w-full h-full'>
                            <Header navbar={false} sticky={true} />

                            <main className="max-w-[1366px] mx-auto w-full h-full xl:px-[3rem] xs:px-[1.5rem] px-[1rem] mt-[20px]">
                                <div className='slg:w-[750px] w-full mb-[7.5rem] slg:mx-auto rounded-[10px] bg-white dark:bg-[#262936] sm:p-[3rem] p-[2rem] h-full shadow-md'>
                                    {/* title */}
                                    <h1 className='font-[600] text-[1.6rem] text-black dark:text-[#BABECD]'>Edit Your Details</h1>
                                    {/* line */}
                                    <div className='bg-[#eaeaec] dark:bg-[#353740] w-full h-[1px] block my-[0.8rem]'></div>

                                    {/* form contents */}
                                    <form
                                        onSubmit={handleSubmit}
                                        method='post'
                                        autoComplete='off'
                                    >
                                        <div className='flex flex-col gap-[20px] '>
                                            {/* user name */}
                                            <div className='w-full flex flex-col gap-[8px]'>
                                                {/* label */}
                                                <label className='text-[1rem] text-[#272b41b3] dark:text-[#96a0a5]'>User Name</label>
                                                {/* input */}
                                                <input
                                                    type='text'
                                                    name='username'
                                                    placeholder='Your Name'
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.username}
                                                    defaultValue={userExists.username}
                                                    autoComplete='off'
                                                    className={`${errors.username ? 'border-[#ea5455] text-[#ea5455] dark:border-[#ea5455]' : 'border-[#d4d5d9] dark:border-[#96a0a5] text-black dark:text-white'} h-[50px] text-[1.2rem] p-[10px_15px] border-[1px] bg-transparent border-[#d4d5d9] dark:border-[#96a0a5] focus:border-black dark:focus:border-[#BABECD] text-black dark:text-white rounded-[5px]`}
                                                />
                                                {/* error */}
                                                {
                                                    errors.username || touched.username ?
                                                        <p className='text-[14px] text-[#ea5455] flex'>{errors.username}</p>
                                                        : null
                                                }
                                            </div>

                                            {/* email id */}
                                            <div className='w-full flex flex-col gap-[8px]'>
                                                {/* label */}
                                                <label className='text-[1rem] text-[#272b41b3] dark:text-[#96a0a5]'>Email Id</label>
                                                {/* input */}
                                                <input
                                                    readOnly={true}
                                                    type='email'
                                                    disabled
                                                    placeholder='Enter email address'
                                                    value={userExists.email}
                                                    autoComplete='off'
                                                    className='h-[50px] text-[1.2rem] p-[10px_15px] border-[1px] bg-[rgba(239_239_239_0.3)] placeholder:text-black placeholder:dark:text-[#96a0a5] text-black/70 dark:text-white/70 border-[#d4d5d9] dark:border-[#96a0a5] rounded-[5px]'
                                                />
                                            </div>

                                            {/* phone number */}
                                            <div className='w-full flex flex-col gap-[8px]'>
                                                {/* label */}
                                                <label className='text-[1rem] text-[#272b41b3] dark:text-[#96a0a5]'>Phone Number</label>
                                                {/* input */}
                                                <input
                                                    type='tel'
                                                    name='mobile_number'
                                                    maxLength={10}
                                                    placeholder='Enter your phone number'
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.mobile_number}
                                                    defaultValue={userExists.mobile_number ? userExists.mobile_number : null}
                                                    autoComplete='off'
                                                    className={`${errors.mobile_number ? 'border-[#ea5455] text-[#ea5455] dark:border-[#ea5455]' : 'border-[#d4d5d9] dark:border-[#96a0a5] text-black dark:text-white'} h-[50px] text-[1.2rem] p-[10px_15px] border-[1px] bg-transparent placeholder:dark:text-[#96a0a5] border-[#d4d5d9] dark:border-[#96a0a5] focus:border-black dark:focus:border-[#BABECD] rounded-[5px]`}
                                                />
                                                {/* error */}
                                                {
                                                    errors.mobile_number || touched.mobile_number ?
                                                        <p className='text-[14px] text-[#ea5455] flex'>{errors.mobile_number}</p>
                                                        : null
                                                }
                                            </div>

                                            {/* old password */}
                                            <div className='w-full flex flex-col gap-[8px]'>
                                                {/* label */}
                                                <label className='text-[1rem] text-[#272b41b3] dark:text-[#96a0a5]'>Old Password</label>
                                                <div className='w-full relative'>
                                                    {/* input */}
                                                    <input
                                                        type={`${passwordOpen === true ? 'text' : 'password'}`}
                                                        // onChange={(e) => setOldPassword(e.target.value)}
                                                        // value={oldPassword}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.oldPassword && values.oldPassword}
                                                        name='oldPassword'
                                                        placeholder='Enter your old password'
                                                        autoComplete="off"
                                                        className='w-full h-[50px] text-[1.2rem] p-[10px_15px] border-[1px] bg-transparent placeholder:dark:text-[#96a0a5] border-[#d4d5d9] dark:border-[#96a0a5] focus:border-black rounded-[5px]' />
                                                    {/* icons */}
                                                    <span onClick={() => setPasswordOpen(!passwordOpen)} className='absolute right-[15px] top-[35%] cursor-pointer'>
                                                        {
                                                            passwordOpen === true ? (
                                                                <FaRegEye size={18} />
                                                            ) : (
                                                                <FaRegEyeSlash size={18} />
                                                            )
                                                        }
                                                    </span>
                                                </div>
                                            </div>

                                            {/* New password */}
                                            <div className='w-full flex flex-col gap-[8px]'>
                                                {/* label */}
                                                <label className='text-[1rem] text-[#272b41b3] dark:text-[#96a0a5]'>New Password</label>
                                                <div className='w-full relative'>
                                                    {/* input */}
                                                    <input
                                                        type={`${passwordOpen_2 === true ? 'text' : 'password'}`}
                                                        // onChange={(e) => setNewPassword(e.target.value)}
                                                        // value={newPassword}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.newPassword && values.newPassword}
                                                        name='newPassword'
                                                        placeholder='Enter your old password'
                                                        autoComplete="off"
                                                        className={`${errors.newPassword ? 'border-[#ea5455] text-[#ea5455] dark:border-[#ea5455]' : 'border-[#d4d5d9] dark:border-[#96a0a5] text-black dark:text-white'} w-full h-[50px] text-[1.2rem] p-[10px_15px] border-[1px] bg-transparent placeholder:dark:text-[#96a0a5] border-[#d4d5d9] focus:border-black dark:focus:border-[#BABECD] dark:border-[#96a0a5] rounded-[5px]`} />
                                                    {/* icons */}
                                                    <span onClick={() => setPasswordOpen_2(!passwordOpen_2)} className='absolute right-[15px] top-[35%] cursor-pointer'>
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
                                                        errors.newPassword && touched.newPassword ?
                                                            <p className='text-[14px] text-[#ea5455] flex'>{errors.newPassword}</p>
                                                            : null
                                                    }
                                                </div>
                                            </div>

                                            {/* address */}
                                            <div className='w-full flex flex-col gap-[8px]'>
                                                {/* label */}
                                                <label className='text-[1rem] text-[#272b41b3] dark:text-[#96a0a5]'>Your shipping address</label>
                                                {/* input */}
                                                <input
                                                    type='text'
                                                    name='address'
                                                    placeholder='Enter your shipping address'
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.address && values.address}
                                                    defaultValue={userExists.address ? userExists.address : null}
                                                    autoComplete='off'
                                                    className={`${errors.address ? 'border-[#ea5455] text-[#ea5455] dark:border-[#ea5455]' : 'border-[#d4d5d9] dark:border-[#96a0a5] text-black dark:text-white'} w-full h-[50px] text-[1.2rem] p-[10px_15px] border-[1px] bg-transparent placeholder:dark:text-[#96a0a5] border-[#d4d5d9] dark:border-[#96a0a5] focus:border-black dark:focus:border-[#BABECD] rounded-[5px]`}
                                                />

                                                {/* error */}
                                                {
                                                    errors.address || touched.address ?
                                                        <p className='text-[14px] text-[#ea5455] flex'>{errors.address}</p>
                                                        : null
                                                }
                                            </div>
                                        </div>
                                        {/* submit button */}
                                        <div className='w-full fixed bottom-0 left-0 bg-white dark:bg-[#262936] shadow-2xl'>
                                            <div className='flex items-center w-full slg:w-[750px] mx-auto slg:px-0 xs:px-[1.5rem] px-[1rem] py-[25px] gap-[20px]'>
                                                <button onClick={() => router.push('/userProfile')} type='cancel' value='Cancel' role='button' aria-label='cancel' className='w-full h-[50px] shadow-[0_2px_4px_rgba(0,0,0,0.3)] hover:shadow-none rounded-[10px] font-[600] border-2 border-black dark:border-[#BABECD] hover:bg-black dark:hover:bg-[#a6aab9]/10 hover:text-white text-black dark:text-[#BABECD] xs:text-[16px] text-[14px] bg-transparent uppercase tracking-[0.8px]'>discard</button>
                                                <button type='submit' disabled={busy} role='button' aria-label='save-details' value='Save Details' className={`w-full h-[50px] shadow-[0_2px_4px_rgba(0,0,0,0.3)] hover:shadow-none rounded-[10px] font-[600] ${busy === true ? 'bg-[#e65252]' : 'bg-[#f16565] hover:bg-[#e65252]'} hover:text-white text-white border-2 border-[#f16565] xs:text-[16px] text-[14px] uppercase tracking-[0.8px] flex items-center justify-center gap-[6px]`}>
                                                    {
                                                        busy === true ? (
                                                            <>
                                                                <LoadingButton />
                                                                Saving...
                                                            </>
                                                        ) : 'Save changes'
                                                    }
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </main>

                            {/* Footer */}
                            {/* <Footer mainFooter={true} /> */}
                        </div >
                        <ThemeChanged bottomUpper='slg:bottom-[40px] bottom-[110px]' />
                    </>
                )
            }

        </>
    )
}

export default Index