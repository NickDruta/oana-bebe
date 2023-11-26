export interface CategoryAndSubcategory {
    categoryType: {
      categoryTypeId: number,
      categoryTypeName: string,
      categoryTypeNameRu: string;
    },
    subCategoryResponse: SubCategoryResponse[],
}

export interface SubCategoryResponse {
  subCategoryId: number,
  subCategoryName: string,
  subCategoryNameRu: string,
}