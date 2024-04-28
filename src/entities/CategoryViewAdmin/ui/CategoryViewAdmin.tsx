import clsx from "clsx";
import {
  CategoryAndSubcategory,
  useCreateCategoryMutation,
  useCreateSubcategoryMutation,
  useDeleteCategoryMutation,
  useDeleteSubcategoryMutation,
  useUpdateSubcategoryMutation,
} from "entities/CategoryData";
import { useState } from "react";
import { AddIcon, DeleteIcon, EditIcon } from "shared/assets";
import cls from "./CategoryViewAdmin.module.scss";
import { CategoryInterface, CategoryTypeInterface } from "../../ProductsData";
import { toast } from "react-toastify";
import { SubcategoryModal } from "../../../features/SubcategoryModal";

interface CategoryViewAdminProps {
  category?: CategoryAndSubcategory;
  handleEditCategoryActivation: (value: CategoryTypeInterface) => void;
}

const CategoryViewAdmin = ({
  category,
  handleEditCategoryActivation,
}: CategoryViewAdminProps) => {
  const [createSubcategory] = useCreateSubcategoryMutation();
  const [updateSubcategory] = useUpdateSubcategoryMutation();
  const [deleteSubcategory] = useDeleteSubcategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const [isSubcategoryOpen, setIsSubcategoryOpen] = useState(false);
  const [subcategory, setSubcateory] = useState<Partial<CategoryInterface>>({});
  const [isEdit, setIsEdit] = useState(false);

  const handleSubcategoryModalOpen = (value: boolean) => {
    setIsSubcategoryOpen(value);
  };

  const handleSubcategoryChange = (newCategory: Partial<CategoryInterface>) => {
    setSubcateory((prevSubcategory) => {
      const updatedSubcategory = { ...prevSubcategory, ...newCategory };

      return updatedSubcategory;
    });
  };

  const handleSave = () => {
    if (isEdit) {
      updateSubcategory({
        ...subcategory,
        categoryTypeId: category?.categoryTypeId,
      }).then(() => {
        toast.success("Subcategorie modificată cu success!");
        setSubcateory({});
        setIsSubcategoryOpen(false);
        setIsEdit(false);
      });
    } else {
      createSubcategory({
        ...subcategory,
        categoryTypeId: category?.categoryTypeId,
      }).then(() => {
        toast.success("Subcategorie adăugată cu success!");
        setSubcateory({});
        setIsSubcategoryOpen(false);
      });
    }
  };

  const handleSubcategoryDelete = (subcategoryId: any) => {
    if (window.confirm("Sigur vrei să ștergi subcategoria?")) {
      deleteSubcategory({
        subcategoryId,
        categoryTypeId: category?.categoryTypeId,
      }).then(() => toast.success("Subcategorie ștearsă cu success!"));
    }
  };

  const handleCategoryDelete = () => {
    if (window.confirm("Sigur vrei să ștergi categoria?")) {
      category &&
        deleteCategory(category.categoryTypeId).then(() =>
          toast.success("Categorie ștearsă cu success!"),
        );
    }
  };

  return (
    <div className={clsx(cls.categoryViewAdminWrapper)}>
      <DeleteIcon className={cls.delete} onClick={handleCategoryDelete} />
      <EditIcon
        className={cls.edit}
        onClick={() =>
          handleEditCategoryActivation(category as CategoryTypeInterface)
        }
      />
      <p className={cls.title}>{category?.categoryType}</p>
      <div className={cls.subCategoriesWrapper}>
        {category &&
          category.categorySet.map((item, index) => (
            <div className={cls.subCategory} key={index}>
              {item.categoryName}
              <div className={cls.actionSubcategoryWrapper}>
                <EditIcon
                  width={12}
                  height={12}
                  fill={"#000"}
                  cursor={"pointer"}
                  onClick={() => {
                    setIsEdit(true);
                    setSubcateory(item);
                    handleSubcategoryModalOpen(true);
                  }}
                />
                <DeleteIcon
                  width={12}
                  height={12}
                  stroke={"#000"}
                  cursor={"pointer"}
                  onClick={() => {
                    handleSubcategoryDelete(item.categoryId);
                  }}
                />
              </div>
            </div>
          ))}
        <div
          className={cls.subCategory}
          style={{ cursor: "pointer" }}
          onClick={() => handleSubcategoryModalOpen(true)}
        >
          <AddIcon style={{ width: 12, height: 12, stroke: "#000" }} />
        </div>
      </div>
      {isSubcategoryOpen ? (
        <SubcategoryModal
          handleClose={() => {
            handleSubcategoryModalOpen(false);
            setIsEdit(false);
            setSubcateory({});
          }}
          subcategory={subcategory}
          showOrder={isEdit}
          handleSubcategory={handleSubcategoryChange}
          handleSave={handleSave}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default CategoryViewAdmin;
