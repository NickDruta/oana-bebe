import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { SliderDataApi } from "entities/SliderData";

export const sliderDataApiSlice = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: `${process.env.REACT_APP_API_URL}` }),
  reducerPath: "sliderApi",
  tagTypes: ["Slider"],
  keepUnusedDataFor: 3600,
  endpoints: (builder) => ({
    getSliderData: builder.query<any, void>({
      query: () => ({
        url: SliderDataApi.GET_SLIDER,
        method: "GET",
      }),
      providesTags: ["Slider"],
    }),
    createSlider: builder.mutation<any, any>({
      query: (data) => ({
        url: SliderDataApi.CREATE_SLIDER,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Slider"],
    }),
    updateSlider: builder.mutation<any, any>({
      query: (data) => ({
        url: SliderDataApi.UPDATE_SLIDER,
        method: "PUT",
        params: { ...data },
      }),
      invalidatesTags: ["Slider"],
    }),
    deleteSlider: builder.mutation<any, any>({
      query: (data) => ({
        url: SliderDataApi.DELETE_SLIDER,
        method: "DELETE",
        params: { ...data },
      }),
      invalidatesTags: ["Slider"],
    }),
  }),
});

export const {
  useGetSliderDataQuery,
  useCreateSliderMutation,
  useUpdateSliderMutation,
  useDeleteSliderMutation,
} = sliderDataApiSlice;
