/* eslint-disable no-undef */
import { useTheme } from 'next-themes'
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { CiDark, CiLight } from 'react-icons/ci'

// eslint-disable-next-line react/prop-types
function ThemeChanged({ bottomUpper }) {
    const router = useRouter();

    // eslint-disable-next-line no-unused-vars
    const [detailsPage, setDetailsPage] = useState(false);

    useEffect(() => {
        if (router.pathname !== '/') {
            setDetailsPage(true)
        }
    }, [router.pathname])

    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true)
    }, [])

    // eslint-disable-next-line no-undef
    const currentTheme = theme === 'system' ? systemTheme : theme;

    const handleThemeChange = () => {
        if (currentTheme === "dark") {
            setTheme("light")
        }

        if (currentTheme === "light") {
            setTheme("dark")
        }
    }

    useEffect(() => {
        if (theme === "dark") {
            // document.querySelector("body").style.backgroundColor = '#0B0B0C'
            document.querySelector("body").style.backgroundColor = '#101219'
        }

        if (theme === "light") {
            document.querySelector("body").style.backgroundColor = '#e7edef'
        }
    })

    if (!mounted) return null;

    return (
        <>
            <div className={`fixed ${bottomUpper ? bottomUpper : 'bottom-[40px]'} xl:right-[3rem] xs:right-[1.5rem] right-[1rem] rounded-full z-50`}>
                <button type='button' role='button' aria-label="theme-changed" onClick={() => handleThemeChange()} className='theme-btn w-[50px] h-[50px] bg-[#101219] dark:bg-[#858999] outline-none rounded-full flex items-center justify-center shadow-[0_2px_4px_rgba(0,0,0,0.3)] hover:shadow-none'>
                    {
                        currentTheme === "dark" ? (
                            <CiLight className="text-white dark:text-black" size={24} />
                        ) : (
                            <CiDark className="text-white dark:text-black" size={24} />
                        )
                    }
                </button>
            </div>
        </>
    )
}

export default ThemeChanged