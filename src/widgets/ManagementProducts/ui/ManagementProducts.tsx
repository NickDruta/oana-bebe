import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  ProductInterface,
  useDeleteProductMutation,
} from "entities/ProductsData";
import { Product } from "entities/Product";
import {
  useGetProductsTriggerMutation,
} from "entities/ProductsData";
import { AddModalProduct } from "features/AddModalProduct";
import { DiscountModal } from "features/DiscountModal";
import {companies, singleSizePaginationData} from "shared/config";
import {Button, LoadingSpinner, Input, Select} from "shared/ui";
import { AddIcon } from "shared/assets";
import { ProductLoading } from "entities/ProductLoading";
import cls from "./ManagementProducts.module.scss";

type Request = "default" | "filter";

const ManagementProducts = () => {
  // const navigate = useNavigate();
  //
  // const [typeOfRequest, setTypeOfReqeust] = useState<Request>("default");
  // const [isVisible, setIsVisible] = useState(false);
  // const [isInit, setIsInit] = useState(true);
  // const ref = useCallback((node: any) => {
  //   const observer = new IntersectionObserver(([entry]) => {
  //     setIsVisible(entry.isIntersecting);
  //   });
  //
  //   if (node) {
  //     observer.observe(node);
  //   }
  // }, []);
  // const [productLoading, setProductLoading] = useState(true);
  // const [productsFinished, setProductsFinished] = useState(false);
  //
  // const [getProductsTrigger] = useGetProductsTriggerMutation();
  //
  // // const [getProductsByFilters] = useGetProductsByFilterMutation();
  // const [pagination, setPagination] = useState(singleSizePaginationData);
  // const [searchValue, setSearchValue] = useState("");
  // const [company, setCompany] = useState("");
  //
  // const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  // const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  // const [products, setProducts] = useState<ProductInterface[]>([]);
  // const [deleteProduct] = useDeleteProductMutation();
  // const [loading, setLoading] = useState(false);
  // const [productSelected, setProductSelected] =
  //   useState<ProductInterface | null>(null);
  //
  // const [discountProduct, setDiscountProduct] =
  //   useState<ProductInterface | null>(null);
  //
  // const handleClose = () => {
  //   isAddModalOpen && setIsAddModalOpen(false);
  //   isDiscountModalOpen && setIsDiscountModalOpen(false);
  //   productSelected && setProductSelected(null);
  // };
  //
  // const handleDelete = (value: number) => {
  //   deleteProduct(value).then(() => window.location.reload());
  // };
  //
  // const handleDiscount = (value: number) => {
  //   setIsDiscountModalOpen(true);
  //
  //   const discountProduct =
  //     products &&
  //     products.find((item: ProductInterface) => item.productId === value);
  //   if (discountProduct) {
  //     setDiscountProduct(discountProduct);
  //   }
  // };
  //
  // const handleEdit = (value: number) => {
  //   const product = products.find((item) => item.productId === value);
  //   if (!product) return;
  //
  //   setProductSelected(product);
  //   setIsAddModalOpen(true);
  // };
  //
  // const changeTypeOfRequest = (typeOfRequest: Request) => {
  //   setTypeOfReqeust(typeOfRequest);
  //   setPagination(singleSizePaginationData);
  //   setProducts([]);
  //   setIsVisible(true);
  //
  //   if (typeOfRequest !== "filter") {
  //     setSearchValue("");
  //   }
  // };
  //
  // const loadNextProducts = async () => {
  //
  //   setProductLoading(true);
  //   const promises = [];
  //   for (let i = pagination.pageNumber; i < pagination.pageNumber + 6; i++) {
  //     if (typeOfRequest === "default") {
  //       promises.push(getProductsTrigger({ ...pagination, pageNumber: i }).unwrap());
  //     }
  //     // } else if (typeOfRequest === "filter") {
  //     //   promises.push(getProductsByFilters({
  //     //     productName: searchValue ? searchValue.trim() : null,
  //     //     companyName: company ? [company] : null,
  //     //     pageSize: pagination.pageSize,
  //     //     pageNumber: i
  //     //   }).unwrap());
  //     // }
  //   }
  //
  //   try {
  //     const results = await Promise.all(promises);
  //     results.forEach(result => {
  //       if (result && result.products) {
  //         setProducts(prevProducts => [...prevProducts, ...result.products]);
  //         if (!result.products.length) {
  //           setProductsFinished(true);
  //         }
  //       }
  //     });
  //   } catch (error) {
  //     console.error("Error loading products:", error);
  //   }
  //
  //   setPagination(prev => ({ ...prev, pageNumber: prev.pageNumber + 6 }));
  //   setIsInit(false);
  //   setProductLoading(false);
  // };
  //
  // useEffect(() => {
  //   if (!sessionStorage.getItem("admin")) navigate("/management");
  // }, []);
  //
  // useEffect(() => {
  //   loadNextProducts();
  // }, []);
  //
  // useEffect(() => {
  //   if (isVisible && !productLoading && !productsFinished && !isInit) {
  //     loadNextProducts();
  //     setIsVisible(false);
  //   }
  // }, [isVisible, productLoading]);
  //
  // return (
  //   <div className={cls.managementProductsWrapper}>
  //     <div className={cls.contentWrapper}>
  //       <div
  //         style={{
  //           display: "flex",
  //           alignItems: "center",
  //           justifyContent: "space-between",
  //         }}
  //       >
  //         <p className={cls.title}>Produse</p>
  //         <div style={{display: "flex", alignItems: "center", gap: "12px"}}>
  //           <Select
  //               options={companies}
  //               value={company}
  //               placeholder={"Companie"}
  //               handleChange={(value) => setCompany(value)}
  //               optionsClassName={cls.optionsClassName}
  //           />
  //           <Input
  //             className={cls.maxWidth}
  //             placeholder={"Cauta produs"}
  //             value={searchValue}
  //             handleChange={(value) => {
  //               setSearchValue(value);
  //             }}
  //           />
  //           <Button
  //             type="primary"
  //             text="Aplica"
  //             onClick={() => {
  //               changeTypeOfRequest("filter");
  //               setProductLoading(false);
  //               setProductsFinished(false);
  //             }}
  //           />
  //         </div>
  //       </div>
  //         <>
  //           <div className={cls.productsWrapper}>
  //             <div
  //               className={cls.createProduct}
  //               onClick={(e) => {
  //                 e.stopPropagation();
  //                 setIsAddModalOpen(true);
  //               }}
  //             >
  //               <AddIcon style={{ width: 36, height: 36, stroke: "#ffbbeb" }} />
  //             </div>
  //             {products &&
  //               products.map((item: ProductInterface, index: number) => (
  //                 <Product
  //                   product={item}
  //                   key={index}
  //                   className={cls.product}
  //                   isAdmin
  //                   onClickDelete={(value) => handleDelete(value)}
  //                   onClickDiscount={(value) => handleDiscount(value)}
  //                   onClickEdit={(value) => handleEdit(value)}
  //                 />
  //               ))}
  //             {!productsFinished ? (
  //               <div ref={ref}>
  //                 <ProductLoading />
  //               </div>
  //             ) : (
  //               <></>
  //             )}
  //           </div>
  //         </>
  //     </div>
  //     {isAddModalOpen ? (
  //       <AddModalProduct
  //         productSelected={productSelected}
  //         handleClose={handleClose}
  //       />
  //     ) : (
  //       <></>
  //     )}
  //     {isDiscountModalOpen && discountProduct ? (
  //       <DiscountModal
  //         handleClose={handleClose}
  //         selectedProduct={discountProduct}
  //       />
  //     ) : (
  //       <></>
  //     )}
  //   </div>
  // );
  return (
      <></>
  )
};

export default ManagementProducts;
