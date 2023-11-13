import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { StickyInfo } from "entities/StickyInfo";
import { Header } from "features/Header";
import { MobileHeader } from "features/MobileHeader";
import { Footer } from "features/Footer";
import cls from "./NotFound.module.scss";

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <>
      <StickyInfo />
      <Header />
      <MobileHeader />
      <div className={cls.contentWrapper}>
        <Link to="/">{t("content:BACK_HOME")}</Link>
      </div>
      <Footer />
    </>
  );
};

export default NotFound;
