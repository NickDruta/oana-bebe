import React from "react";
import { useTranslation } from "react-i18next";
import { Swiper } from "features/Swiper";
import { ShortInformation } from "features/ShortInformation";
import { Companies } from "entities/Companies";
import { useGetSliderDataQuery } from "entities/SliderData";
import { StickyInfo } from "entities/StickyInfo";
import { Header } from "features/Header";
import { MobileHeader } from "features/MobileHeader";
import { Footer } from "features/Footer";
import { MessengerIcon, ViberIcon, Whatsapp } from "shared/assets";
import { LoadingSpinner } from "shared/ui";
import cls from "./Home.module.scss";

const Home = () => {
  const { t } = useTranslation();
  const { data: sliders } = useGetSliderDataQuery();

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
        <div className={cls.whatsapp}>
          <a href="https://wa.me/37360223422" target="_blank">
            <Whatsapp />
          </a>
        </div>
        {!sliders ? (
          <LoadingSpinner />
        ) : (
          <>
            <Swiper images={sliders.data} />
            <Companies />
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
