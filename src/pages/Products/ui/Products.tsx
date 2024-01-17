import React, {useEffect, useState, useCallback} from "react";
import {useTranslation} from "react-i18next";
import {useLocation} from "react-router-dom";
import {useGetCategoriesQuery} from "entities/CategoryData";
import {
    ProductInterface,
    useGetProductsByCategoryMutation,
    useGetProductsByFilterMutation,
    useGetProductsTriggerMutation,
} from "entities/ProductsData";
import {Product} from "entities/Product";
import {StickyInfo} from "entities/StickyInfo";
import {ProductLoading} from "entities/ProductLoading";
import {Header} from "features/Header";
import {MobileHeader} from "features/MobileHeader";
import {Footer} from "features/Footer";
import {CategoryView} from "features/CategoryView";
import {singleSizePaginationData} from "shared/config";
import {LoadingSpinner} from "shared/ui";
import cls from "./Products.module.scss";
import {useDeviceType} from "shared/hooks";
import {Filter} from "entities/Filter";
import { FilterIcon } from "shared/assets";
import filter from "../../../entities/Filter/ui/Filter";

type Request = "default" | "filter" | "category";

const Products = () => {
    const isMobile = useDeviceType();
    const {t} = useTranslation();
    const location = useLocation();

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
    const {data: categories, isLoading: isCategoryLoading} =
        useGetCategoriesQuery();
    const [productLoading, setProductLoading] = useState(true);
    const [productsFinished, setProductsFinished] = useState(false);
    const [isInit, setIsInit] = useState(true);

    const [typeOfRequest, setTypeOfReqeust] = useState<Request>("default");
    const [getProductsTrigger] = useGetProductsTriggerMutation();
    const [getProductsByCategory] = useGetProductsByCategoryMutation();
    const [getProductsByFilters] = useGetProductsByFilterMutation();

    const [products, setProducts] = useState<ProductInterface[]>([]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

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
            if (!products.filter((item) => item.productId === response.data.products[0].productId).length) {
                //console.log(products.filter((item) => item.productId === response.data.products[0].productId).length)
                setProducts((prevProducts) => [
                    ...prevProducts,
                    ...response.data.products,
                ]);
            }
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
        isInit && setIsInit(false);
        setProductLoading(false);
    };

    useEffect(() => {
        if (
            location.search &&
            location.search.split("?")[1] &&
            location.search.split("?")[1].split("=")[0] === "companies"
        ) {
            setCompaniesSelected([location.search.split("?")[1].split("=")[1]]);
            setProductLoading(false);
            changeTypeOfRequest("filter");
        } else {
            loadNextProducts();
        }
    }, []);

    useEffect(() => {
        if (isVisible && !productLoading && !productsFinished && !isInit) {
            loadNextProducts();
            setIsVisible(false);
        }
    }, [isVisible, productLoading]);

    return (
        <>
            <StickyInfo/>
            <Header/>
            <MobileHeader/>
            <div className={cls.productsWrapper}>
                {isCategoryLoading ? (
                    <LoadingSpinner/>
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
                            {isMobile && <FilterIcon onClick={() => setIsFilterOpen(!isFilterOpen)} style={{width: 35, height: 35}}/>}
                        </div>
                        <div className={cls.contentWrapper}>
                            {((isFilterOpen && isMobile) || !isMobile) && (
                                <Filter search={searchValue} handleSearch={(value) => setSearchValue(value)}
                                        companiesSelected={companiesSelected} handleCompaniesSelected={handleCompany}
                                        minPrice={minPrice} handleMinPrice={(value) => setMinPrice((value))}
                                        maxPrice={maxPrice} handleMaxPrice={(value) => setMaxPrice(value)}
                                        handleApply={() => {
                                            setPagination(singleSizePaginationData);
                                            changeTypeOfRequest("filter");
                                        }}/>
                            )}
                            {products.length || productLoading ? (
                                <div className={cls.productsDataWrapper}>
                                    {products.map((product, index) => (
                                        <Product key={index} product={product}/>
                                    ))}
                                    {!productsFinished ? (
                                        <div ref={ref} style={isMobile ? {
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            width: '100%',
                                            padding: '0 5px'
                                        } : {}}>
                                            <ProductLoading/>
                                            {isMobile && <ProductLoading/>}
                                        </div>
                                    ) : (
                                        <></>
                                    )}
                                </div>
                            ) : (
                                <p className={cls.title}>Nu exista asa produse</p>
                            )}
                        </div>
                    </>
                )}
            </div>
            <Footer/>
        </>
    );
};

export default Products;
