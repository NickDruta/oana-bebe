import React from "react";
import { useTranslation } from "react-i18next";
import { ProductsOwerview } from "widgets/ProductsOwerview";
import { Swiper } from "features/Swiper";
import { ShortInformation } from "features/ShortInformation";
import { Companies } from "entities/Companies";
import { useGetSliderDataQuery } from "entities/SliderData";
import {
  useGetDiscountProductsQuery,
  useGetNewProductsQuery,
} from "entities/ProductsData";
import { StickyInfo } from "entities/StickyInfo";
import { Header } from "features/Header";
import { MobileHeader } from "features/MobileHeader";
import { Footer } from "features/Footer";
import { MessengerIcon, ViberIcon } from "shared/assets";
import { LoadingSpinner } from "shared/ui";
import cls from "./Home.module.scss";

const Home = () => {
  const { t } = useTranslation();
  const { data: sliderImages, isLoading: isSliderLoading } =
    useGetSliderDataQuery();
  const { data: newProducts, isLoading: isNewProductsLoading } =
    useGetNewProductsQuery();
  const { data: discountProducts, isLoading: isDiscountProductsLoading } =
    useGetDiscountProductsQuery();

  return (
    <>
      <StickyInfo />
      <Header />
      <MobileHeader />
      <div className={cls.homeWrapper}>
        <div className={cls.viber}>
          <a href="viber://chat?number=+37360223422" target="_blank">
            <ViberIcon />
          </a>
        </div>
        <div className={cls.messenger}>
          <a href="http://m.me/oanabebe.md" target="_blank">
            <MessengerIcon />
          </a>
        </div>
        {isSliderLoading ||
        isNewProductsLoading ||
        isDiscountProductsLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            {sliderImages && sliderImages.images ? (
              <Swiper images={sliderImages.images.slice(0, 11).reverse() ?? [""]} />
            ) : (
              <></>
            )}
            <Companies />
            {newProducts && newProducts.products.length ? (
              <ProductsOwerview
                title={t("content:NEW_OFFERS")}
                products={newProducts.products}
              />
            ) : (
              <></>
            )}
            {discountProducts && discountProducts.products.length ? (
              <ProductsOwerview
                title={t("content:SPECIAL_OFFERS")}
                products={discountProducts.products}
              />
            ) : (
              <></>
            )}
            <ShortInformation
              description={t("content:SHORT_INFORMATION_DESCRIPTION")}
              withButtons
            />
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Home;
