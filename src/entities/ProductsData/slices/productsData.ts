import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  ProductInterface,
  ProductsDataApi,
  ProductsPageable,
} from "entities/ProductsData";

export const productsDataApiSlice = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: `${process.env.REACT_APP_API_URL}` }),
  reducerPath: "productsApi",
  keepUnusedDataFor: 3600,
  endpoints: (builder) => ({
    getProductsTrigger: builder.mutation<ProductInterface[], any>({
      query: (data) => ({
        url: ProductsDataApi.GET_PRODUCTS,
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
        refetchOnFocus: true,
        refetchOnReconnect: true,
        params: { pageSize: data.pageSize, pageNumber: data.pageNumber },
      }),
      transformResponse: (data: {data: any}) => {
        return data.data;
      }
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
        url: `${ProductsDataApi.GET_PRODUCT_DETAILS}/${data}`,
        method: "GET",
        refetchOnFocus: true,
        refetchOnReconnect: true,
      }),
      transformResponse: (data: {data: any}) => {
        return data.data;
      }
    }),
    createBasicInfoProduct: builder.mutation<any, any>({
      query: (data) => ({
        url: ProductsDataApi.CREATE_BASIC_INFO_PRODUCT,
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    addImages: builder.mutation<any, any>({
      query: ({ bucketName, color, files }) => {
        const formData = new FormData();
        files.forEach((file: any) => formData.append('files', file));
        formData.append('bucketName', bucketName)
        formData.append('color', color)

        const encodedColor = encodeURIComponent(color);
        const url = `${ProductsDataApi.ADD_IMAGES}/${bucketName}/${encodedColor}/`;
        return {
          url,
          method: "POST",
          body: formData,
        };
      },
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
  useGetProductsTriggerMutation,
  useGetNewProductsQuery,
  useGetDiscountProductsQuery,
  useGetProductDetailsQuery,
  useCreateBasicInfoProductMutation,
  useAddImagesMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useUpdateViewsQuery,
} = productsDataApiSlice;
