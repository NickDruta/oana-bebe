import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  ProductInterface,
  useDeleteProductMutation,
  useGetProductsQuery,
} from "entities/ProductsData";
import { Product } from "entities/Product";
import { AddModalProduct } from "features/AddModalProduct";
import { EditProduct } from "features/EditProduct";
import { DiscountModal } from "features/DiscountModal";
import {
  companies,
  initPaginationData,
  defaultFilters,
  FiltersState,
} from "shared/config";
import { Input, LoadingSpinner, Select } from "shared/ui";
import { AddIcon } from "shared/assets";
import cls from "./ManagementProducts.module.scss";
import { ConfigProvider, Pagination } from "antd";

const ManagementProducts = () => {
  const navigate = useNavigate();
  const [triggerDelete] = useDeleteProductMutation();

  /**
   * Pagination state
   */
  const [pagination, setPagination] = useState(initPaginationData);

  /**
   * Filters state
   */
  const [filters, setFilters] = useState(defaultFilters);

  /**
   * Query for products
   */
  const {
    data: products,
    isLoading: isProductsLoading,
    isFetching: isProductsFetching,
  } = useGetProductsQuery({
    companyName: filters.companiesSelected?.length
      ? filters.companiesSelected
      : undefined,
    productName: filters.searchValue,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    categoryId: filters.categoryId,
    pageSize: pagination.pageSize,
    pageNumber: pagination.pageNumber,
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [productSelected, setProductSelected] =
    useState<ProductInterface | null>(null);

  /**
   * Handling filter changing
   * @param newFilters
   */
  const handleFiltersChange = (newFilters: Partial<FiltersState>) => {
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters, ...newFilters };

      setPagination(initPaginationData);

      return updatedFilters;
    });
  };

  const handleClose = () => {
    isDiscountModalOpen && setIsDiscountModalOpen(false);
    isAddModalOpen && setIsAddModalOpen(false);
    isEditModalOpen && setIsEditModalOpen(false);
    setProductSelected(null);
  };

  useEffect(() => {
    if (!sessionStorage.getItem("jwt")) navigate("/management");
  }, []);

  const handleDelete = async (productId: number | null) => {
    if (!productId) return;

    try {
      await triggerDelete(productId).unwrap();

      toast.success("Produsul a fost șters cu succes!");
      setPagination(initPaginationData);
      handleFiltersChange(filters);
    } catch (error: any) {
      console.error(error);
      toast.error(
        `Eroare la ștergerea produsului: ${error?.data?.error || error?.response?.data?.message || "An unknown error occurred"}`,
      );
    }
  };

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
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Select
              options={companies}
              value={filters.companiesSelected?.[0] ?? ""}
              placeholder={"Companie"}
              handleChange={(value) =>
                handleFiltersChange({
                  ...filters,
                  companiesSelected: value ? [value] : null,
                })
              }
              optionsClassName={cls.optionsClassName}
            />
            <Input
              className={cls.maxWidth}
              placeholder={"Cauta produs"}
              value={filters.searchValue ?? ""}
              handleChange={(value) => {
                handleFiltersChange({
                  ...filters,
                  searchValue: value ? value : null,
                });
              }}
            />
          </div>
        </div>
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
            {isProductsLoading || isProductsFetching ? (
              <LoadingSpinner />
            ) : !products?.data.length ? (
              <p className={cls.title}>Nu exista asa produse</p>
            ) : (
              <>
                {products?.data.map((product, index) => (
                  <Product
                    key={index}
                    product={product}
                    isAdmin
                    onClickEdit={() => {
                      setProductSelected(product);
                      setIsEditModalOpen(true);
                    }}
                    onClickDiscount={() => {
                      setProductSelected(product);
                      setIsDiscountModalOpen(true);
                    }}
                    onClickDelete={() => handleDelete(product.productId)}
                  />
                ))}
                <div className={cls.paginationWrapper}>
                  <ConfigProvider
                    theme={{
                      token: {
                        colorPrimary: "#cc3292",
                      },
                    }}
                  >
                    <Pagination
                      current={pagination.pageNumber}
                      pageSize={pagination.pageSize}
                      total={products.totalElements}
                      showSizeChanger={false}
                      onChange={(page) => {
                        setPagination({
                          ...pagination,
                          pageNumber: page,
                        });
                      }}
                    />
                  </ConfigProvider>
                </div>
              </>
            )}
          </div>
        </>
      </div>
      {isAddModalOpen ? <AddModalProduct handleClose={handleClose} /> : <></>}
      {isEditModalOpen && productSelected ? (
        <EditProduct
          selectedProduct={productSelected}
          handleClose={() => {
            handleClose();
          }}
        />
      ) : (
        <></>
      )}
      {isDiscountModalOpen && productSelected ? (
        <DiscountModal
          handleClose={handleClose}
          resetData={() => {
            handleFiltersChange(filters);
            setProductSelected(null);
          }}
          selectedProduct={productSelected}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default ManagementProducts;
