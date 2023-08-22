/* eslint-disable no-undef */
'use client'

import CommonHead from '../components/CommonHead'
import Footer from '../components/Footer'
import Header from '../components/Header'
import Loading from '../components/Loading'
import ThemeChanged from '../components/ThemeChanged'
import Image from 'next/image'
import { Router, useRouter } from 'next/router'
import React, { useState } from 'react'
import { FaLongArrowAltLeft } from 'react-icons/fa'

function NotFound() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  Router.events.on("routeChangeStart", () => {
    console.log("Route is staring...")
    setLoading(true)
  })

  Router.events.on("routeChangeComplete", () => {
    console.log("Route is completed...")
    setLoading(false)
  })
  return (
    <>
      <CommonHead title="404 Not Found - WishBin Store | Online Shopping site in India." />

      {
        loading ? (
          <Loading />
        ) : (
          <>
            <div className='w-full h-full'>
              <Header sticky={true} navbar={false} />

              <main className="max-w-[1366px] mx-auto w-full h-full xl:px-[3rem] md:px-[1.5rem] px-[1rem]">
                <div className='p-[20px] w-full h-full bg-white dark:bg-[#373B4D] rounded-[10px] xl:mb-[6.7rem] md:mb-[6.4rem] xs:mb-[6rem] mb-[7.2rem]'>
                  {/* images */}
                  <Image
                    src='/errorimages.webp'
                    alt='empty-cart'
                    width={420}
                    height={300}
                    loading="lazy"
                    decoding="async"
                    quality={50}
                    importance="high"
                    rel="none"
                    className='w-full xs:h-[300px] h-[200px] object-contain'
                    title='Error Images'
                  />
                  {/* contents */}
                  <div className='xs:mt-[3rem] mt-[2rem] flex items-center justify-center flex-col'>
                    <h1 className='xs:text-[2rem] text-[24px] font-[500] text-black dark:text-[#BABECD]'>404 Page not found</h1>
                    <p className='text-[#96a0a5] mt-[0.4rem] xs:mb-[1rem] mb-[0.7rem] xs:text-[1.10rem] mobile:text-[15px] text-[14px] text-center'>Oops! Looks like you followed a bad link. If you think this is a problem with us, please tell us.</p>
                    {/* button */}
                    <button onClick={() => router.push('/')} type='button' role='button' aria-label='continue-shopping' className='md:w-[340px] text-[18px] shadow-[0_2px_4px_rgba(0,0,0,0.3)] hover:shadow-none w-full h-[50px] bg-[#101219] hover:opacity-75 text-white dark:text-[#BABECD] flex items-center justify-center gap-[10px] p-[0.5rem_1.4rem] rounded-[6px]'>
                      {/* icons */}
                      <FaLongArrowAltLeft size={20} />
                      Back to Home Page
                    </button>
                  </div>
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

export default NotFound