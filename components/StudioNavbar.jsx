/* eslint-disable react/prop-types */
import Link from 'next/link'
import React from 'react'
import { TiArrowBack } from 'react-icons/ti'

function StudioNavbar(props) {
    return (
        <div>
            <div style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                {/* icons */}
                <Link href='/' title="Click to visit the WishBin-store website" style={{ textTransform: 'capitalize', display: 'flex', alignItems: 'center', color: '#F7Ab0A', gap: '5px', textDecoration: 'none' }}>
                    <TiArrowBack style={{ color: '#F7Ab0A', height: '1.5rem', width: '1.5rem' }} />
                    Go to website
                </Link>
            </div>
            <>{props.renderDefault(props)}</>
        </div>
    )
}

export default StudioNavbar