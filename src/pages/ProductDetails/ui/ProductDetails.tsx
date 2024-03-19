import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import clsx from "clsx";
import {
  ImageShortInferface,
  useGetProductDetailsQuery,
  useUpdateViewsQuery,
} from "entities/ProductsData";
import { Button, LoadingSpinner } from "shared/ui";
import cls from "./ProductDetails.module.scss";
import { Header } from "features/Header";
import { MobileHeader } from "features/MobileHeader";
import { StickyInfo } from "entities/StickyInfo";
import { Footer } from "features/Footer";
import { i18n } from "shared/providers";

const ProductDetails = () => {
  const queryParameters = new URLSearchParams(window.location.search);
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: product, isLoading } = useGetProductDetailsQuery(id);
  // const {} = useUpdateViewsQuery(id);
  const isRu = i18n.language === "ru";

  const [itemsNumber, setItemsNumber] = useState(1);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);


  const handleAddCart = () => {
    const cart = localStorage.getItem("cart");
    const cartParsed = cart && JSON.parse(cart);
    const newCart = cartParsed ? [...cartParsed] : [];

    const existingProductIndex = newCart.findIndex(
      (item) =>
        item.productId === id &&
        item.colors[0] === Object.keys(product?.image ?? {})[selectedIndex]
    );

    if (existingProductIndex !== -1) {
      newCart[existingProductIndex].quantity += itemsNumber;
    } else {
      newCart.push({
        productId: id,
        productName: product?.productName,
        quantity: itemsNumber,
        colors: product?.image[selectedIndex].color,
      });
    }

    localStorage.setItem("cart", JSON.stringify(newCart));
    window.dispatchEvent(new Event("cart"));
  };

  const parseSpecifications = (specificationsString: string) => {
    if (specificationsString === "{}") return <></>;

    const specsObject: Record<string, string> = {};

    const specsArray = specificationsString.replace(/[{}]/g, "").split(", ");
    specsArray.forEach((spec) => {
      const [key, value] = spec.split("=");
      if (key && value) {
        specsObject[key.trim()] = value.trim();
      }
    });

    return (
      <div className={cls.specificationsWrapper}>
        <h2 className={cls.specificationsTitle}>Specificatii</h2>
        {Object.entries(specsObject).map(([key, value], index) => (
          <div key={index} className={cls.specificationItem}>
            <span className={cls.specificationKey}>{key}</span>
            <span className={cls.specificationValue}>{value}</span>
          </div>
        ))}
      </div>
    );
  };

  useEffect(() => {
    const color = queryParameters.get("color")
    if (color) {
      setSelectedIndex(Number(color))
    }
  }, []);

  useEffect(() => {
    navigate({
      search: `?color=${selectedIndex}`
    });
  }, [selectedIndex]);

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
              <div>
                <div className={cls.imageWrapper}>
                  <img
                    src={
                      product
                        ? product.image[selectedIndex].urls[selectedImageIndex]
                        : ""
                    }
                    alt=""
                  />
                </div>
                <div className={cls.imagesPreview}>
                  {product &&
                    product.image[selectedIndex].urls.map((item, index) => (
                      <img
                        src={item}
                        alt=""
                        className={cls.previewSmallImage}
                        onClick={() => setSelectedImageIndex(index)}
                      />
                    ))}
                </div>
              </div>
              <div className={cls.infoWrapper}>
                <div className={cls.subWrapper}>
                  <p className={cls.productName}>
                    {isRu ? product?.productNameRu : product?.productName}
                  </p>
                  <div className={cls.priceWrapper}>
                    <p
                      className={clsx(
                        cls.price,
                        product?.image[selectedIndex].discountPrice && cls.oldPrice
                      )}
                    >
                      {product?.image[selectedIndex].price} MDL
                    </p>
                    {product?.image[selectedIndex].discountPrice && (
                      <p className={cls.price}>
                        {product?.image[selectedIndex].discountPrice} MDL
                      </p>
                    )}
                  </div>
                </div>
                <pre className={cls.description}>
                  {isRu ? product?.descriptionRu : product?.description}
                </pre>
                <p className={cls.description}>
                  {product &&
                    parseSpecifications(
                      isRu ? product.specifications : product.specifications
                    )}
                </p>
                <div className={cls.colorsWrapper}>
                  {product?.image.map((item, index) => (
                    <div
                      key={index}
                      className={clsx(
                        cls.color,
                        selectedIndex === index && cls.activeColor
                      )}
                      style={{ background: item.color }}
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
  )
};

export default ProductDetails;
