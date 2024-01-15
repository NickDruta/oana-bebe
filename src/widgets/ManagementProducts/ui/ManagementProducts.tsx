import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  ProductInterface,
  useDeleteProductMutation,
} from "entities/ProductsData";
import { Product } from "entities/Product";
import {
  useGetProductsByFilterMutation,
  useGetProductsTriggerMutation,
} from "entities/ProductsData";
import { AddModalProduct } from "features/AddModalProduct";
import { DiscountModal } from "features/DiscountModal";
import { singleSizePaginationData } from "shared/config";
import { Button, LoadingSpinner, Input } from "shared/ui";
import { AddIcon } from "shared/assets";
import { ProductLoading } from "entities/ProductLoading";
import cls from "./ManagementProducts.module.scss";

type Request = "default" | "filter";

const ManagementProducts = () => {
  const navigate = useNavigate();

  const [typeOfRequest, setTypeOfReqeust] = useState<Request>("default");
  const [isVisible, setIsVisible] = useState(false);
  const ref = useCallback((node: any) => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    });

    if (node) {
      observer.observe(node);
    }
  }, []);
  const [productLoading, setProductLoading] = useState(true);
  const [productsFinished, setProductsFinished] = useState(false);

  const [getProductsTrigger] = useGetProductsTriggerMutation();

  const [getProductsByFilters] = useGetProductsByFilterMutation();
  const [pagination, setPagination] = useState(singleSizePaginationData);
  const [searchValue, setSearchValue] = useState("");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [products, setProducts] = useState<ProductInterface[]>([]);
  const [deleteProduct] = useDeleteProductMutation();
  const [loading, setLoading] = useState(false);
  const [productSelected, setProductSelected] =
    useState<ProductInterface | null>(null);

  const [discountProduct, setDiscountProduct] =
    useState<ProductInterface | null>(null);

  const handleClose = () => {
    isAddModalOpen && setIsAddModalOpen(false);
    isDiscountModalOpen && setIsDiscountModalOpen(false);
    productSelected && setProductSelected(null);
  };

  const handleDelete = (value: number) => {
    deleteProduct(value).then(() => window.location.reload());
  };

  const handleDiscount = (value: number) => {
    setIsDiscountModalOpen(true);

    const discountProduct =
      products &&
      products.find((item: ProductInterface) => item.productId === value);
    if (discountProduct) {
      setDiscountProduct(discountProduct);
    }
  };

  const handleEdit = (value: number) => {
    const product = products.find((item) => item.productId === value);
    if (!product) return;

    setProductSelected(product);
    setIsAddModalOpen(true);
  };

  const changeTypeOfRequest = (typeOfRequest: Request) => {
    console.log("!");
    setTypeOfReqeust(typeOfRequest);
    setPagination(singleSizePaginationData);
    setProducts([]);
    setIsVisible(true);

    if (typeOfRequest !== "filter") {
      setSearchValue("");
    }
  };

  /**
   * Get data(products)
   */
  const fetchProduct = async (pageNumber: number) => {
    const response = await getProductsTrigger({
      ...pagination,
      pageNumber: pageNumber,
    });

    if ("data" in response) {
      setProducts((prevProducts) => [
        ...prevProducts,
        ...response.data.products,
      ]);
      if (!response.data.products.length) {
        setProductsFinished(true);
      }
    } else if ("error" in response) {
      console.error("Error fetching product:", response.error);
    }
    setProductLoading(false);
  };

  /**
   * Get data with some filters applied
   */
  const fetchProductByFilter = async (pageNumber: number) => {
    if (!searchValue) {
      if (typeOfRequest === "filter") {
        changeTypeOfRequest("default");
      }
    }

    setProductLoading(true);
    const response = await getProductsByFilters({
      productName: searchValue ? searchValue : null,
      companyName: null,
      minPrice: null,
      maxPrice: null,
      pageSize: pagination.pageSize,
      pageNumber: pageNumber,
    });
    if ("data" in response) {
      setProducts((prevProducts) => [
        ...prevProducts,
        ...response.data.products,
      ]);
      if (!response.data.products.length) {
        setProductsFinished(true);
      }
    } else if ("error" in response) {
      console.error("Error fetching products by category:", response.error);
    }
    setProductLoading(false);
  };

  const loadNextProducts = async () => {
    setProductLoading(true);
    for (let i = pagination.pageNumber; i < pagination.pageNumber + 6; i++) {
      if (typeOfRequest === "default") {
        await fetchProduct(i);
      } else if (typeOfRequest === "filter") {
        await fetchProductByFilter(i);
      }
    }
    setPagination((prevPagination) => ({
      ...prevPagination,
      pageNumber: pagination.pageNumber + 6,
    }));
    setProductLoading(false);
  };

  useEffect(() => {
    if (!sessionStorage.getItem("admin")) navigate("/management");
  }, []);

  useEffect(() => {
    loadNextProducts();
  }, []);

  useEffect(() => {
    if (isVisible && !productLoading && !productsFinished) {
      loadNextProducts();
      setIsVisible(false);
    }
  }, [isVisible, productLoading]);

  return (
    <div className={cls.managementProductsWrapper}>
      <div className={cls.contentWrapper}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <p className={cls.title}>Produse</p>
          <div style={{display: "flex", alignItems: "center", gap: "12px"}}>
            <Input
              className={cls.maxWidth}
              placeholder={"Cauta produs"}
              value={searchValue}
              handleChange={(value) => {
                setSearchValue(value);
              }}
            />
            <Button
              type="primary"
              text="Aplica"
              onClick={() => changeTypeOfRequest("filter")}
            />
          </div>
        </div>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <div className={cls.productsWrapper}>
              <div
                className={cls.createProduct}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsAddModalOpen(true);
                }}
              >
                <AddIcon style={{ width: 36, height: 36, stroke: "#ffbbeb" }} />
              </div>
              {products &&
                products.map((item: ProductInterface, index: number) => (
                  <Product
                    product={item}
                    key={index}
                    className={cls.product}
                    isAdmin
                    onClickDelete={(value) => handleDelete(value)}
                    onClickDiscount={(value) => handleDiscount(value)}
                    onClickEdit={(value) => handleEdit(value)}
                  />
                ))}
              {!productsFinished ? (
                <div ref={ref}>
                  <ProductLoading />
                </div>
              ) : (
                <></>
              )}
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
      {isAddModalOpen ? (
        <AddModalProduct
          productSelected={productSelected}
          handleClose={handleClose}
        />
      ) : (
        <></>
      )}
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
