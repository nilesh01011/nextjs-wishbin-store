'use client'

import React, { useEffect, useRef } from 'react'
import { FaBaby, FaCouch, FaEvernote, FaHome, FaLaptop, FaMobileAlt, FaMortarPestle, FaPlaystation, FaTshirt } from 'react-icons/fa'
import Link from 'next/link';
import { FiMonitor } from 'react-icons/fi';
import { BsWatch } from 'react-icons/bs'
import { MdMovie } from 'react-icons/md'
import { GiConverseShoe } from 'react-icons/gi'
import { useRouter, usePathname } from 'next/navigation';
import SearchBox from './SearchBox';

function Navbar() {

    // navbar items
    const navbar = [
        {
            id: 1,
            icons: <FaHome size={18} />,
            name: "All product",
            links: '/'
        },
        {
            id: 2,
            icons: <FiMonitor size={18} />,
            name: "Electronics",
            links: '/electronics'
        },
        {
            id: 3,
            icons: <FaEvernote size={18} />,
            name: "Toys",
            links: '/toys'
        },
        {
            id: 4,
            icons: <FaTshirt size={18} />,
            name: "Cloths",
            links: '/cloths'
        },
        {
            id: 5,
            icons: <FaBaby size={18} />,
            name: "Baby Cloths",
            links: '/baby-cloths'
        },
        {
            id: 6,
            icons: <FaMobileAlt size={18} />,
            name: "Mobile",
            links: '/mobile'
        },
        {
            id: 7,
            icons: <FaCouch size={18} />,
            name: "Furniture",
            links: '/furniture'
        },
        {
            id: 8,
            icons: <FaMortarPestle size={18} />,
            name: "Groceries",
            links: '/groceries'
        },
        {
            id: 9,
            icons: <FaPlaystation size={18} />,
            name: "Games",
            links: '/games'
        },
        {
            id: 10,
            icons: <FaLaptop size={18} />,
            name: "Computer",
            links: '/computer'
        },
        {
            id: 11,
            icons: <BsWatch size={18} />,
            name: "Watch",
            links: '/watch'
        },
        {
            id: 12,
            icons: <GiConverseShoe size={18} />,
            name: 'Shoes',
            links: '/shoes'
        },
        {
            id: 13,
            icons: <MdMovie size={18} />,
            name: 'Movie',
            links: '/movie'
        }
    ]

    const router = useRouter();

    const pathname = usePathname();

    // navbar slider with touch

    let isDown = false;
    let startX;
    let scrollLeft;

    const slider = useRef();

    const end = () => {
        isDown = false;
        slider.current.classList.remove('active');
    }

    const start = (e) => {
        isDown = true;
        slider.current.classList.add('active');
        startX = e.pageX || e.touches[0].pageX - slider.current.offsetLeft;
        scrollLeft = slider.current.scrollLeft;
    }

    const move = (e) => {
        if (!isDown) return;

        e.preventDefault();

        const x = e.pageX || e.touches[0].pageX - slider.current.offsetLeft;
        const dist = (x - startX);
        slider.current.scrollLeft = scrollLeft - dist;
    }


    useEffect(() => {
        const sliderEl = slider.current;

        const passiveOption = { passive: true };

        sliderEl.addEventListener('mousedown', start);
        sliderEl.addEventListener('touchstart', start);

        sliderEl.addEventListener('mousemove', move, passiveOption);
        sliderEl.addEventListener('touchmove', move, passiveOption);

        sliderEl.addEventListener('mouseleave', end);
        sliderEl.addEventListener('mouseup', end);
        sliderEl.addEventListener('touchend', end);

    }, [slider]);


    return (
        <div className='max-w-[1366px] mx-auto w-full flex items-center gap-[20px] md:flex-row flex-col xl:px-[3rem] sm:px-[1.5rem] px-[1rem] pt-[20px] pb-[0.7rem]'>
            {/* tabs */}
            <div className='xl:w-[78%] slg:w-[68%] md:w-[72%] w-full overflow-hidden'>
                <div ref={slider} id="overFlowNone" className='slider flex items-center sm:gap-[20px] gap-[15px] overflow-x-scroll'>
                    {
                        navbar.map((ele) => {
                            const { id, name, icons, links } = ele;
                            // dark:bg-[#262936] dark:text-[#BABECD]

                            return (
                                <Link key={id} href={links} onClick={() => router.push(links)} title={`Click to visit the ${name} page`} className={`w-max select-none cursor-pointer flex items-center justify-center rounded-full slg:p-[0.4rem_1rem] p-[0.6rem_1rem] 
                                ${pathname === links ?
                                        'bg-black text-white dark:bg-[#BABECD] dark:text-black' :
                                        'bg-white text-black hover:bg-black hover:text-white dark:hover:bg-[#262936] dark:hover:text-[#BABECD] dark:bg-[#262936]/60 dark:text-[#BABECD]/60'} gap-[0.6rem]`}
                                    style={{ display: 'inline-flex' }}>
                                    <span className='w-max select-none'>{icons}</span>
                                    <p className={`font-[400] w-max text-[16px]`}>{name}</p>
                                </Link>
                            )
                        })
                    }
                </div>
            </div>
            {/* searching inputs */}
            <SearchBox />
        </div>
    )
}

export default Navbar