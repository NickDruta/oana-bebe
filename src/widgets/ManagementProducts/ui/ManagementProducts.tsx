import React, {useEffect, useState, useCallback, useRef} from "react";
import {
  ProductInterface,
} from "entities/ProductsData";
import { Product } from "entities/Product";
import {
  useGetProductsTriggerMutation,
} from "entities/ProductsData";
import { AddModalProduct } from "features/AddModalProduct";
import { DiscountModal } from "features/DiscountModal";
import {companies, initPaginationData} from "shared/config";
import {Button, Input, Select} from "shared/ui";
import { AddIcon } from "shared/assets";
import { ProductLoading } from "entities/ProductLoading";
import cls from "./ManagementProducts.module.scss";

interface FiltersState {
  categoryActive: string;
  subcategoryActive: string;
  categoryId: number | null;
  searchValue: string;
  companiesSelected: string[];
  minPrice: string;
  maxPrice: string;
}

const ManagementProducts = () => {
  const [isVisible, setIsVisible] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastProductElementRef = useCallback((node: HTMLDivElement | null) => {
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setIsVisible(true);
      }
    });
    if (node) observerRef.current.observe(node);
  }, []);

  const [pagination, setPagination] = useState(initPaginationData);
  const [getProductsTrigger] = useGetProductsTriggerMutation();

  const [products, setProducts] = useState<ProductInterface[]>([]);
  const [productLoading, setProductLoading] = useState(true);
  const [productsFinished, setProductsFinished] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [productSelected, setProductSelected] = useState<ProductInterface | null>(null)


  const [filters, setFilters] = useState<FiltersState>({
    categoryActive: '',
    subcategoryActive: '',
    categoryId: null,
    searchValue: '',
    companiesSelected: [],
    minPrice: '',
    maxPrice: ''
  });

  const handleFiltersChange = (newFilters: Partial<FiltersState>) => {
    setFilters(prevFilters => {
      const updatedFilters = { ...prevFilters, ...newFilters };
      setProductLoading(true);
      setProducts([]);
      setPagination(initPaginationData);
      setProductsFinished(false);
      loadNextProducts(updatedFilters, true);
      return updatedFilters;
    });
  };

  const loadNextProducts = useCallback(async (filters: FiltersState, reset: boolean = false) => {
    setProductLoading(true);

    try {
      const response = await getProductsTrigger({
        productName: filters.searchValue || undefined,
        companyName: filters.companiesSelected.length ? filters.companiesSelected : undefined,
        minPrice: filters.minPrice || undefined,
        maxPrice: filters.maxPrice || undefined,
        pageSize: pagination.pageSize,
        pageNumber: reset ? 1 : pagination.pageNumber,
        categoryId: filters.categoryId || undefined,
      }).unwrap();

      if (response && response.length) {
        setProducts(prevProducts => reset ? response : [...prevProducts, ...response]);
        setPagination(prev => ({ ...prev, pageNumber: prev.pageNumber + 1 }));
      } else {
        setProductsFinished(true);
      }
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setProductLoading(false);
    }
  }, [productLoading, productsFinished, filters, pagination.pageSize, pagination.pageNumber, getProductsTrigger]);

  const handleClose = () => {
    isDiscountModalOpen && setIsDiscountModalOpen(false);
    isAddModalOpen && setIsAddModalOpen(false);
    setProductSelected(null);
  }

  useEffect(() => {
    if (isVisible && !productLoading && !productsFinished) {
      loadNextProducts(filters);
      setIsVisible(false);
    }
  }, [isVisible, productLoading, productsFinished]);

  useEffect(() => {
    // if (!sessionStorage.getItem("jwt")) navigate("/management");
    loadNextProducts(filters);
  }, []);

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
            <Select
                options={companies}
                value={filters.companiesSelected?.[0]}
                placeholder={"Companie"}
                handleChange={(value) => handleFiltersChange({...filters, companiesSelected: [value]})}
                optionsClassName={cls.optionsClassName}
            />
            <Input
              className={cls.maxWidth}
              placeholder={"Cauta produs"}
              value={filters.searchValue}
              handleChange={(value) => {
                handleFiltersChange({...filters, searchValue: value})
              }}
            />
            <Button
              type="primary"
              text="Aplica"
              onClick={() => {
                setProductLoading(false);
                setProductsFinished(false);
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
              {products.length || productLoading ? (
                  <>
                    {products.map((product, index) => (
                        <Product
                            key={index}
                            product={product}
                            isAdmin
                            onClickEdit={() => {
                              setProductSelected(product)
                              setIsAddModalOpen(true)
                            }}
                            onClickDiscount={() => {
                              setProductSelected(product)
                              setIsDiscountModalOpen(true)
                            }}
                        />
                    ))}
                    {!productsFinished ? (
                        <div ref={lastProductElementRef}>
                          <ProductLoading/>
                        </div>
                    ) : (
                        <></>
                    )}
                  </>
              ) : (
                  <p className={cls.title}>Nu exista asa produse</p>
              )}
            </div>
          </>
      </div>
      {isAddModalOpen ? (
        <AddModalProduct
          productSelected={productSelected}
          handleClose={handleClose}
        />
      ) : (
        <></>
      )}
      {isDiscountModalOpen && productSelected ? (
        <DiscountModal
          handleClose={handleClose}
          selectedProduct={productSelected}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default ManagementProducts;
