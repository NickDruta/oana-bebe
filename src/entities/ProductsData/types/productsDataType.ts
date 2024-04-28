export interface ProductInterface {
  productId: number | null;
  productName: string;
  productNameRu: string;
  companyName: string;
  description: string;
  descriptionRu: string;
  isDiscount: boolean;
  isNew: boolean;
  createdDate: string;
  viewsCount: number;
  specifications: string;
  specificationsRu: string;
  bucketName: string;
  category: CategoryInterface;
  image: ImageInterface[];
}

export interface CategoryInterface {
  categoryId: number | null;
  categoryName: string;
  categoryNameRu: string;
  categoryType?: CategoryTypeInterface;
  products?: ProductInterface[];
  order: string;
}

export interface CategoryTypeInterface {
  categoryTypeId: number;
  categoryType: string;
  categoryTypeRu: string;
  order: string;
  categorySet: CategoryInterface[];
}

export interface ImageInterface {
  color: string;
  discountPrice: string | null;
  price: string;
  urls: string[];
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
