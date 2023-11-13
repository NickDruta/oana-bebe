import React from "react";
import { useTranslation } from "react-i18next";
import { Companies } from "entities/Companies";
import { StickyInfo } from "entities/StickyInfo";
import { Header } from "features/Header";
import { MobileHeader } from "features/MobileHeader";
import { Footer } from "features/Footer";
import { ShortInformation } from "features/ShortInformation";
import cls from "./About.module.scss";

const About = () => {
  const { t } = useTranslation();

  return (
    <>
      <StickyInfo />
      <Header />
      <MobileHeader />
      <div className={cls.aboutWrapper}>
        <ShortInformation description={t("content:ABOUT_PAGE_DESCRIPTION")} />
        <Companies />
      </div>
      <Footer />
    </>
  );
};

export default About;
