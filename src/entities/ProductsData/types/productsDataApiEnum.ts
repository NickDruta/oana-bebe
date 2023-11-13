export enum ProductsDataApi {
  GET_PRODUCTS = 'product/getAllProductsPageable',
  GET_NEW_PRODUCTS = 'product/getAllNewProducts',
  GET_DISCOUNT_PRODUCTS = 'product/getAllProductsWithDiscount',
  GET_PRODUCT_DETAILS = 'product/getAllProductDetailsById',
  GET_PRODUCTS_BY_CATEGORY = 'product/getAllProductsPageableByCategoryId',
  GET_PRODUCTS_BY_FILTERS = 'product/getAllProductFilters',
  CREATE_PRODUCT = 'product/add',
  UPDATE_PRODUCT = 'product/update',
  DELETE_PRODUCT = 'product/deleteById',
  INCREASE_VIEWS = 'product/increaseProductViewsById',
}