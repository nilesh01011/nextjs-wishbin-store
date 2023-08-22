/* eslint-disable no-undef */
/* eslint-disable react/react-in-jsx-scope */
"use client"

import PropTypes from 'prop-types';
import Header from '../components/Header'
import ThemeChanged from '../components/ThemeChanged'
import Banner from '../components/Banner'
import CategoryCard from '../components/CategoryCard'
import BannerSticker from '../components/BannerSticker'
import Cards from '../components/Cards'
import CommonHead from '../components/CommonHead'
import OffersContainer from '../components/OffersContainer'
import Footer from '../components/Footer'
import { useEffect, useState } from 'react'
import { Router } from 'next/router'
import Loading from '../components/Loading'
import { client } from '../sanity'
import LoadMoreProducts from '../components/LoadMoreProducts'

export default function HomePage({ newBanner, category, firstNewProduct, allProduct }) {

  const [loading, setLoading] = useState(false);

  const [showMoreProduct, setShowMoreProduct] = useState(false);

  Router.events.on("routeChangeStart", () => {
    console.log("Route is staring...")
    setLoading(true)
  })

  Router.events.on("routeChangeComplete", () => {
    console.log("Route is completed...")
    setLoading(false)
  })

  const bannerVideo = './video/valhalla.mp4'
  const bannerBoxImages = '/bannerBoxImg/valhalla.webp';

  // bannerBox images and video
  const bannerSticker = '/bannerSticker/Game_Add.webp';
  const mobileBannerSticker = '/bannerSticker/mobile-game-add.webp';

  const bannerSticker_2 = '/bannerSticker/Fashion_Add.webp';
  const mobileBannerSticker_2 = '/bannerSticker/Mobile_Fashion_Add.webp'

  const bannerBoxTitle = 'Games 2023';
  const bannerBoxText = "Assassin's Creed Valhalla"

  // const { data, error } = useSwr('/', fetchData);

  // if (!data) return <Loading />

  // if (error) {
  //   // eslint-disable-next-line no-undef
  //   return console.log(error)
  // }

  useEffect(() => {

  }, [])

  return (
    <>
      <CommonHead title="WishBin Store | Online Shopping site in India" />

      {
        loading === true ? (
          <Loading />
        ) : (
          <>
            <div id='Container' className=' w-full h-full'>
              <Header sticky={true} />

              <main className="w-full h-full max-w-[1366px] mx-auto">
                {/* Banner */}
                <Banner bannerVideo={bannerVideo && bannerVideo} bannerBoxImages={bannerBoxImages && bannerBoxImages} bannerData={newBanner && newBanner} bannerBoxTitle={bannerBoxTitle} bannerBoxText={bannerBoxText} />
                {/* category cards */}
                <CategoryCard category={category && category} />
                {/* banner sticker */}
                <div className='mt-[25px] mb-[35px]'>
                  <BannerSticker bannerImg={bannerSticker} mobileBannerSticker={mobileBannerSticker} links='/games' bannerName='PS Games 2023' />
                </div>
                {/* products list */}
                <Cards cardsList={firstNewProduct && firstNewProduct} />
                {/* banner sticker 2 */}
                <div className='md:mt-[10px] mt-[5px] mb-[30px]'>
                  <BannerSticker bannerImg={bannerSticker_2} mobileBannerSticker={mobileBannerSticker_2} links='/cloths' bannerName='Fashions Collections 2023' />
                </div>

                {/* load more button */}
                <div className='slg:mb-[7.5rem] xs:mb-[7rem] mobile:mb-[7.5rem] mb-[7.7rem]'>
                  <LoadMoreProducts products={firstNewProduct && firstNewProduct} allProduct={allProduct} setShowMoreProduct={setShowMoreProduct} showMoreProduct={showMoreProduct} />
                </div>

                {/* offers container */}
                <OffersContainer />
              </main>
              {/* Footer */}
              <Footer mainFooter={true} />
            </div>
            {/* theme changed */}
            <ThemeChanged />
          </>
        )
      }

    </>
  )
}

// PropTypes
HomePage.propTypes = {
  allProduct: PropTypes.array.isRequired,
  firstNewProduct: PropTypes.array.isRequired,
  newBanner: PropTypes.array.isRequired,
  category: PropTypes.array.isRequired
};

// SSR and fetch category and banner and products
export const getServerSideProps = async () => {
  // product data query fetch
  const productQuery = `*[_type == 'product']{
    _id,
    name,
    rating,
    categoryTitle,
    mrp,
    price,
    qty,
    description,
    "image":image.asset->url
  }`;
  const allProduct = await client.fetch(productQuery);

  const firstNewProduct = Array.from(allProduct.reduce((a, o) => a.set(o.categoryTitle, o), new Map()).values());

  // category data query fetch
  const categoryQuery = `*[_type == 'category']{
    _id,
    links,
    bgColor,
    title,
    "image":image.asset->url
  }`;
  const category = await client.fetch(categoryQuery);
  // banner data query fetch
  const randomBannerQuery = `*[_type == 'bannerImage']`;
  const bannerImage_2 = await client.fetch(randomBannerQuery);
  const randomSubset = Array.from(bannerImage_2.reduce((a, o) => a.set(o.links, o), new Map()).values());
  const shuffledSubset = randomSubset.sort(() => Math.random() - 0.5);

  const newBanner = shuffledSubset.slice(0, 6);


  return {
    props: {
      category,
      newBanner,
      firstNewProduct,
      allProduct
    }
  }
}
