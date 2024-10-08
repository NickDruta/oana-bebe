import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { categoryDataApiSlice } from "entities/CategoryData";
import { ordersDataApiSlice } from "entities/OrdersData";
import { productsDataApiSlice } from "entities/ProductsData";
import { sliderDataApiSlice } from "entities/SliderData";
import { companyDataApiSlice } from "../../../../entities/CompaniesData";

const rootReducer = combineReducers({
  [sliderDataApiSlice.reducerPath]: sliderDataApiSlice.reducer,
  [categoryDataApiSlice.reducerPath]: categoryDataApiSlice.reducer,
  [productsDataApiSlice.reducerPath]: productsDataApiSlice.reducer,
  [ordersDataApiSlice.reducerPath]: ordersDataApiSlice.reducer,
  [companyDataApiSlice.reducerPath]: companyDataApiSlice.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      sliderDataApiSlice.middleware,
      categoryDataApiSlice.middleware,
      productsDataApiSlice.middleware,
      ordersDataApiSlice.middleware,
      companyDataApiSlice.middleware,
    ]),
});

export type RootSchema = ReturnType<typeof rootReducer>;
