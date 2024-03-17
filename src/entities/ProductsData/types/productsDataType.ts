export interface ProductInterface {
  companyName: string;
  createdDate: string;
  description: string;
  descriptionRu: string;
  isDiscount: boolean;
  isNew: boolean;
  price: number;
  productId: number;
  productName: string;
  productNameRu: string;
  specifications: string;
  specificationsRu: string;
  viewsCount: number;
  image: ImageInterface[];
}

export interface CategoryInterface {
  categoryId: number;
  categoryName: string;
  categoryType?: CategoryTypeInterface;
  products?: ProductInterface[];
}

export interface CategoryTypeInterface {
  categoryTypeId: number;
  categoryType: string;
  categorySet: CategoryInterface[];
}

export interface ImageInterface {
  color: string;
  discountPrice: number | null;
  price: number;
  url: string;
}

export interface ProductsPageable {
  products: ProductInterface[];
  totalElements: number;
  totalPages: number;
}

export interface ImageShortInferface {
  image: string[];
  price: string;
  colorName: string;
}
