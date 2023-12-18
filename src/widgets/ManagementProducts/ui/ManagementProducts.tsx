import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ProductInterface,
  useDeleteProductMutation,
  useGetProductsQuery,
} from "entities/ProductsData";
import { Product } from "entities/Product";
import { AddModalProduct } from "features/AddModalProduct";
import { DiscountModal } from "features/DiscountModal";
import { PaginationRecord, initPaginationData } from "shared/config";
import { Button, LoadingSpinner } from "shared/ui";
import { AddIcon } from "shared/assets";
import cls from "./ManagementProducts.module.scss";

const ManagementProducts = () => {
  const navigate = useNavigate();
  const [pagination, setPagination] = useState(initPaginationData);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const { data: productsData, isLoading } = useGetProductsQuery(pagination);
  const [deleteProduct] = useDeleteProductMutation();

  const [discountProduct, setDiscountProduct] =
    useState<ProductInterface | null>(null);

  const handleClose = () => {
    isAddModalOpen && setIsAddModalOpen(false);
    isDiscountModalOpen && setIsDiscountModalOpen(false);
  };

  const handleDelete = (value: number) => {
    deleteProduct(value).then(() => window.location.reload());
  };

  const handleDiscount = (value: number) => {
    setIsDiscountModalOpen(true);

    const discountProduct =
      productsData &&
      productsData.products.find(
        (item: ProductInterface) => item.productId === value
      );
    if (discountProduct) {
      setDiscountProduct(discountProduct);
    }
  };

  useEffect(() => {
    if (!sessionStorage.getItem("admin")) navigate("/management");
  }, []);

  useEffect(() => {
    if (productsData) {
      setPagination({
        pageNumber: pagination.pageNumber,
        pageSize: pagination.pageSize,
        totalElements: productsData.totalElements,
        totalPages: productsData.totalPages,
      });
    }
  }, [productsData]);

  return (
    <div className={cls.managementProductsWrapper}>
      <div className={cls.contentWrapper}>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            <p className={cls.title}>Produse</p>
            <div className={cls.productsWrapper}>
              {productsData &&
                productsData.products.map(
                  (item: ProductInterface, index: number) => (
                    <Product
                      product={item}
                      key={index}
                      className={cls.product}
                      isAdmin
                      onClickDelete={(value) => handleDelete(value)}
                      onClickDiscount={(value) => handleDiscount(value)}
                    />
                  )
                )}
              <div
                className={cls.createProduct}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsAddModalOpen(true);
                }}
              >
                <AddIcon style={{ width: 36, height: 36, stroke: "#ffbbeb" }} />
              </div>
            </div>
            {pagination.totalPages > 1 ? (
              <div className={cls.paginationWrapper}>
                {Array.from(
                  {
                    length: pagination.totalPages,
                  },
                  (_, index) => index + 1
                ).map((item) => (
                  <Button
                    key={item}
                    type={
                      item === pagination.pageNumber + 1
                        ? "primary"
                        : "secondary"
                    }
                    text={String(item)}
                    className={cls.paginationItem}
                    onClick={() => {
                      setPagination({
                        pageNumber: item - 1,
                        pageSize: pagination.pageSize,
                        totalElements: pagination.totalElements,
                        totalPages: pagination.totalPages,
                      });
                    }}
                  />
                ))}
              </div>
            ) : (
              <></>
            )}
          </>
        )}
      </div>
      {isAddModalOpen ? <AddModalProduct handleClose={handleClose} /> : <></>}
      {isDiscountModalOpen && discountProduct ? (
        <DiscountModal
          handleClose={handleClose}
          selectedProduct={discountProduct}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default ManagementProducts;
