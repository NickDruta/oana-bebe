export interface CategoryAndSubcategory {
    categoryTypeId: number,
    categoryType: string,
    categoryTypeRu: string;
    categorySet: SubCategoryResponse[],
}

export interface SubCategoryResponse {
  categoryId: number,
  categoryName: string,
  categoryNameRu: string,
}