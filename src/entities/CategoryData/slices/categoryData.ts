import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CategoryAndSubcategory, CategoryDataApi } from "entities/CategoryData";
import { translateText } from "shared/lib/translateText/translateText";

export const categoryDataApiSlice = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: `${process.env.REACT_APP_API_URL}` }),
  reducerPath: "categoryApi",
  keepUnusedDataFor: 3600,
  endpoints: (builder) => ({
    getCategories: builder.query<CategoryAndSubcategory[], void>({
      query: () => ({
        url: CategoryDataApi.GET_CATEGORIES,
        method: "GET",
        params: { pageSize: 20 },
        refetchOnFocus: true,
        refetchOnReconnect: true,
        refetchOnMountOrArgChange: true,
        headers: {
          'Accept': '*/*',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive'
        },
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
      transformResponse: (data: {data: any}) => {
        return data.data;
      }
    }),
    createCategory: builder.mutation<void, any>({
      query: ({roText, ruText}) => ({
        url: `${CategoryDataApi.CREATE_CATEGORY}?name=${roText}&ruName=${ruText}`,
        method: "POST",
        refetchOnFocus: true,
        refetchOnReconnect: true,
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
