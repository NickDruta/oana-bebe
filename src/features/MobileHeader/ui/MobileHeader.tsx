import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Logo, BurgerMenuIcon, CartIcon } from "shared/assets";
import { useClickAwayListener } from "shared/hooks";
import { i18n } from "shared/providers";
import { Switcher } from "shared/ui";
import cls from "./MobileHeader.module.scss";
import CloseIcon from "../../../shared/assets/icons/CloseIcon";

const MobileHeader = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const [cart, setCart] = useState([]);
  const [isBurgerOpen, setIsBurgerOpen] = useState(false);

  const changeLanguage = (value: string) => {
    localStorage.setItem("I18N_LANGUAGE", value);
    i18n.changeLanguage(value);
  };

  const handleClickAway = () => {
    setIsBurgerOpen(false);
  };
  const wrapperRef = useClickAwayListener({ handleClickAway });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 800) {
        setIsBurgerOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const cart = localStorage.getItem("cart");

    setCart(cart ? JSON.parse(cart) : []);

    window.addEventListener("cart", () => {
      const cart = localStorage.getItem("cart");
      setCart(cart ? JSON.parse(cart) : []);
    });

    return window.removeEventListener("cart", () => {});
  }, []);

  return (
    <div className={cls.mobileHeaderWrapper}>
      <Link to="/">
        <Logo />
      </Link>
      <BurgerMenuIcon
        onClick={(e) => {
          e.stopPropagation();
          setIsBurgerOpen(true);
        }}
        className={cls.burgerIcon}
      />
      {isBurgerOpen ? (
        <div ref={wrapperRef} className={cls.burgerWrapper}>
          <div className={cls.closeBtn} onClick={() => setIsBurgerOpen(false)}>
            <CloseIcon />
          </div>
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
          <Link to="/catalog" className={cls.catalogWrapper}>
            <CartIcon />
            {cart.length ? (
              <div className={cls.catalogCount}>{cart.length}</div>
            ) : (
              <></>
            )}
          </Link>
          {/*<Switcher*/}
          {/*  className={cls.switcher}*/}
          {/*  selectedOption={i18n.language}*/}
          {/*  options={["ro", "ru"]}*/}
          {/*  onChange={changeLanguage}*/}
          {/*/>*/}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default MobileHeader;
