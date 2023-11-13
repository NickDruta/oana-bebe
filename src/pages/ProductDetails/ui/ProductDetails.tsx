import React, { useState } from "react";
import { useParams } from "react-router-dom";
import clsx from "clsx";
import {
  useGetProductDetailsQuery,
  useUpdateViewsQuery,
} from "entities/ProductsData";
import { Button, LoadingSpinner } from "shared/ui";
import cls from "./ProductDetails.module.scss";
import { Header } from "features/Header";
import { MobileHeader } from "features/MobileHeader";
import { StickyInfo } from "entities/StickyInfo";
import { Footer } from "features/Footer";

const ProductDetails = () => {
  const { id } = useParams();
  const { data: product, isLoading } = useGetProductDetailsQuery(id);
  const {} = useUpdateViewsQuery(id);

  const [itemsNumber, setItemsNumber] = useState(1);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleAddCart = () => {
    const cart = localStorage.getItem("cart");
    const cartParsed = cart && JSON.parse(cart);
    const newCart = cartParsed ? [...cartParsed] : [];

    const existingProductIndex = newCart.findIndex(
      (item) =>
        item.productId === id &&
        item.colors[0] === Object.keys(product?.images ?? {})[selectedIndex]
    );

    if (existingProductIndex !== -1) {
      newCart[existingProductIndex].quantity += itemsNumber;
    } else {
      newCart.push({
        productId: id,
        productName: product?.productName,
        quantity: itemsNumber,
        colors: [Object.keys(product?.images ?? {})[selectedIndex]],
      });
    }

    localStorage.setItem("cart", JSON.stringify(newCart));
    window.dispatchEvent(new Event("cart"));
  };

  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <StickyInfo />
          <Header />
          <MobileHeader />
          <div className={cls.productDetailsWrapper}>
            <div className={cls.contentWrapper}>
              <div className={cls.imageWrapper}>
                <img
                  src={`data:image/png;base64,${
                    product
                      ? Object.values(product.images)[selectedIndex].image
                      : ""
                  }`}
                  alt=""
                />
              </div>
              <div className={cls.infoWrapper}>
                <div className={cls.subWrapper}>
                  <p className={cls.productName}>{product?.productName}</p>
                  <div className={cls.priceWrapper}>
                    <p
                      className={clsx(
                        cls.price,
                        product?.isDiscount && cls.oldPrice
                      )}
                    >
                      {product?.images[selectedIndex].price} MDL
                    </p>
                    {product?.images[selectedIndex].discount && (
                      <p className={cls.price}>{product?.images[selectedIndex].discount} MDL</p>
                    )}
                  </div>
                </div>
                <p className={cls.description}>{product?.description}</p>
                <div className={cls.colorsWrapper}>
                  {product?.images.map((item, index) => (
                    <div
                      key={index}
                      className={clsx(
                        cls.color,
                        selectedIndex === index && cls.activeColor
                      )}
                      style={{ background: item.colorName }}
                      onClick={() => setSelectedIndex(index)}
                    />
                  ))}
                </div>
                <div className={cls.actionWrapper}>
                  <div className={cls.numberWrapper}>
                    <p
                      className={clsx(
                        cls.numberItemWrapper,
                        itemsNumber === 1 && cls.disabled
                      )}
                      onClick={() => setItemsNumber(itemsNumber - 1)}
                    >
                      -
                    </p>
                    <p
                      className={clsx(
                        cls.numberItemWrapper,
                        cls.borderNumberItem
                      )}
                    >
                      {itemsNumber}
                    </p>
                    <p
                      className={cls.numberItemWrapper}
                      onClick={() => setItemsNumber(itemsNumber + 1)}
                    >
                      +
                    </p>
                  </div>
                  <Button
                    type="primary"
                    text="Adauga in cos"
                    onClick={handleAddCart}
                  />
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </>
      )}
    </>
  );
};

export default ProductDetails;
