import React from "react";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";
import { ProductInterface } from "entities/ProductsData";
import { DeleteIcon, DiscountIcon, EyeIcon } from "shared/assets";
import cls from "./Product.module.scss";
import { i18n } from "shared/providers";

interface ProductProps {
  product: ProductInterface;
  className?: string;
  isAdmin?: boolean;
  onClickDelete?: (productId: number) => void;
  onClickDiscount?: (productId: number) => void;
}

const Product = ({
  product,
  className,
  isAdmin,
  onClickDelete,
  onClickDiscount,
}: ProductProps) => {
  const navigate = useNavigate();
  const isRu = i18n.language === 'ru';

  return (
    <div
      className={clsx(cls.productWrapper, className)}
      onClick={() => !isAdmin && navigate(`/produse/${product.productId}`)}
    >
      {isAdmin && (
        <DeleteIcon
          onClick={() => onClickDelete?.(product.productId)}
          className={cls.delete}
        />
      )}
      {isAdmin && (
        <DiscountIcon
          onClick={(e) => {
            e.stopPropagation();
            onClickDiscount?.(product.productId);
          }}
          className={cls.discount}
        />
      )}
      {(product.isDiscount || product.haveDiscount) && !isAdmin && (
        <p className={cls.discountTag}>Reducere</p>
      )}
      {product.viewsCount > 10 && !isAdmin && (
        <div className={cls.viewsWrapper}>
          <EyeIcon />
          <p>{product.viewsCount}</p>
        </div>
      )}
      <img
        className={cls.previewImage}
        src={`data:image/png;base64,${
          product.images
            ? product.images[0].image
            : product.imageShortDetails?.imageDate
        }`}
        alt=""
      />
      <p className={cls.productName}>{isRu ? product.productNameRu : product.productName}</p>
      <div className={cls.priceWrapper}>
        <p
          className={clsx(
            cls.price,
            (product.isDiscount || product.haveDiscount) && cls.oldPrice
          )}
        >
          {product.images ? product.images[0].price : product.imageShortDetails?.price} MDL
        </p>
        {!isAdmin &&
        (product.imageShortDetails?.imageDiscountPrice || product.images?.[0].discount) ? (
          <p className={cls.price}>
            {product.imageShortDetails?.imageDiscountPrice ??
              product.images[0].discount}{" "}
            MDL
          </p>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default Product;
