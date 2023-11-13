import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CategoryAndSubcategory, CategoryDataApi } from "entities/CategoryData";

export const categoryDataApiSlice = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: `${process.env.REACT_APP_API_URL}` }),
  reducerPath: "categoryApi",
  keepUnusedDataFor: 3600,
  tagTypes: ["Category"],
  endpoints: (builder) => ({
    getCategories: builder.query<CategoryAndSubcategory[], void>({
      query: () => ({
        url: CategoryDataApi.GET_CATEGORIES,
        method: "GET",
        params: { pageSize: 20 },
        refetchOnFocus: true,
        refetchOnReconnect: true,
        refetchOnMountOrArgChange: true,
        providesTags: (result: any) =>
          result
            ? [
                ...result.map(({ id }: { id: any }) => ({
                  type: "Category" as const,
                  id,
                })),
                "Category",
              ]
            : ["Category"],
      }),
    }),
    createCategory: builder.mutation<void, string>({
      query: (data) => ({
        url: `${CategoryDataApi.CREATE_CATEGORY}?name=${data}`,
        method: "POST",
        refetchOnFocus: true,
        refetchOnReconnect: true,
        invalidatesTags: ["Category"],
        headers: {
          Authorization: sessionStorage.getItem("admin") || "",
        },
      }),
    }),
    createSubcategory: builder.mutation<void, any>({
      query: (data) => ({
        url: CategoryDataApi.CREATE_SUBCATEGORY,
        method: "POST",
        refetchOnFocus: true,
        refetchOnReconnect: true,
        invalidatesTags: ["Category"],
        body: data,
        headers: {
          Authorization: sessionStorage.getItem("admin") || "",
        },
      }),
    }),
    deleteCategory: builder.mutation<void, number>({
      query: (data) => ({
        url: `${CategoryDataApi.DELETE_CATEGORY}?id=${data}`,
        method: "DELETE",
        refetchOnFocus: true,
        refetchOnReconnect: true,
        invalidatesTags: ["Category"],
        headers: {
          Authorization: sessionStorage.getItem("admin") || "",
        },
      }),
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useCreateSubcategoryMutation,
  useDeleteCategoryMutation,
} = categoryDataApiSlice;
