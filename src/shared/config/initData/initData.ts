import { PaginationRecord } from "../types/types";
import { ProductInterface } from "../../../entities/ProductsData";

export const initPaginationData: PaginationRecord = {
  pageNumber: 1,
  pageSize: 12,
  totalElements: 0,
  totalPages: 0,
};

export const singleSizePaginationData: PaginationRecord = {
  pageNumber: 1,
  pageSize: 1,
  totalElements: 0,
  totalPages: 0,
};

export const emptyProduct: ProductInterface = {
  productId: null,
  productName: "",
  productNameRu: "",
  companyName: "",
  description: "",
  descriptionRu: "",
  isDiscount: false,
  isNew: false,
  createdDate: "",
  viewsCount: 0,
  specifications: "{}",
  specificationsRu: "{}",
  bucketName: "",
  category: {
    categoryName: "",
    categoryNameRu: "",
    categoryId: null,
  },
  image: [],
};
