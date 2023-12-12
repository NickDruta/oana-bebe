import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  ProductInterface,
  ProductsDataApi,
  ProductsPageable,
} from "entities/ProductsData";
import { PaginationRecord } from "shared/config";

export const productsDataApiSlice = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: `${process.env.REACT_APP_API_URL}` }),
  reducerPath: "productsApi",
  keepUnusedDataFor: 3600,
  endpoints: (builder) => ({
    getProducts: builder.query<ProductsPageable, PaginationRecord>({
      query: (pagination) => ({
        url: ProductsDataApi.GET_PRODUCTS,
        method: "GET",
        params: {
          pageSize: pagination.pageSize,
          pageNumber: pagination.pageNumber,
        },
        refetchOnFocus: true,
        refetchOnReconnect: true,
      }),
    }),
    getNewProducts: builder.query<ProductsPageable, void>({
      query: () => ({
        url: ProductsDataApi.GET_NEW_PRODUCTS,
        method: "GET",
        params: { pageSize: 4, pageNumber: 0 },
        refetchOnFocus: true,
        refetchOnReconnect: true,
      }),
    }),
    getDiscountProducts: builder.query<ProductsPageable, void>({
      query: () => ({
        url: ProductsDataApi.GET_DISCOUNT_PRODUCTS,
        method: "GET",
        params: { pageSize: 4, pageNumber: 0 },
        refetchOnFocus: true,
        refetchOnReconnect: true,
      }),
    }),
    getProductDetails: builder.query<ProductInterface, any>({
      query: (data) => ({
        url: ProductsDataApi.GET_PRODUCT_DETAILS,
        method: "GET",
        refetchOnFocus: true,
        refetchOnReconnect: true,
        params: { productId: data },
      }),
    }),
    getProductsByCategory: builder.mutation<
      ProductsPageable,
      { categoryId: number; pagination: PaginationRecord }
    >({
      query: ({ categoryId, pagination }) => ({
        url: ProductsDataApi.GET_PRODUCTS_BY_CATEGORY,
        method: "GET",
        refetchOnFocus: true,
        refetchOnReconnect: true,
        params: {
          pageSize: pagination.pageSize,
          categoryId: categoryId,
          pageNumber: pagination.pageNumber,
        },
      }),
    }),
    getProductsByFilter: builder.mutation<ProductsPageable, any>({
      query: (data) => ({
        url: ProductsDataApi.GET_PRODUCTS_BY_FILTERS,
        method: "POST",
        refetchOnFocus: true,
        refetchOnReconnect: true,
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    createProduct: builder.mutation<any, any>({
      query: (data) => ({
        url: ProductsDataApi.CREATE_PRODUCT,
        method: "POST",
        refetchOnFocus: true,
        refetchOnReconnect: true,
        body: JSON.stringify(data),
        headers: {
          Authorization: sessionStorage.getItem("admin") || "",
          "Content-Type": "application/json",
        },
      }),
    }),
    updateProduct: builder.mutation<any, any>({
      query: (data) => ({
        url: ProductsDataApi.UPDATE_PRODUCT,
        method: "PUT",
        refetchOnFocus: true,
        refetchOnReconnect: true,
        body: JSON.stringify(data),
        headers: {
          Authorization: sessionStorage.getItem("admin") || "",
          "Content-Type": "application/json",
        },
      }),
    }),
    deleteProduct: builder.mutation<any, any>({
      query: (data) => ({
        url: ProductsDataApi.DELETE_PRODUCT,
        method: "DELETE",
        refetchOnFocus: true,
        refetchOnReconnect: true,
        params: { productId: data },
        headers: {
          Authorization: sessionStorage.getItem("admin") || "",
        },
      }),
    }),
    updateViews: builder.query<any, any>({
      query: (data) => ({
        url: ProductsDataApi.INCREASE_VIEWS,
        method: "GET",
        refetchOnFocus: true,
        refetchOnReconnect: true,
        params: { productId: data },
      }),
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetNewProductsQuery,
  useGetDiscountProductsQuery,
  useGetProductDetailsQuery,
  useGetProductsByCategoryMutation,
  useGetProductsByFilterMutation,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useUpdateViewsQuery,
} = productsDataApiSlice;
