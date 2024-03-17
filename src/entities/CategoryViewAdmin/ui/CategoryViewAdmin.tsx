import clsx from "clsx";
import {
  CategoryAndSubcategory,
  useCreateCategoryMutation,
  useCreateSubcategoryMutation,
  useDeleteCategoryMutation,
} from "entities/CategoryData";
import { useState } from "react";
import { AddIcon, DeleteIcon } from "shared/assets";
import { translateText } from "shared/lib/translateText/translateText";
import cls from "./CategoryViewAdmin.module.scss";

interface CategoryViewAdminProps {
  category?: CategoryAndSubcategory;
  isAdd?: boolean;
}

const CategoryViewAdmin = ({ category, isAdd }: CategoryViewAdminProps) => {
  const [addSelected, setAddSelected] = useState(false);
  const [subCategoryAdd, setSubCategoryAdd] = useState(false);
  const [categoryText, setCategoryText] = useState("");
  const [subCategoryText, setSubcategoryText] = useState("");

  const [createCategory] = useCreateCategoryMutation();
  const [createSubcategory] = useCreateSubcategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const handleCreateCategory = async () => {
    if (categoryText) {
      const ruResponse = await translateText(categoryText);
      const ruText = ruResponse.data.translations[0].translatedText;

      createCategory({ roText: categoryText, ruText: ruText }).then(() =>
        window.location.reload()
      );
    }
    if (subCategoryText && category) {
      const ruResponse = await translateText(subCategoryText);
      const ruText = ruResponse.data.translations[0].translatedText;
      
      createSubcategory({
        type_id: category.categoryTypeId,
        name: subCategoryText,
        nameRu: ruText,
      }).then(() => window.location.reload());
    }
  };

  const handleDelete = () => {
    if (category) {
      deleteCategory(category.categoryTypeId).then(() =>
        window.location.reload()
      );
    }
  };

  return (
    <div
      className={clsx(
        cls.categoryViewAdminWrapper,
        isAdd && !addSelected && cls.add
      )}
      onClick={() => isAdd && setAddSelected(true)}
    >
      {!isAdd && <DeleteIcon className={cls.delete} onClick={handleDelete} />}
      {isAdd && !addSelected ? (
        <>
          <AddIcon />
        </>
      ) : (
        <>
          {addSelected ? (
            <input
              onChange={(e) => setCategoryText(e.target.value)}
              value={categoryText}
            />
          ) : (
            <p className={cls.title}>
              {category?.categoryType}
            </p>
          )}
          <div className={cls.subCategoriesWrapper}>
            {category &&
              category.categorySet.map((item, index) => (
                <div className={cls.subCategory} key={index}>
                  {item.categoryName}
                </div>
              ))}
            {subCategoryAdd ? (
              <div className={cls.subCategory}>
                <input
                  onChange={(e) => setSubcategoryText(e.target.value)}
                  value={subCategoryText}
                />
              </div>
            ) : (
              category && (
                <div
                  className={cls.subCategory}
                  onClick={() => setSubCategoryAdd(true)}
                  style={{ cursor: "pointer" }}
                >
                  <AddIcon style={{ width: 12, height: 12, stroke: "#000" }} />
                </div>
              )
            )}
          </div>
        </>
      )}
      {(addSelected || subCategoryAdd) && (
        <div className={cls.saveButton} onClick={handleCreateCategory}>
          Salveaza
        </div>
      )}
    </div>
  );
};

export default CategoryViewAdmin;
