import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { SliderDataApi } from 'entities/SliderData';

export const sliderDataApiSlice = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: `${process.env.REACT_APP_API_URL}slider/` }),
  reducerPath: 'sliderApi',
  keepUnusedDataFor: 3600,
  endpoints: (builder) => ({
    getSliderData: builder.mutation<any, number>({
      query: (pageNumber) => ({
        url: SliderDataApi.GET_SLIDER,
        method: 'GET',
        params: { pageSize: 1, pageNumber: pageNumber },
        refetchOnFocus: true,
        refetchOnReconnect: true,
      }),
    }),
  }),
});

export const { useGetSliderDataMutation } = sliderDataApiSlice;