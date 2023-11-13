import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { OrdersDataApi } from "entities/OrdersData";

export const ordersDataApiSlice = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: `${process.env.REACT_APP_API_URL}` }),
  reducerPath: "ordersApi",
  keepUnusedDataFor: 3600,
  tagTypes: ["Orders"],
  endpoints: (builder) => ({
    getOrders: builder.query<any, void>({
      query: () => ({
        url: OrdersDataApi.GET_ORDERS,
        method: "GET",
        params: { pageSize: 20 },
        refetchOnFocus: true,
        refetchOnReconnect: true,
        refetchOnMountOrArgChange: true,
        headers: {
          Authorization: sessionStorage.getItem("admin") || "",
        },
      }),
    }),
    createOrder: builder.mutation<void, any>({
      query: (data) => ({
        url: OrdersDataApi.CREATE_ORDER,
        method: "POST",
        refetchOnFocus: true,
        refetchOnReconnect: true,
        invalidatesTags: ["Orders"],
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    deleteOrder: builder.mutation<void, any>({
      query: (data) => ({
        url: `${OrdersDataApi.DELETE_ORDER}?orderId=${data}`,
        method: "DELETE",
        refetchOnFocus: true,
        refetchOnReconnect: true,
        invalidatesTags: ["Orders"],
        body: data,
        headers: {
          Authorization: sessionStorage.getItem("admin") || "",
        },
      }),
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useCreateOrderMutation,
  useDeleteOrderMutation,
} = ordersDataApiSlice;
