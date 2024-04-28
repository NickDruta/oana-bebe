import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { CompanyDataApiEnum } from "../types/companyDataApiEnum";

export const companyDataApiSlice = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: `${process.env.REACT_APP_API_URL}` }),
  reducerPath: "companyApi",
  keepUnusedDataFor: 3600,
  tagTypes: ["Company"],
  endpoints: (builder) => ({
    getCompanies: builder.query<any, void>({
      query: () => ({
        url: CompanyDataApiEnum.GET_COMPANIES,
        method: "GET",
      }),
      providesTags: ["Company"],
    }),
    createCompany: builder.mutation<any, any>({
      query: (companyName) => ({
        url: CompanyDataApiEnum.POST_COMPANY,
        method: "POST",
        params: { companyName },
      }),
      invalidatesTags: ["Company"],
    }),
    updateCompany: builder.mutation<any, any>({
      query: (data) => ({
        url: CompanyDataApiEnum.PUT_COMPANY,
        method: "PUT",
        params: {
          companyId: data.companyId,
          companyName: data.companyName,
          newOrder: data.order,
        },
      }),
      invalidatesTags: ["Company"],
    }),
    deleteCompany: builder.mutation<any, any>({
      query: (companyId) => ({
        url: CompanyDataApiEnum.PUT_COMPANY,
        method: "DELETE",
        params: { companyId },
      }),
      invalidatesTags: ["Company"],
    }),
  }),
});

export const {
  useGetCompaniesQuery,
  useCreateCompanyMutation,
  useUpdateCompanyMutation,
  useDeleteCompanyMutation,
} = companyDataApiSlice;
