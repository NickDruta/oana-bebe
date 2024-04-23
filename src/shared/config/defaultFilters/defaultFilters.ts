export interface FiltersState {
  categoryActive: string | null;
  subcategoryActive: string | null;
  categoryId: number | null;
  searchValue: string | null;
  companiesSelected: string[] | null;
  minPrice: string | undefined;
  maxPrice: string | undefined;
}

export const defaultFilters: FiltersState = {
  categoryActive: null,
  subcategoryActive: null,
  categoryId: null,
  searchValue: null,
  companiesSelected: null,
  minPrice: undefined,
  maxPrice: undefined,
};
