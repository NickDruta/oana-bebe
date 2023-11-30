import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { SliderDataApi } from 'entities/SliderData';

export const sliderDataApiSlice = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: `${process.env.REACT_APP_API_URL}slider/` }),
  reducerPath: 'sliderApi',
  keepUnusedDataFor: 3600,
  endpoints: (builder) => ({
    getSliderData: builder.query<any, void>({
      query: () => ({
        url: SliderDataApi.GET_SLIDER,
        method: 'GET',
        params: { pageSize: 20, pageNumber: 0 },
        refetchOnFocus: true,
        refetchOnReconnect: true,
      }),
    }),
  }),
});

export const { useGetSliderDataQuery } = sliderDataApiSlice;