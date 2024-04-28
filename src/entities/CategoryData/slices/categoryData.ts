import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CategoryAndSubcategory, CategoryDataApi } from "entities/CategoryData";
import { translateText } from "shared/lib/translateText/translateText";

export const categoryDataApiSlice = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: `${process.env.REACT_APP_API_URL}` }),
  reducerPath: "categoryApi",
  tagTypes: ["Category"],
  keepUnusedDataFor: 3600,
  endpoints: (builder) => ({
    getCategories: builder.query<CategoryAndSubcategory[], void>({
      query: () => ({
        url: CategoryDataApi.GET_CATEGORIES,
        method: "GET",
        params: { pageSize: 20 },
        headers: {
          Accept: "*/*",
          "Accept-Encoding": "gzip, deflate, br",
          Connection: "keep-alive",
        },
      }),
      providesTags: ["Category"],
      transformResponse: (data: { data: any }) => {
        return data.data;
      },
    }),
    createCategory: builder.mutation<void, any>({
      query: (data) => ({
        url: CategoryDataApi.CREATE_CATEGORY,
        method: "POST",
        body: data,
        headers: {
          Authorization: sessionStorage.getItem("admin") || "",
        },
      }),
      invalidatesTags: ["Category"],
    }),
    updateCategory: builder.mutation<void, any>({
      query: (data) => ({
        url: CategoryDataApi.UPDATE_CATEGORY,
        method: "PUT",
        body: data,
        headers: {
          Authorization: sessionStorage.getItem("admin") || "",
        },
      }),
      invalidatesTags: ["Category"],
    }),
    deleteCategory: builder.mutation<void, number>({
      query: (categoryId) => ({
        url: CategoryDataApi.DELETE_CATEGORY,
        method: "DELETE",
        headers: {
          Authorization: sessionStorage.getItem("admin") || "",
        },
        params: { categoryId },
      }),
      invalidatesTags: ["Category"],
    }),

    createSubcategory: builder.mutation<void, any>({
      query: (data) => ({
        url: CategoryDataApi.CREATE_SUBCATEGORY,
        method: "POST",
        body: data,
        headers: {
          Authorization: sessionStorage.getItem("admin") || "",
        },
      }),
      invalidatesTags: ["Category"],
    }),
    updateSubcategory: builder.mutation<void, any>({
      query: (data) => ({
        url: CategoryDataApi.UPDATE_SUBCATEGORY,
        method: "PUT",
        body: data,
        headers: {
          Authorization: sessionStorage.getItem("admin") || "",
        },
      }),
      invalidatesTags: ["Category"],
    }),
    deleteSubcategory: builder.mutation<void, any>({
      query: (data) => ({
        url: CategoryDataApi.DELETE_SUBCATEGORY,
        method: "DELETE",
        params: {
          subcategoryId: data.subcategoryId,
          categoryTypeId: data.categoryTypeId,
        },
        headers: {
          Authorization: sessionStorage.getItem("admin") || "",
        },
      }),
      invalidatesTags: ["Category"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useCreateSubcategoryMutation,
  useUpdateSubcategoryMutation,
  useDeleteSubcategoryMutation,
} = categoryDataApiSlice;
