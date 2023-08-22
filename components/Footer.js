import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react'
import { FaAngleDoubleRight, FaTelegramPlane } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

// eslint-disable-next-line react/prop-types
function Footer({ mainFooter }) {

    const router = useRouter();

    const footerList = [
        {
            id: 1,
            title: 'top categories',
            list: [
                {
                    id: 1.1,
                    text: "men's cloths",
                    links: '/cloths'
                },
                {
                    id: 1.2,
                    text: "women's cloths",
                    links: '/cloths'
                },
                {
                    id: 1.3,
                    text: "mobile",
                    links: '/mobile'
                },
                {
                    id: 1.4,
                    text: "computer accessories",
                    links: '/computer'
                },
                {
                    id: 1.5,
                    text: "games",
                    links: '/games'
                }
            ]
        },
        {
            id: 2,
            title: 'company',
            list: [
                {
                    id: 2.1,
                    text: "about us"
                },
                {
                    id: 2.2,
                    text: "career"
                },
                {
                    id: 2.3,
                    text: "terms & conditions of sales"
                },
                {
                    id: 2.4,
                    text: "leadership"
                },
                {
                    id: 2.5,
                    text: "partners"
                }
            ]
        },
        {
            id: 3,
            title: 'product',
            list: [
                {
                    id: 2.1,
                    text: "how it works"
                },
                {
                    id: 2.2,
                    text: "recommendations"
                },
                {
                    id: 2.3,
                    text: "contact us",
                    links: '/contact'
                },
            ]
        }
    ];

    const footerLogo = '/logo.svg';

    const [isLoadFooterImage, setIsLoadFooterImage] = useState(true);

    return (
        <>
            {
                mainFooter === true &&
                <div className='w-full h-max bg-[#14161D]'>
                    <div className='max-w-[1366px] mx-auto w-full h-full relative xl:px-[3rem] xs:px-[1.5rem] px-[1rem] xs:mt-[6rem] mt-[6.5rem]'>
                        {/* top container */}
                        <div className='h-auto md:p-[3rem] p-[2rem] absolute xl:-top-[13%] md:-top-[9%] xs:-top-[6%] -top-[8%] xl:right-[3rem] xs:right-[1.5rem] right-[1rem] xl:left-[3rem] xs:left-[1.5rem] left-[1rem] rounded-[10px] bg-white dark:bg-[#262936] z-[2] flex xs:flex-row flex-col gap-[10px] xs:items-center items-start justify-between'>
                            {/* contents */}
                            <div className='flex flex-col'>
                                <h2 className='xs:text-[1.5rem] text-[1.3rem] font-bold text-black dark:text-[#BABECD]'>Ready to get started?</h2>
                                <h2 className='xs:text-[1.5rem] text-[1.3rem] font-bold text-black dark:text-[#BABECD]'>Join us today!</h2>
                            </div>
                            {/* contact buttons */}
                            <button onClick={() => router.push('/contact')} type='button' aria-label="get-started" role='button' className='contact-btn w-max h-[50px] rounded-[5px] p-[0.5rem_1.4rem] bg-[#101219] hover:opacity-[0.85] text-white dark:text-[#BABECD] dark:hover:text-[#BABECD] flex items-center justify-center gap-[0.7rem] text-[1.2rem] shadow-[0_2px_4px_rgba(0,0,0,0.3)] hover:shadow-none'>
                                <FaTelegramPlane size={20} />
                                Get started
                            </button>
                        </div>
                        <div className='md:pt-[8rem] sm:pt-[6.5rem] pt-[8.5rem] pb-[2.5rem]'>
                            <div className='w-full h-[1px] bg-[#96a0a5cc]/20 block'></div>
                        </div>
                        {/* bottom container */}
                        <div className='w-full h-full flex xl:flex-row flex-col justify-between xl:gap-0 sm:gap-[40px]'>
                            {/* left side */}
                            <div className='sm:pb-0 pb-[1.6rem] grid md:grid-cols-3 grid-cols-1 gap-[30px] xl:order-1 sm:order-2 order-3 sm:divide-y-0 divide-y-[1px] divide-[#96a0a5cc]/20'>
                                {
                                    footerList.map((ele) => {
                                        const { id, title, list } = ele;

                                        return (
                                            <div key={id} className={`sm:w-max w-full ${id === 1 ? 'pt-0' : 'sm:w-max w-full sm:pt-0 pt-[2rem]'}`}>
                                                {/* title */}
                                                <h1 className='text-[18px] text-white font-bold uppercase mb-[1rem]'>{title}</h1>
                                                {/* footer list */}
                                                <div className='flex flex-col gap-[10px]'>
                                                    {
                                                        list.map((el) => {
                                                            const { id, text, links } = el;
                                                            return (
                                                                <div key={id}>
                                                                    {
                                                                        links ? (
                                                                            <Link href={links} onClick={() => router.push(links)} className='relative w-max flex items-center gap-[3px] cursor-pointer group' style={{ transition: '0.4s cubic-bezier(0.46, 0.03, 0.52, 0.96)' }}>
                                                                                {/* icons */}
                                                                                <FaAngleDoubleRight size={14} className='text-white relative left-0 group-hover:left-[105%]' style={{ transition: '0.4s cubic-bezier(0.46, 0.03, 0.52, 0.96)' }} />
                                                                                {/* text */}
                                                                                <span className='text-[#96a0a5] text-[14px] capitalize group-hover:text-white' style={{ transition: '0.4s cubic-bezier(0.46, 0.03, 0.52, 0.96)' }}>{text}</span>
                                                                            </Link>
                                                                        ) : (
                                                                            <div className='relative w-max flex items-center gap-[3px] cursor-pointer group' style={{ transition: '0.4s cubic-bezier(0.46, 0.03, 0.52, 0.96)' }}>
                                                                                {/* icons */}
                                                                                <FaAngleDoubleRight size={14} className='text-white relative left-0 group-hover:left-[105%]' style={{ transition: '0.4s cubic-bezier(0.46, 0.03, 0.52, 0.96)' }} />
                                                                                {/* text */}
                                                                                <span className='text-[#96a0a5] text-[14px] capitalize group-hover:text-white' style={{ transition: '0.4s cubic-bezier(0.46, 0.03, 0.52, 0.96)' }}>{text}</span>
                                                                            </div>
                                                                        )
                                                                    }
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <div className='sm:hidden block my-[2.5rem] order-2'>
                                <div className='w-full h-[1px] bg-[#96a0a5cc]/20 block'></div>
                            </div>
                            {/* right side */}
                            <div className='flex items-center justify-center sm:flex-row flex-col gap-[10px] xl:order-2 order-1'>
                                {/* footer images */}
                                <Image
                                    src={footerLogo && footerLogo}
                                    alt='footer-logo'
                                    title="footer logo image"
                                    width={208}
                                    height={200}
                                    importance="high"
                                    rel="none"
                                    quality={80}
                                    priority={true}
                                    decoding="async"
                                    className={`w-[208px] h-[200px] object-contain ${isLoadFooterImage === true ? 'blur-sm' : ''}`}
                                />
                                {/* text */}
                                <h1 className='xs:text-[3rem] text-[2.5rem] text-white flex items-baseline underline decoration-[#f16565]'>Wishbin<span className='text-[#f16565] underline decoration-[#f16565]'>.</span>in</h1>
                            </div>
                        </div>
                        {/* footer images */}
                        <div className='w-full sm:block hidden'>
                            <Image src='/footer.png'
                                alt='footer-background'
                                title="footer background image"
                                width={1168}
                                height={300}
                                importance="high"
                                rel="none"
                                quality={80}
                                priority={true}
                                decoding="async"
                                className={`w-full h-[300px] object-contain blur-sm`}
                                onLoadingComplete={(image) => { setIsLoadFooterImage(false), image.classList.remove("blur-sm") }}
                            />
                        </div>
                    </div>
                </div>
            }

            {/* main footer */}
            <div className='w-full h-max p-[8px_16px] bg-black'>
                <div className='text-[12px] text-center text-white flex items-center justify-center'>copyright &copy; 2023
                    <Link
                        href='/'
                        onClick={() => router.push('/')}
                        title="All rights reserved."
                        className="decoration-[#f16565] font-semibold mx-[3px] flex items-center gap-[3px]">
                        <span className='text-[8px] w-[22px] h-[22px] font-black p-[2px] border-2 border-[#f16565] rounded-full flex items-center justify-center'>WB</span>
                        <p className='underline'>
                            Wishbin
                            <span className='text-[#f16565]'>.</span>in
                        </p>
                    </Link>
                    All rights
                    reserved.
                </div>
            </div>
        </>
    )
}

export default Footer