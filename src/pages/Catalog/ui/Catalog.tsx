import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { StickyInfo } from "entities/StickyInfo";
import { Header } from "features/Header";
import { MobileHeader } from "features/MobileHeader";
import { Footer } from "features/Footer";
import { AddMobileModal } from "features/AddMobileModal";
import { Button } from "shared/ui";
import cls from "./Catalog.module.scss";

const Catalog = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const cart = localStorage.getItem("cart");
  const parsedCart = cart && JSON.parse(cart);

  const handleIncreaseQuantity = (index: number) => {
    const updatedCart = [...parsedCart];
    updatedCart[index].quantity += 1;
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.location.reload();
  };

  const handleDecreaseQuantity = (index: number) => {
    const updatedCart = [...parsedCart];
    if (updatedCart[index].quantity > 1) {
      updatedCart[index].quantity -= 1;
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      window.location.reload();
    }
  };

  const handleRemoveProduct = (index: number) => {
    const updatedCart = [...parsedCart];
    updatedCart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.location.reload();
  };

  return (
    <>
      <StickyInfo />
      <Header />
      <MobileHeader />
      <div className={cls.catalogWrapper}>
        {cart ? <p className={cls.title}>{t("content:CATALOG")}</p> : <></>}
        <div className={cls.dataWrapper}>
          {parsedCart && parsedCart.length ? (
            parsedCart.map((item: any, index: number) => (
              <div className={cls.item} key={index}>
                <Link to={`/produse/${item.productId}`} target="_blank">
                  {item.productName}
                </Link>
                <div className={cls.quantityWrapper}>
                  <p
                    className={cls.quantityAction}
                    onClick={() => handleDecreaseQuantity(index)}
                  >
                    -
                  </p>
                  <p className={cls.quantity}>{item.quantity}</p>
                  <p
                    className={cls.quantityAction}
                    onClick={() => handleIncreaseQuantity(index)}
                  >
                    +
                  </p>
                </div>
                <div className={cls.colors}>
                    <div
                      className={cls.color}
                      style={{ backgroundColor: item.colors }}
                    ></div>
                </div>
                <p
                  className={cls.remove}
                  onClick={() => handleRemoveProduct(index)}
                >
                  x
                </p>
              </div>
            ))
          ) : (
            <p className={cls.title}>{t("content:ADD_TO_CART_TO_SEE")}</p>
          )}
        </div>
        {parsedCart && parsedCart.length ? (
          <Button
            type="primary"
            text={t('content:COMMAND')}
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(true);
            }}
          />
        ) : (
          <></>
        )}
        {isOpen ? (
          <AddMobileModal handleClickAway={() => setIsOpen(false)} />
        ) : (
          <></>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Catalog;
