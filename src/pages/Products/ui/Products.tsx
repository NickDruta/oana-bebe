import React, {useEffect, useState, useCallback} from "react";
import {useGetCategoriesQuery} from "entities/CategoryData";
import {
    ProductInterface,
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
import {useNavigate} from "react-router-dom";

const Products = () => {
    const isMobile = useDeviceType();
    const queryParameters = new URLSearchParams(window.location.search);
    const navigate = useNavigate()

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

    const [getProductsTrigger] = useGetProductsTriggerMutation();

    const [products, setProducts] = useState<ProductInterface[]>([]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const [categoryActive, setCategoryActive] = useState("");
    const [subcategoryActive, setSubcategoryActive] = useState("");

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

    const loadNextProducts = async () => {
        setProductLoading(true);
        const promises = [];
        for (let i = pagination.pageNumber; i < pagination.pageNumber + 6; i++) {
                promises.push(getProductsTrigger({
                    productName: searchValue ? searchValue : null,
                    companyName: companiesSelected.length ? companiesSelected : null,
                    minPrice: minPrice ? minPrice : null,
                    maxPrice: maxPrice ? maxPrice : null,
                    pageSize: pagination.pageSize,
                    categoryId: categoryId,
                    pageNumber: i
                }).unwrap());
        }

        try {
            const results = await Promise.all(promises);
            console.log(results)
            results.forEach(result => {
                if (result && result[0]) {
                    setProducts(prevProducts => [...prevProducts, result[0]]);
                } else {
                    setProductsFinished(true)
                }
            });
        } catch (error) {
            console.error("Error loading products:", error);
        }

        setPagination(prev => ({ ...prev, pageNumber: prev.pageNumber + 6 }));
        setIsInit(false);
        setProductLoading(false);
    };

    const handleApply = () => {
        const queryParams = [];

        if (companiesSelected.length) {
            queryParams.push(`pwb-brand=${companiesSelected.join(',')}`);
        }

        if (searchValue) {
            queryParams.push(`search=${encodeURIComponent(searchValue)}`);
        }

        const searchString = queryParams.join('&');

        navigate({
            search: searchString ? `?${searchString}` : ''
        });
        navigate(0);
    }

    function removeDiacritics(str: string) {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[îâă]/g, 'a').replace(/[șş]/g, 's').replace(/[țţ]/g, 't');
    }

    useEffect(() => {
        if (
            queryParameters.get("companies")
            || queryParameters.get("search")
            || queryParameters.get("minPrice")
            || queryParameters.get("maxPrice")
            || window.location.pathname.includes('categorie-produs')
        ) {
            const includesCategory = window.location.pathname.includes('categorie-produs')
            const companies: any = queryParameters.get("companies") ? queryParameters.get("companies")?.split(',').flat() : [];
            const search: any = queryParameters.get("search") ? queryParameters.get("search") : '';
            const minPrice: any = queryParameters.get("minPrice") ? queryParameters.get("minPrice") : '';
            const maxPrice: any = queryParameters.get("maxPrice") ? queryParameters.get("maxPrice") : '';

            if (includesCategory) {
                const pathname = window.location.pathname.replace("/categorie-produs/", '');
                const category = removeDiacritics(pathname.split('/')[0].replaceAll('-', ' '));
                const capitalizedCategory = category.charAt(0).toUpperCase() + category.slice(1);

                const subcategory = pathname.split('/')[1].includes('grupa')
                    ? removeDiacritics(pathname.split('/')[1].replace('-', ' '))
                    : removeDiacritics(pathname.split('/')[1].replaceAll('-', ' '));
                const capitalizedSubcategory = subcategory.charAt(0).toUpperCase() + subcategory.slice(1);

                const foundedCategory = categories?.find((item) => removeDiacritics(item.categoryType) === capitalizedCategory);
                const foundedSubcategory = foundedCategory && foundedCategory.categorySet.find((item) => removeDiacritics(item.categoryName) === capitalizedSubcategory);

                setCategoryActive(foundedCategory ? foundedCategory.categoryType : '')
                setCategoryId(foundedSubcategory ? foundedSubcategory.categoryId : null);
            }


            setCompaniesSelected(companies);
            setSearchValue(search);
            setMinPrice(minPrice);
            setMaxPrice(maxPrice);

            loadNextProducts()
            setIsInit(false);
        } else if (categories) {
            loadNextProducts();
        }
    }, [categories]);
    console.log(products);

    useEffect(() => {
        if (categories && categoryId) {
            const matchingCategory = categories?.find((categoryItem) =>
                categoryItem.categorySet.some(
                    (subcategory) =>
                        subcategory.categoryId === Number(categoryId)
                )
            );
            const matchingSubCategory = matchingCategory?.categorySet.find(
                (subcategory) =>
                    subcategory.categoryId === Number(categoryId)
            );

            matchingCategory && setCategoryActive(matchingCategory.categoryType)
            matchingSubCategory && setSubcategoryActive(matchingSubCategory.categoryName)
        }
    }, [categories, categoryActive]);

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
                                            item.categoryType === categoryActive
                                        }
                                        subcategoryActive={subcategoryActive}
                                        handleCategoryChange={(category, subcategory) => {
                                            navigate(`/categorie-produs/${removeDiacritics(category.toLowerCase().replaceAll(' ', '-'))}/${removeDiacritics(subcategory.toLowerCase().replaceAll(' ', '-'))}`);
                                            window.location.reload();
                                        }}
                                    />
                                ))}
                            {isMobile && <FilterIcon onClick={() => setIsFilterOpen(!isFilterOpen)} style={{width: 35, height: 35}}/>}
                        </div>
                        {categoryId ? <span>Produse &rarr; {categoryActive} &rarr; {subcategoryActive}</span> : <></>}
                        <div className={cls.contentWrapper}>
                            {((isFilterOpen && isMobile) || !isMobile) && (
                                <Filter search={searchValue} handleSearch={(value) => setSearchValue(value)}
                                        companiesSelected={companiesSelected} handleCompaniesSelected={handleCompany}
                                        minPrice={minPrice} handleMinPrice={(value) => setMinPrice((value))}
                                        maxPrice={maxPrice} handleMaxPrice={(value) => setMaxPrice(value)}
                                        handleApply={handleApply}/>
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
