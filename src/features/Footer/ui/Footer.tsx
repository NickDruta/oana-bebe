import React from "react";
import { useTranslation } from "react-i18next";
import { useLocation, Link } from "react-router-dom";
import {
  FacebookIcon,
  InstagramIcon,
  LocationIcon,
  PhoneIcon,
} from "shared/assets";
import cls from "./Footer.module.scss";

const Footer = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();

  return (
    <div className={cls.footerWrapper}>
      <div className={cls.contentWrapper}>
        <div className={cls.primaryInfoWrapper}>
          <div className={cls.navigationWrapper}>
            <Link to="/" className={pathname === "/" ? cls.activeLink : ""}>
              {t("content:HOME")}
            </Link>
            <Link
              to="/produse"
              className={pathname === "/produse" ? cls.activeLink : ""}
            >
              {t("content:PRODUCTS")}
            </Link>
            <Link
              to="/despre"
              className={pathname === "/despre" ? cls.activeLink : ""}
            >
              {t("content:ABOUT")}
            </Link>
            <Link
              to="/contacte"
              className={pathname === "/contacte" ? cls.activeLink : ""}
            >
              {t("content:CONTACTS")}
            </Link>
          </div>
          <div className={cls.socialWrapper}>
            <a
              href="https://www.instagram.com/oanabebe.md"
              target="_blank"
              rel="noreferrer"
            >
              <InstagramIcon />
            </a>
            <a
              href="https://www.facebook.com/oanabebe.md"
              target="_blank"
              rel="noreferrer"
            >
              <FacebookIcon />
            </a>
          </div>
          <div className={cls.infoWrapper}>
            <div className={cls.itemWrapper}>
              <LocationIcon />
              <p>
                <a
                  rel="noreferrer"
                  target="_blank"
                  href="https://www.google.com/maps/place/Carucioare+Anex+in+Moldova+(Chisinau)/@47.0437225,28.8660977,17z/data=!4m6!3m5!1s0x40c97da0a31514db:0x2108b9770caaac24!8m2!3d47.0434229!4d28.8678753!16s%2Fg%2F11h3wtwzr9?entry=ttu"
                >
                  {t("content:STREET")}
                </a>
              </p>
            </div>
            <div className={cls.itemWrapper}>
              <PhoneIcon />
              <p>
                <a href="tel:+37360-223-422">060-223-422</a> /{" "}
                <a href="tel:+37378-410-807">078-410-807</a>
              </p>
            </div>
          </div>
        </div>
        <p className={cls.copyRight}>© 2023 Oana Bébé</p>
      </div>
    </div>
  );
};

export default Footer;
