import React from "react";
import { Product } from "entities/Product";
import { ProductInterface } from "entities/ProductsData";
import cls from "./ProductsOverview.module.scss";

interface ProductsOverviewProps {
  title: string;
  products: ProductInterface[];
}

const ProductsOverview = ({ title, products }: ProductsOverviewProps) => {
  return (
    <div className={cls.productsOwerviewWrapper}>
      <p className={cls.title}>{title}</p>
      <div className={cls.productsWrapper}>
        {products.map((product, index) => (
          <Product key={index} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductsOverview;
