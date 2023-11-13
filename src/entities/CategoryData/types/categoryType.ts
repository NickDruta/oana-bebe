export interface CategoryAndSubcategory {
    categoryType: {
      categoryTypeId: number,
      categoryTypeName: string,
    },
    subCategoryResponse: SubCategoryResponse[],
}

export interface SubCategoryResponse {
  subCategoryId: number,
  subCategoryName: string,
}