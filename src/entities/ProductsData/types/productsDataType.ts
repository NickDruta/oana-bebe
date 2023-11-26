export interface ProductInterface {
  productId: number;
  productName: string;
  productNameRu: string;
  companyName: string;
  price: number;
  description: string;
  descriptionRu: string;
  isDiscount: boolean;
  discountPrice: number;
  isNew: boolean;
  createdDate: Date;
  viewsCount: number;
  category: CategoryInterface;
  imageShortDetails? : {
    imageDate: string;
    imageDiscountPrice: string;
    price: string;
  };
  haveDiscount?: boolean;
  images: ImageInterface[];
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
  imageId: number;
  colorName: string;
  image: string;
  price: string;
  discount: string | null;
}

export interface ProductsPageable {
  products: ProductInterface[];
  totalElements: number;
  totalPages: number;
}