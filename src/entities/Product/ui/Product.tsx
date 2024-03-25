import React from "react";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";
import { parseISO, differenceInDays } from "date-fns";
import { ProductInterface } from "entities/ProductsData";
import { DeleteIcon, DiscountIcon, EditIcon, EyeIcon } from "shared/assets";
import cls from "./Product.module.scss";
import { i18n } from "shared/providers";

interface ProductProps {
  product: ProductInterface;
  className?: string;
  isAdmin?: boolean;
  onClickDelete?: (productId: number | null) => void;
  onClickDiscount?: (productId: number | null) => void;
  onClickEdit?: (productId: number | null) => void;
}

const Product = ({
  product,
  className,
  isAdmin,
  onClickDelete,
  onClickDiscount,
  onClickEdit,
}: ProductProps) => {
  const navigate = useNavigate();
  const isRu = i18n.language === "ru";

  if (!product) return <></>;

  const createdDate = parseISO(product.createdDate);
  const daysSinceCreation = differenceInDays(new Date(), createdDate);
  const isNew = daysSinceCreation <= 7;

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
      {isAdmin && (
        <EditIcon
          onClick={(e) => {
            e.stopPropagation();
            onClickEdit?.(product.productId);
          }}
          className={cls.edit}
        />
      )}
      {!isNew && product?.image[0]?.discountPrice && !isAdmin && (
        <p className={cls.discountTag}>Reducere</p>
      )}
      {isNew && !isAdmin && <p className={cls.discountTag}>Nou</p>}
      {product?.viewsCount > 10 && !isAdmin && (
        <div className={cls.viewsWrapper}>
          <EyeIcon />
          <p>{product.viewsCount}</p>
        </div>
      )}
      <img
        className={cls.previewImage}
        src={product?.image.length ? product?.image[0].urls[0] : ""}
        alt=""
      />
      <p className={cls.productName}>
        {isRu ? product?.productNameRu : product?.productName}
      </p>
      <div className={cls.priceWrapper}>
        <p
          className={clsx(
            cls.price,
            product?.image[0]?.discountPrice && cls.oldPrice,
          )}
        >
          {product?.image[0]?.price} MDL
        </p>
        {!isAdmin && product.image[0]?.discountPrice ? (
          <p className={cls.price}>
            {product?.image[0]?.discountPrice ??
              product?.image[0]?.discountPrice}{" "}
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
