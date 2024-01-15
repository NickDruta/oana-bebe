import React from "react";
import cls from "./ProductLoading.module.scss";

const ProductLoading = () => {
  return (
    <div className={cls.productLoadingWrapper}>
      <div className={cls.image} />
      <div className={cls.title} />
      <div className={cls.price} />
    </div>
  );
};

export default ProductLoading;
