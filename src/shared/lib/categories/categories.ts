import { CategoryAndSubcategory } from "entities/CategoryData";
import { normalizeText } from "shared/lib";

export const matchCategory = (
  categories: CategoryAndSubcategory[],
  urlSegment: string,
) => {
  const normalizedSegment = normalizeText(urlSegment);
  return categories.find(
    (cat) => normalizeText(cat.categoryType) === normalizedSegment,
  );
};

export const matchSubcategory = (
  category: CategoryAndSubcategory,
  subcategorySegment: string,
) => {
  const normalizedSegment = normalizeText(subcategorySegment);
  return category?.categorySet.find(
    (sub) => normalizeText(sub.categoryName) === normalizedSegment,
  );
};
