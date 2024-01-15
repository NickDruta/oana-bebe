import React, { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useGetCategoriesQuery } from "entities/CategoryData";
import {
  ProductInterface,
  useGetProductsByCategoryMutation,
  useGetProductsByFilterMutation,
  useGetProductsTriggerMutation,
} from "entities/ProductsData";
import { Product } from "entities/Product";
import { StickyInfo } from "entities/StickyInfo";
import { ProductLoading } from "entities/ProductLoading";
import { Header } from "features/Header";
import { MobileHeader } from "features/MobileHeader";
import { Footer } from "features/Footer";
import { CategoryView } from "features/CategoryView";
import { companies, singleSizePaginationData } from "shared/config";
import { Button, Input, LoadingSpinner } from "shared/ui";
import cls from "./Products.module.scss";

type Request = "default" | "filter" | "category";

const Products = () => {
  const { t } = useTranslation();

  const [isVisible, setIsVisible] = useState(false);
  const ref = useCallback((node: any) => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    });

    if (node) {
      observer.observe(node);
    }
  }, []);

  const [pagination, setPagination] = useState(singleSizePaginationData);
  const { data: categories, isLoading: isCategoryLoading } =
    useGetCategoriesQuery();
  const [productLoading, setProductLoading] = useState(true);
  const [productsFinished, setProductsFinished] = useState(false);

  const [typeOfRequest, setTypeOfReqeust] = useState<Request>("default");
  const [getProductsTrigger] = useGetProductsTriggerMutation();
  const [getProductsByCategory] = useGetProductsByCategoryMutation();
  const [getProductsByFilters] = useGetProductsByFilterMutation();

  const [products, setProducts] = useState<ProductInterface[]>([]);

  const [categoryActive, setCategoryActive] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [companiesSelected, setCompaniesSelected] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  /**
   * Handle companies selected
   */
  const handleCompany = (item: string) => {
    if (companiesSelected.includes(item)) {
      setCompaniesSelected([
        ...companiesSelected.filter((company) => company !== item),
      ]);
    } else {
      setCompaniesSelected([...companiesSelected, item]);
    }
  };

  const changeTypeOfRequest = (typeOfRequest: Request) => {
    setTypeOfReqeust(typeOfRequest);
    setPagination(singleSizePaginationData);
    setProducts([]);
    setIsVisible(true);

    if (typeOfRequest !== "category") {
      setCategoryActive("");
      setCategoryId(null);
    }
    if (typeOfRequest !== "filter") {
      setCompaniesSelected([]);
      setSearchValue("");
      setMaxPrice("");
      setMinPrice("");
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
   * Get data with a category applied
   */
  const fetchProductByCategory = async (pageNumber: number) => {
    if (!categoryId) {
      changeTypeOfRequest("default");
    } else {
      setProductLoading(true);
      const paginationReformed = {
        ...pagination,
        pageNumber: pageNumber,
      };
      const response = await getProductsByCategory({
        categoryId,
        pagination: paginationReformed,
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
    }
  };

  /**
   * Get data with some filters applied
   */
  const fetchProductByFilter = async (pageNumber: number) => {
    if (!searchValue && !companiesSelected.length && !minPrice && !maxPrice) {
      if (typeOfRequest === "filter") {
        console.log('!')
        changeTypeOfRequest("default");
      }
    }

    setProductLoading(true);
    const response = await getProductsByFilters({
      productName: searchValue ? searchValue : null,
      companyName: companiesSelected.length ? companiesSelected : null,
      minPrice: minPrice ? minPrice : null,
      maxPrice: maxPrice ? maxPrice : null,
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
      } else {
        await fetchProductByCategory(i);
      }
    }
    setPagination((prevPagination) => ({
      ...prevPagination,
      pageNumber: pagination.pageNumber + 6,
    }));
    setProductLoading(false);
  };

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
    <>
      <StickyInfo />
      <Header />
      <MobileHeader />
      <div className={cls.productsWrapper}>
        {isCategoryLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            <div className={cls.categoriesWrapper}>
              {categories &&
                categories.map((item, index) => (
                  <CategoryView
                    key={index}
                    category={item}
                    isActive={
                      item.categoryType.categoryTypeName === categoryActive
                    }
                    handleCategoryChange={(category, subcategory) => {
                      setCategoryActive(
                        subcategory !== categoryId ? category : ""
                      );
                      setCategoryId(
                        subcategory !== categoryId ? subcategory : null
                      );
                      changeTypeOfRequest("category");
                    }}
                  />
                ))}
            </div>
            <div className={cls.contentWrapper}>
              <div className={cls.filtersWrapper}>
                <p className={cls.title}>{t("content:FILTERS")}</p>
                <Input
                  placeholder={t("content:SEARCH_PRODUCT")}
                  value={searchValue}
                  handleChange={(value) => setSearchValue(value)}
                />
                <div className={cls.companiesWrapper}>
                  {companies.map((item, index) => (
                    <div
                      key={index}
                      className={cls.company}
                      onClick={() => handleCompany(item)}
                    >
                      <input
                        type="checkbox"
                        checked={companiesSelected.includes(item)}
                        readOnly
                      />
                      <p>{item}</p>
                    </div>
                  ))}
                </div>
                <div className={cls.priceInputWrapper}>
                  <p>{t("content:FROM")}</p>
                  <Input
                    placeholder={t("content:PRICE")}
                    value={minPrice}
                    handleChange={(value) => setMinPrice(value)}
                  />
                </div>
                <div className={cls.priceInputWrapper}>
                  <p>{t("content:TO")}</p>
                  <Input
                    placeholder={t("content:PRICE")}
                    value={maxPrice}
                    handleChange={(value) => setMaxPrice(value)}
                  />
                </div>
                <Button
                  type="primary"
                  text={t("content:APPLY")}
                  onClick={() => {
                    setPagination(singleSizePaginationData);
                    changeTypeOfRequest("filter");
                  }}
                />
              </div>
              {products.length || productLoading ? (
                <div className={cls.productsDataWrapper}>
                  {products.map((product, index) => (
                    <Product key={index} product={product} />
                  ))}
                  {!productsFinished ? (
                    <div ref={ref}>
                      <ProductLoading />
                    </div>
                  ) : <></>}
                </div>
              ) : (
                <p className={cls.title}>Nu exista asa produse</p>
              )}
            </div>
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Products;
