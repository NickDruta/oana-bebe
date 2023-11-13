import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useGetCategoriesQuery } from "entities/CategoryData";
import {
  ProductInterface,
  useGetProductsByCategoryMutation,
  useGetProductsByFilterMutation,
  useGetProductsQuery,
} from "entities/ProductsData";
import { Product } from "entities/Product";
import { StickyInfo } from "entities/StickyInfo";
import { Header } from "features/Header";
import { MobileHeader } from "features/MobileHeader";
import { Footer } from "features/Footer";
import { CategoryView } from "features/CategoryView";
import { companies } from "shared/config";
import { Button, Input, LoadingSpinner } from "shared/ui";
import cls from "./Products.module.scss";

const Products = () => {
  const { t } = useTranslation();
  const { data: categories, isLoading } = useGetCategoriesQuery();
  const { data: productsData } = useGetProductsQuery();
  const [getProductsByCategory] = useGetProductsByCategoryMutation();
  const [getProductsByFilters] = useGetProductsByFilterMutation();

  const [products, setProducts] = useState<ProductInterface[]>([]);

  const [categoryActive, setCategoryActive] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [companiesSelected, setCompaniesSelected] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const handleCompany = (item: string) => {
    if (companiesSelected.includes(item)) {
      setCompaniesSelected([
        ...companiesSelected.filter((company) => company !== item),
      ]);
    } else {
      setCompaniesSelected([...companiesSelected, item]);
    }
  };

  const getDataByCategory = async () => {
    if (!categoryId && productsData) {
      setProducts(productsData.products);
    }

    if (!categoryId) return;

    const response = await getProductsByCategory(categoryId);
    if ("data" in response) {
      setProducts(response.data.products);
    } else if ("error" in response) {
      console.error("Error fetching products by category:", response.error);
    }
  };

  const getDataByFilters = async () => {
    if (!searchValue && !companiesSelected.length && !minPrice && !maxPrice)
      return;

    const response = await getProductsByFilters({
      productName: searchValue ? searchValue : null,
      companyName: companiesSelected.length ? companiesSelected : null,
      minPrice: minPrice ? minPrice : null,
      maxPrice: maxPrice ? maxPrice : null,
      pageSize: 20,
    });
    if ("data" in response) {
      setProducts(response.data.products);
      setCategoryId(null);
      setCategoryActive("");
    } else if ("error" in response) {
      console.error("Error fetching products by category:", response.error);
    }
  };

  useEffect(() => {
    productsData && setProducts(productsData.products);
  }, [productsData]);

  useEffect(() => {
    getDataByCategory();
  }, [categoryId]);

  return (
    <>
      <StickyInfo />
      <Header />
      <MobileHeader />
      <div className={cls.productsWrapper}>
        {isLoading ? (
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
                    }}
                  />
                ))}
            </div>
            <div className={cls.contentWrapper}>
              <div className={cls.filtersWrapper}>
                <p className={cls.title}>{t('content:FILTERS')}</p>
                <Input
                  placeholder={t('content:SEARCH_PRODUCT')}
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
                  <p>{t('content:FROM')}</p>
                  <Input
                    placeholder={t('content:PRICE')}
                    value={minPrice}
                    handleChange={(value) => setMinPrice(value)}
                  />
                </div>
                <div className={cls.priceInputWrapper}>
                  <p>{t('content:TO')}</p>
                  <Input
                    placeholder={t('content:PRICE')}
                    value={maxPrice}
                    handleChange={(value) => setMaxPrice(value)}
                  />
                </div>
                <Button
                  type="primary"
                  text={t('content:APPLY')}
                  onClick={() => getDataByFilters()}
                />
              </div>
              <div className={cls.productsDataWrapper}>
                {products.length ? (
                  products.map((product, index) => (
                    <Product key={index} product={product} />
                  ))
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
