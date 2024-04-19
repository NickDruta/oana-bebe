import React, { useEffect, useState, useCallback, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import i18n from "i18next";

import { useGetCategoriesQuery } from "entities/CategoryData";
import {
  ProductInterface,
  useGetProductsTriggerMutation,
} from "entities/ProductsData";
import { Filter } from "entities/Filter";
import { Product } from "entities/Product";
import { StickyInfo } from "entities/StickyInfo";
import { ProductLoading } from "entities/ProductLoading";

import { Header } from "features/Header";
import { MobileHeader } from "features/MobileHeader";
import { Footer } from "features/Footer";
import { CategoryView } from "features/CategoryView";

import { initPaginationData } from "shared/config";
import { LoadingSpinner } from "shared/ui";
import { useDeviceType } from "shared/hooks";
import { FilterIcon } from "shared/assets";
import { removeDiacritics } from "shared/lib";

import cls from "./Products.module.scss";

interface FiltersState {
  categoryActive: string;
  subcategoryActive: string;
  categoryId: number | null;
  searchValue: string;
  companiesSelected: string[];
  minPrice: string;
  maxPrice: string;
}

const Products = () => {
  const { t } = useTranslation();
  const isMobile = useDeviceType();
  const location = useLocation();
  const navigate = useNavigate();

  const [isVisible, setIsVisible] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastProductElementRef = useCallback((node: HTMLDivElement | null) => {
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setIsVisible(true);
      }
    });
    if (node) observerRef.current.observe(node);
  }, []);

  const [pagination, setPagination] = useState(initPaginationData);
  const { data: categories, isLoading: isCategoryLoading } =
    useGetCategoriesQuery();
  const [getProductsTrigger] = useGetProductsTriggerMutation();

  const [isInit, setIsInit] = useState(true);
  const [products, setProducts] = useState<ProductInterface[]>([]);
  const [productLoading, setProductLoading] = useState(true);
  const [productsFinished, setProductsFinished] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const [filters, setFilters] = useState<FiltersState>({
    categoryActive: "",
    subcategoryActive: "",
    categoryId: null,
    searchValue: "",
    companiesSelected: [],
    minPrice: "",
    maxPrice: "",
  });

  const handleFiltersChange = (newFilters: Partial<FiltersState>) => {
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters, ...newFilters };
      setProductLoading(true);
      setProducts([]);
      setPagination(initPaginationData);
      setProductsFinished(false);
      loadNextProducts(updatedFilters, true);
      return updatedFilters;
    });
  };

  const loadNextProducts = useCallback(
    async (filters: FiltersState, reset: boolean = false) => {
      setProductLoading(true);

      try {
        const response = await getProductsTrigger({
          productName: filters.searchValue || undefined,
          companyName: filters.companiesSelected.length
            ? filters.companiesSelected
            : undefined,
          minPrice: filters.minPrice || undefined,
          maxPrice: filters.maxPrice || undefined,
          pageSize: pagination.pageSize,
          pageNumber: reset ? 1 : pagination.pageNumber,
          categoryId: filters.categoryId || undefined,
        }).unwrap();

        if (response && response.length && !isInit) {
          setProducts((prevProducts) =>
            reset ? response : [...prevProducts, ...response],
          );
          setPagination((prev) => ({
            ...prev,
            pageNumber: prev.pageNumber + 1,
          }));
        } else if (!isInit) {
          setProductsFinished(true);
        } else {
          setIsInit(false);
        }
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setProductLoading(false);
      }
    },
    [
      productLoading,
      productsFinished,
      filters,
      pagination.pageSize,
      pagination.pageNumber,
      getProductsTrigger,
    ],
  );

  /**
   * Updating filters on URL change
   */
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const pathSegments = location.pathname.split("/").filter(Boolean);
    let categoryActive = "";
    let subcategoryActive = "";
    let categoryId = null;

    if (pathSegments[0] === "categorie-produs" && pathSegments.length >= 3) {
      const [, categoryPath, subcategoryPath] = pathSegments;
      const decodedCategoryPath = decodeURIComponent(categoryPath);
      const decodedSubcategoryPath = decodeURIComponent(subcategoryPath);

      const category =
        categories &&
        categories.find(
          (cat) =>
            removeDiacritics(cat.categoryType).toLowerCase() ===
            decodedCategoryPath.replace(/—/g, " "),
        );
      if (category) {
        categoryActive = category.categoryType;

        const subcategory = category.categorySet.find(
          (sub) =>
            removeDiacritics(sub.categoryName).toLowerCase() ===
            decodedSubcategoryPath.replace(/—/g, " "),
        );
        if (subcategory) {
          subcategoryActive = subcategory.categoryName;
          categoryId = subcategory.categoryId;
        }
      }
    }

    const getQueryParamArray = (param: string): string[] => {
      const value = queryParams.get(param);
      return value ? value.split(",") : [];
    };

    const initialFilters: Partial<FiltersState> = {
      categoryActive,
      subcategoryActive,
      categoryId,
      searchValue: queryParams.get("search") || "",
      companiesSelected: getQueryParamArray("companies"),
      minPrice: queryParams.get("minPrice") || "",
      maxPrice: queryParams.get("maxPrice") || "",
    };

    if (!window.location.pathname.includes("produse")) {
      handleFiltersChange(initialFilters);
    }
  }, [categories]);

  /**
   * Changing the style on opening the filter
   */
  const handleFilterClick = () => {
    setIsFilterOpen(!isFilterOpen);
    if (isFilterOpen) {
      const filterBox = document.getElementById("filter");
      filterBox!.style.display = "block";
    } else {
      const filterBox = document.getElementById("filter");
      filterBox!.style.display = "none";
    }
  };

  /**
   * Handling expansion of filters on mobile
   */
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  /**
   * Loading products
   */
  useEffect(() => {
    if (isVisible && !productLoading && !productsFinished && !isInit) {
      loadNextProducts(filters);
      setIsVisible(false);
    }
  }, [isVisible, productLoading, productsFinished, isInit]);

  /**
   * Loading products on init
   */
  useEffect(() => {
    if (window.location.pathname.includes("produse")) {
      loadNextProducts(filters);
    }
  }, []);

  /**
   * Filters handling in URL
   */
  useEffect(() => {
    const params = new URLSearchParams();

    if (filters.searchValue) params.set("search", filters.searchValue);
    if (filters.minPrice) params.set("minPrice", filters.minPrice);
    if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
    if (filters.companiesSelected.length > 0)
      params.set("companies", filters.companiesSelected.join(","));

    // Push new search params to the history stack
    navigate({ search: params.toString() }, { replace: true });
  }, [filters, navigate]);

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
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div className={cls.categoriesWrapper}>
                {categories &&
                  categories.map((item, index) => (
                    <CategoryView
                      key={index}
                      category={item}
                      isActive={item.categoryType === filters.categoryActive}
                      subcategoryActive={filters.subcategoryActive}
                      handleCategoryChange={(
                        category,
                        subcategory,
                        subCategoryId,
                      ) => {
                        handleFiltersChange({
                          categoryActive: category,
                          subcategoryActive: subcategory,
                          categoryId: subCategoryId,
                        });
                        navigate(
                          `/categorie-produs/${removeDiacritics(category.toLowerCase().replaceAll(" ", "—"))}/${removeDiacritics(subcategory.toLowerCase().replaceAll(" ", "—"))}`,
                        );
                      }}
                    />
                  ))}
              </div>
              <div className={cls.filterIconBox}>
                <FilterIcon
                  className={cls.filterIcon}
                  onClick={() => handleFilterClick()}
                />
              </div>
            </div>
            {filters.categoryId ? (
              <span>
                Produse &rarr; {filters.categoryActive} &rarr;{" "}
                {filters.subcategoryActive}
              </span>
            ) : (
              <></>
            )}
            <div className={cls.contentWrapper}>
              <div className={cls.filterBox} id="filter">
                <Filter
                  search={filters.searchValue}
                  handleSearch={(value: string) =>
                    handleFiltersChange({ searchValue: value })
                  }
                  companiesSelected={filters.companiesSelected}
                  handleCompaniesSelected={(companies: string[]) =>
                    handleFiltersChange({ companiesSelected: companies })
                  }
                  minPrice={filters.minPrice}
                  handleMinPrice={(value: string) =>
                    handleFiltersChange({ minPrice: value })
                  }
                  maxPrice={filters.maxPrice}
                  handleMaxPrice={(value: string) =>
                    handleFiltersChange({ maxPrice: value })
                  }
                />
              </div>

              <div style={{ width: "100%" }}>
                {filters.subcategoryActive &&
                i18n.exists(
                  `content:${filters.subcategoryActive.replaceAll(" ", "_").toUpperCase()}_DESCRIPTION`,
                ) ? (
                  <div style={{ position: "relative" }}>
                    <div
                      className={clsx(
                        cls.infoWrapper,
                        isExpanded && cls.isExpanded,
                      )}
                      dangerouslySetInnerHTML={{
                        __html: `${t(
                          `content:${filters.subcategoryActive.replaceAll(" ", "_").toUpperCase()}_DESCRIPTION`,
                        )}`,
                      }}
                    />
                    <button onClick={toggleExpanded} className={cls.infoButton}>
                      {isExpanded ? "Vezi mai puțin" : "Vezi mai mult"}
                    </button>
                  </div>
                ) : (
                  <></>
                )}
                {products.length || productLoading ? (
                  <div className={cls.productsDataWrapper}>
                    {products.map((product, index) => (
                      <Product key={index} product={product} />
                    ))}
                    {!productsFinished ? (
                      <div
                        ref={lastProductElementRef}
                        style={
                          isMobile
                            ? {
                                display: "flex",
                                justifyContent: "space-between",
                                width: "100%",
                                padding: "0 5px",
                              }
                            : {}
                        }
                      >
                        <ProductLoading />
                        {isMobile && <ProductLoading />}
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                ) : (
                  <p className={cls.title}>Nu exista asa produse</p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Products;
