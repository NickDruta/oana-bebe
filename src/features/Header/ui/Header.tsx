import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CartIcon, Logo } from "shared/assets";
import cls from "./Header.module.scss";

const Header = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const [cart, setCart] = useState([]);

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
    <div className={cls.headerWrapper}>
      <Link to="/">
        <Logo />
      </Link>
      <div className={cls.itemsWrapper}>
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
      </div>
    </div>
  );
};

export default Header;
