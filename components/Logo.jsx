/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import Image from 'next/image'
import React from 'react'

function Logo(props) {
    const { renderDefault, title } = props
    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <Image
                src='/logo.svg'
                alt='sanity-custom-logo'
                width={30}
                height={30}
                loading="lazy"
                decoding="async"
                quality={80}
                importance="high"
                rel="none"
                style={{ width: '30px', height: '30px', objectFit: 'cover', borderRadius: '50%' }}
            />
            {renderDefault && <>{renderDefault(props)}</>}
        </div>
    )
}

export default Logo