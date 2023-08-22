/* eslint-disable no-undef */
import { searchQuerySchema } from '../formikSchema';
import { client } from '../sanity';
import { useFormik } from 'formik';
import debounce from 'lodash.debounce';
import React, { useEffect, useRef, useState } from 'react'
import { FaSearch } from 'react-icons/fa';
import imageUrlBuilder from '@sanity/image-url'
import Image from 'next/image';
import { useRouter } from 'next/router';

// images builders
const builder = imageUrlBuilder({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECTID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
})
const urlFor = (source) => builder.image(source);

// when clicks outside of the box will disappear
let useClickOutSide = (handler) => {
    let domNode = useRef();

    useEffect(() => {
        const handlerEvent = (e) => {
            if (!domNode.current.contains(e.target)) {
                handler();
            }
        }

        document.addEventListener("mousedown", handlerEvent);

        return () => {
            document.removeEventListener("mousedown", handlerEvent)
        }
    }, [handler]);

    return domNode
}

function SearchBox() {

    const router = useRouter()

    const [getSearchProduct, setGetSearchProduct] = useState([]);

    // useFormik
    const formik = useFormik({
        validationSchema: searchQuerySchema,
        initialValues: {
            query: '',
        },
        onSubmit: async () => {
            // Handle form submission if needed

            // return action.resetForm();
        }
    });

    const [isSearchText, setIsSearchText] = useState('');

    // debounced onChanged
    const debouncedSearch = debounce(async (searchQuery) => {
        try {
            const query = searchQuery !== '' ? searchQuery : null;

            const searched = await client.fetch(`*[_type == "product" && (name match $query || description match $query || categoryTitle match $query || soldBy match $query || body match $query)]`, { query });

            return setGetSearchProduct(searched);
        } catch (error) {
            console.log('error for fetching in debounced', error);
        }
    }, 300)

    const [isModelOpen, setIsModelOpen] = useState(false)

    let domNode = useClickOutSide(() => {
        setIsModelOpen(false);
    })

    const handleQuerySearch = (e) => {
        const { value } = e.target;
        formik.setFieldValue('query', value);
        debouncedSearch(value);
        setIsSearchText(value);
    }

    const highlightMatches = (text) => {
        const pattern = new RegExp(`${isSearchText}`, "gi");
        return text.replace(pattern, match => `<mark>${match}</mark>`);
    };

    return (
        <>
            <form ref={domNode} onSubmit={formik.handleSubmit}
                className={`xl:w-[28%] slg:w-[30%] md:w-[45%] w-full h-[46px] flex relative rounded-[20px] dark:shadow-[0_0_2px_0_#aaa]`}>
                <input type='text'
                    placeholder='Search Games, Cloths, Mobile, etc...'
                    name='query'
                    value={formik.values.query}
                    onBlur={formik.handleBlur}
                    onChange={(e) => handleQuerySearch(e)}
                    onClick={() => setIsModelOpen(true)}
                    className={`placeholder:text-[16px] dark:text-[#BABECD] placeholder:font-[500] flex-1 w-full slg:p-[8px_0_8px_20px] p-[10px_0_10px_20px] bg-white dark:bg-[#101219] rounded-[20px] focus:border-black dark:focus:border-[#babecd] focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-[#babecd]`} />
                {/* search icons */}
                <button type='submit' role='button' aria-label='search' className='cursor-pointer absolute right-0 top-0 bottom-0 h-full flex items-center justify-center bg-white dark:bg-[#101219] rounded-[20px] px-[15px] slg:py-[12px] py-[15px]'>
                    {/* border-[1px] border-[#B5B5B6] border-l-0 dark:border-[#BABECD] */}
                    <FaSearch size={16} className='text-[#96a0a5] dark:text-[#BABECD]' />
                </button>

                {
                    isModelOpen && formik.values.query === '' &&
                    <div className='absolute max-h-[360px] -bottom-[110%] z-[9997] w-full overflow-y-auto box-border bg-white dark:bg-[#262936] p-[0.6rem_0.8rem] text-[14px] shadow-[0_2px_4px_rgba(0,0,0,0.3)] rounded-[5px]'>No products Found</div>
                }

                {
                    isModelOpen && formik.values.query !== '' &&
                    <div className='flex items-center flex-col divide-y-[1px] divide-[#d5dbdb] dark:divide-[#353740] border-[1px] border-[#d5dbdb] dark:border-[#353740] absolute max-h-[360px] top-[110%] z-[9997] w-full overflow-y-auto box-border bg-white dark:bg-[#262936] text-[14px] rounded-[5px]'>
                        {
                            getSearchProduct.slice(0, 8).map((ele) => {
                                const { _id, name, image, categoryTitle } = ele;

                                return (
                                    <div onClick={() => router.push(`/product-details/${_id}`)} key={_id} className={`w-full ${getSearchProduct[0] && 'pb-[10px]'} p-[0.6rem_0.8rem] group cursor-pointer flex items-center gap-[8px] h-max hover:bg-[#eaeded] hover:dark:bg-[#101219]/60`}>
                                        {/* left side */}
                                        <div className='w-max'>
                                            {/* images */}
                                            <Image src={urlFor(image).url()}
                                                alt={name}
                                                height={45}
                                                width={40}
                                                className='w-[40px] h-[45px] object-contain z-[10] relative'
                                                priority={true}
                                                quality={80}
                                                importance="high"
                                                rel="preload"
                                            />
                                        </div>
                                        {/* images and name */}
                                        <div className='w-full flex flex-col gap-[4px]'>
                                            {/* name */}
                                            <p className={`text-[14px] font-[500]`} dangerouslySetInnerHTML={{ __html: highlightMatches(name) }}></p>
                                            {/* categoryTitle */}
                                            <div className='w-full flex items-center justify-end'>
                                                <span className='w-max h-max capitalize font-[500] group-hover:shadow-[0_1px_2px_rgba(0,0,0,0.2)] p-[0.2rem_0.8rem] bg-[#E7EDEF] dark:bg-[#101219] text-[12px] rounded-[10px]'>{categoryTitle}</span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                }

                {/* {
                    formik.values.query !== '' &&
                    <div className='w-full h-screen fixed top-[115px] left-0 right-0 bottom-0 bg-black/80 z-[9998] cursor-pointer'></div>
                } */}
            </form >
        </>
    )
}

export default SearchBox;
