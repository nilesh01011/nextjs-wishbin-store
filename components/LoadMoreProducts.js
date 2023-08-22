'use client'

import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react'
import LoadingButton from './LoadingButton';
import Cards from './Cards';
import { FaChevronDown } from 'react-icons/fa';
import BannerSticker from './BannerSticker';

function LoadMoreProducts({ products, allProduct, showMoreProduct, setShowMoreProduct }) {
    const [isLoadMore, setIsLoadMore] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [randomProducts, setRandomProduct] = useState([]);

    const fetchNewProducts = () => {
        let existingData = [];

        // Check if each item in the new data exists in the existing data
        const filteredNewData = allProduct.filter((newItem) => {
            return !products.some((existingItem) => existingItem._id === newItem._id);
        });

        // Reduce the new data to remove duplicates (if any)
        const reducedNewData = filteredNewData.reduce((acc, currentItem) => {
            // Assuming 'id' is a unique identifier
            const isDuplicate = acc.some((item) => item._id === currentItem._id);
            if (!isDuplicate) {
                acc.push(currentItem);
            }
            return acc;
        }, []);

        // Push the new items (after reducing) to the existing array
        existingData.push(...reducedNewData);

        // eslint-disable-next-line no-undef
        const getNewData = Array.from(existingData.reduce((a, o) => a.set(o.categoryTitle, o), new Map()).values());
        const randomLoadMoreProduct = getNewData.sort(() => Math.random() - 0.5);

        setRandomProduct(randomLoadMoreProduct);
    }

    useEffect(() => {
        fetchNewProducts();
    }, [])

    const handleGetMoreProducts = () => {
        setIsLoading(true)
        // eslint-disable-next-line no-undef
        setTimeout(() => {
            setIsLoadMore(!isLoadMore);
            setIsLoading(false);
            setShowMoreProduct(!showMoreProduct);
        }, 2000);
    };

    // bannerBox images and video
    const bannerSticker = '/bannerSticker/Toys_Add.webp';
    const mobileBannerSticker = '/bannerSticker/Mobile_Toys_Add.webp';

    return (
        <div className='w-full h-full'>
            {/* product data */}
            {
                isLoadMore === true && showMoreProduct === true &&
                <>
                    <Cards cardsList={randomProducts} />
                    {/* banner sticker 2 */}
                    <div className='md:mt-[10px] mt-[5px] mb-[30px]'>
                        <BannerSticker bannerImg={bannerSticker} mobileBannerSticker={mobileBannerSticker} links='/toys' bannerName='Baby Toys Collections' />
                    </div>
                </>
            }
            {/* load more buttons */}
            <div className={`w-full h-max flex ${isLoadMore === true && 'mt-[10px]'} items-center justify-center`}>
                <button onClick={() => handleGetMoreProducts()} className='w-[180px] h-max p-[0.8rem_1.8rem] bg-black dark:bg-[#262936] dark:text-[#B5BECD] text-white hover:opacity-80 font-[500] flex items-center justify-center gap-[10px] rounded-[5px] capitalize'>
                    {
                        isLoadMore === false ? 'load more' : 'less data'
                    }
                    {
                        isLoading === true ? (
                            <LoadingButton />
                        ) : (
                            <FaChevronDown size={17} className={`${isLoadMore === true ? 'rotate-180' : ''} w-[25px] flex items-center justify-center transition-all duration-300`} />
                        )
                    }
                </button>
            </div>
        </div>
    )
}

export default LoadMoreProducts;

// PropTypes
LoadMoreProducts.propTypes = {
    products: PropTypes.array.isRequired,
    allProduct: PropTypes.array.isRequired,
    showMoreProduct: PropTypes.bool.isRequired,
    setShowMoreProduct: PropTypes.func.isRequired
};