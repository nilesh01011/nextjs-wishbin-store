import Image from 'next/image'
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

// eslint-disable-next-line react/prop-types
function BannerSticker({ bannerImg, mobileBannerSticker, links, bannerName }) {
    // const [loading, setLoading] = useState(false);

    // Router.events.on("routeChangeStart", () => {
    //     console.log("Route is staring...")
    //     setLoading(true)
    // })

    // Router.events.on("routeChangeComplete", () => {
    //     console.log("Route is completed...")
    //     setLoading(false)
    // })

    const router = useRouter();

    const handleClicksLinks = (link) => {
        router.push(link)
    }

    const [isLoadImage, setIsLoadImage] = useState(true);

    return (
        <div className='w-full'>
            <Image
                src={bannerImg && bannerImg}
                height={270}
                width={1280}
                alt={bannerName}
                className={`w-full md:block hidden h-[270px] max-h-72 object-cover cursor-pointer ${isLoadImage === true ? 'blur-sm' : ''}`}
                style={{
                    width: '100%', // Set the desired width
                    height: 'auto', // Maintain the aspect ratio
                    objectFit: 'cover', // Choose the appropriate value ('cover', 'contain', 'fill', etc.)
                }}
                quality={50}
                importance="high"
                title={bannerName}
                rel="none"
                loading="lazy"
                decoding="async"
                onClick={() => handleClicksLinks(links)}
                onLoadingComplete={() => setIsLoadImage(false)}
            />
            {/* mobile sites change banner sticker */}
            <Image
                src={mobileBannerSticker && mobileBannerSticker}
                height={240}
                width={700}
                alt={bannerName}
                title={bannerName}
                className="w-full md:hidden block xs:h-[240px] h-[200px] object-cover cursor-pointer blur-sm"
                quality={50}
                importance="high"
                rel="none"
                loading="lazy"
                decoding="async"
                onClick={() => handleClicksLinks(links)}
                onLoadingComplete={(image) => { setIsLoadImage(false), image.classList.remove("blur-sm") }}
            />
        </div>
    )
}

export default BannerSticker