import React, {useEffect, useState} from "react";
import { useTranslation } from "react-i18next";
import { Swiper } from "features/Swiper";
import { ShortInformation } from "features/ShortInformation";
import { Companies } from "entities/Companies";
import { useGetSliderDataMutation } from "entities/SliderData";
import { StickyInfo } from "entities/StickyInfo";
import { Header } from "features/Header";
import { MobileHeader } from "features/MobileHeader";
import { Footer } from "features/Footer";
import {MessengerIcon, ViberIcon, Whatsapp} from "shared/assets";
import { LoadingSpinner } from "shared/ui";
import cls from "./Home.module.scss";

const Home = () => {
    const { t } = useTranslation();
    const [getSliderData] = useGetSliderDataMutation();
    const [sliderImages, setSliderImages] = useState<string[]>([]);

    // Use a function to fetch all images in parallel and then update the state once.
    const fetchSliderImages = async () => {
        try {
            // Start all fetch operations in parallel.
            const fetchPromises = Array.from({ length: 10 }, (_, i) => getSliderData(i + 4).unwrap());

            // Wait for all fetches to complete.
            const results = await Promise.all(fetchPromises);
            // console.log(results.map(item => console.log(item.images[0].length)))


            // Update the state once with all the fetched images.
            setSliderImages(results.flatMap(result => result.images));
        } catch (error) {
            console.error('Failed to fetch slider images:', error);
        }
    };


    useEffect(() => {
        fetchSliderImages();
    }, []);

    return (
        <>
            <StickyInfo />
            <Header />
            <MobileHeader />
            <div className={cls.homeWrapper}>
                <div className={cls.viber}>
                    <a href="viber://chat?number=+37360223422" target="_blank">
                        <ViberIcon/>
                    </a>
                </div>
                <div className={cls.messenger}>
                    <a href="http://m.me/oanabebe.md" target="_blank">
                        <MessengerIcon/>
                    </a>
                </div>
                <div className={cls.whatsapp}>
                    <a href="https://wa.me/37360223422" target="_blank">
                        <Whatsapp />
                    </a>
                </div>
                {!sliderImages.length ? (
                    <LoadingSpinner/>
                ) : (
                    <>
                        <Swiper images={sliderImages.reverse()}/>
                        <Companies/>
                        {/*{newProducts && newProducts.products.length ? (*/}
                        {/*  <ProductsOwerview*/}
                        {/*    title={t("content:NEW_OFFERS")}*/}
                        {/*    products={newProducts.products}*/}
                        {/*  />*/}
                        {/*) : (*/}
                        {/*  <></>*/}
                        {/*)}*/}
                        {/*{discountProducts && discountProducts.products.length ? (*/}
                        {/*  <ProductsOwerview*/}
                        {/*    title={t("content:SPECIAL_OFFERS")}*/}
                        {/*    products={discountProducts.products}*/}
                        {/*  />*/}
                        {/*) : (*/}
                        {/*  <></>*/}
                        {/*)}*/}
                        <ShortInformation
                            description={t("content:SHORT_INFORMATION_DESCRIPTION")}
                            withButtons
                        />
                    </>
                )}
            </div>
            <Footer/>
        </>
    );
};

export default Home;