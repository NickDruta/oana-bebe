import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  ProductInterface,
  ProductsDataApi,
  ProductsPageable,
} from "entities/ProductsData";
import {
  BaseQueryMeta,
  BaseQueryResult,
} from "@reduxjs/toolkit/dist/query/baseQueryTypes";

export const productsDataApiSlice = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}`,
    prepareHeaders: (headers) => {
      headers.set("Cache-Control", "no-store");
      return headers;
    },
  }),
  reducerPath: "productsApi",
  keepUnusedDataFor: 3600,

  endpoints: (builder) => ({
    getProducts: builder.query<
      { data: ProductInterface[]; totalElements: number },
      any
    >({
      query: (data) => ({
        url: ProductsDataApi.GET_PRODUCTS,
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
        params: { pageSize: data.pageSize, pageNumber: data.pageNumber },
        keepUnusedDataFor: 0,
        refetchOnMountOrArgChange: true,
      }),
    }),
    getProductDetails: builder.query<ProductInterface, any>({
      query: (data) => ({
        url: `${ProductsDataApi.GET_PRODUCT_DETAILS}/${data}`,
        method: "GET",
        refetchOnFocus: true,
        refetchOnReconnect: true,
      }),
      transformResponse: (data: { data: any }) => {
        return data.data;
      },
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
        files.forEach((file: any) => formData.append("images", file));
        formData.append("bucketName", bucketName);
        formData.append("color", color);

        const encodedColor = encodeURIComponent(color);
        const url = `${ProductsDataApi.ADD_IMAGES}/${bucketName}/${encodedColor}/`;
        return {
          url,
          method: "POST",
          body: formData,
        };
      },
    }),
    updateProductPrices: builder.mutation<any, any>({
      query: (data) => ({
        url: `${ProductsDataApi.UPDATE_PRODUCT_PRICES}/${data.productId}/price`,
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    updateBasicInfo: builder.mutation<any, any>({
      query: (data) => ({
        url: `${ProductsDataApi.UPDATE_BASIC_INFO}/${data.productId}`,
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    deleteProduct: builder.mutation<any, any>({
      query: (data) => ({
        url: `${ProductsDataApi.DELETE_PRODUCT}/${data}`,
        method: "DELETE",
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
  useGetProductDetailsQuery,
  useCreateBasicInfoProductMutation,
  useAddImagesMutation,
  useUpdateProductPricesMutation,
  useUpdateBasicInfoMutation,
  useDeleteProductMutation,
  useUpdateViewsQuery,
} = productsDataApiSlice;
