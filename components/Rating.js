import React from 'react'
import { FaRegStar, FaStar, FaStarHalfAlt } from 'react-icons/fa'

// eslint-disable-next-line react/prop-types
function Rating({ rating }) {

    const stars = Array.from({ length: 5 }, (ele, index) => {
        let number = index + 0.5;

        return <span role="img" aria-label="Rating: 4 out of 5" key={index} className='text-[16px] text-[#ffa41c]'>
            {
                rating >= index + 1 ? (<FaStar className='lg:text-[18px] md:text-[16px] text-[14px]' />)
                    : rating >= number ? (<FaStarHalfAlt className='lg:text-[18px] md:text-[16px] text-[14px]' />)
                        : (<FaRegStar className='lg:text-[18px] md:text-[16px] text-[14px]' />)
            }
        </span>
    })

    return (
        <>
            {stars}
        </>
    )
}

export default Rating