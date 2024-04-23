import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import i18n from "i18next";
import { ConfigProvider, Pagination } from "antd";

import { useGetCategoriesQuery } from "entities/CategoryData";
import { useGetProductsQuery } from "entities/ProductsData";
import { Filter } from "entities/Filter";
import { Product } from "entities/Product";
import { StickyInfo } from "entities/StickyInfo";

import { Header } from "features/Header";
import { MobileHeader } from "features/MobileHeader";
import { Footer } from "features/Footer";
import { CategoryView } from "features/CategoryView";

import {
  defaultFilters,
  FiltersState,
  initPaginationData,
} from "shared/config";
import { LoadingSpinner } from "shared/ui";
import { FilterIcon } from "shared/assets";
import { matchCategory, matchSubcategory, removeDiacritics } from "shared/lib";

import cls from "./Products.module.scss";

const Products = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const scrollableContainerRef = useRef<HTMLDivElement>(null);

  /**
   * Pagination state
   */
  const [pagination, setPagination] = useState(initPaginationData);

  /**
   * Query for category
   */
  const { data: categories, isLoading: isCategoryLoading } =
    useGetCategoriesQuery();

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

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

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
   * URL PARAMS SECTION
   * @GET useEffect
   * @UPDATE updateURL
   */

  /**
   * Getting the filters from URL
   */
  useEffect(() => {
    const pathSegments = location.pathname.split("/").filter(Boolean);
    let newFilters = { ...filters };

    if (categories) {
      if (pathSegments[0] === "categorie-produs" && pathSegments.length >= 3) {
        const category = matchCategory(categories, pathSegments[1]);
        const subcategory =
          category && matchSubcategory(category, pathSegments[2]);

        if (category && subcategory) {
          newFilters = {
            ...newFilters,
            categoryActive: category.categoryType,
            subcategoryActive: subcategory.categoryName,
            categoryId: subcategory.categoryId,
          };
        }
      }

      const searchParams = new URLSearchParams(location.search);
      const companiesString = searchParams.get("companiesSelected");

      newFilters.searchValue = searchParams.get("searchValue") || "";
      newFilters.companiesSelected = companiesString
        ? companiesString.split(",")
        : [];
      newFilters.minPrice = searchParams.get("minPrice") || undefined;
      newFilters.maxPrice = searchParams.get("maxPrice") || undefined;

      setFilters(newFilters);
    }
  }, [categories]);

  /**
   * Updating the URL
   */
  const updateURL = useCallback(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      const isSignificantValue =
        value !== "" &&
        value !== null &&
        value !== undefined &&
        !(Array.isArray(value) && value.length === 0);
      const isExcludedKey =
        key === "categoryActive" ||
        key === "subcategoryActive" ||
        key === "categoryId";

      if (isSignificantValue && !isExcludedKey) {
        params.set(
          key,
          Array.isArray(value) ? value.join(",") : value.toString(),
        );
      }
    });
    navigate(`?${params.toString()}`, { replace: true });
  }, [filters]);

  /**
   * Activator for UPDATE
   */
  useEffect(() => {
    if (categories) {
      updateURL();
    }
  }, [filters]);

  /**
   * Smooth Scroll on pagination changing
   */
  useEffect(() => {
    document.getElementById("app-wrapper")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [pagination]);

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
                      subcategoryActive={filters.subcategoryActive ?? ""}
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
                  search={filters.searchValue ?? ""}
                  handleSearch={(value: string) => {
                    handleFiltersChange({ searchValue: value ? value : null });
                  }}
                  companiesSelected={filters.companiesSelected ?? []}
                  handleCompaniesSelected={(companies: string[]) =>
                    handleFiltersChange({
                      companiesSelected: companies.length ? companies : null,
                    })
                  }
                  minPrice={filters.minPrice ?? ""}
                  handleMinPrice={(value: string) =>
                    handleFiltersChange({ minPrice: value ? value : undefined })
                  }
                  maxPrice={filters.maxPrice ?? ""}
                  handleMaxPrice={(value: string) =>
                    handleFiltersChange({ maxPrice: value ? value : undefined })
                  }
                />
              </div>

              <div
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {filters.subcategoryActive &&
                i18n.exists(
                  `content:${filters.subcategoryActive.replaceAll(" ", "_").toUpperCase()}_DESCRIPTION`,
                ) ? (
                  <div style={{ position: "relative", marginBottom: 20 }}>
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

                <div
                  ref={scrollableContainerRef}
                  className={cls.productsDataWrapper}
                >
                  {isProductsLoading || isProductsFetching ? (
                    <LoadingSpinner />
                  ) : !products?.data.length ? (
                    <p className={cls.title}>Nu exista asa produse</p>
                  ) : (
                    <>
                      {products.data.map((product, index) => (
                        <Product key={index} product={product} />
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
