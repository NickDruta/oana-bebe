export enum ProductsDataApi {
  GET_PRODUCTS = 'product/getAllProductsPageable',
  GET_NEW_PRODUCTS = 'product/getAllNewProducts',
  GET_DISCOUNT_PRODUCTS = 'product/getAllProductsWithDiscount',
  GET_PRODUCT_DETAILS = 'product/getAllProductDetailsById',
  CREATE_BASIC_INFO_PRODUCT = 'product',
  ADD_IMAGES = 'product/image',
  UPDATE_PRODUCT = 'product/update',
  DELETE_PRODUCT = 'product/deleteById',
  INCREASE_VIEWS = 'product/increaseProductViewsById',
}