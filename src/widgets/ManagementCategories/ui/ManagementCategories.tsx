import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCreateCategoryMutation,
  useGetCategoriesQuery,
  useUpdateCategoryMutation,
} from "entities/CategoryData";
import { CategoryViewAdmin } from "entities/CategoryViewAdmin";
import { LoadingSpinner } from "shared/ui";
import cls from "./ManagementCategories.module.scss";
import { AddIcon } from "../../../shared/assets";
import { CategoryModal } from "../../../features/CategoryModal";
import { CategoryTypeInterface } from "../../../entities/ProductsData";
import { toast } from "react-toastify";

const ManagementCategories = () => {
  const navigate = useNavigate();
  const { data: categoriesData, isLoading } = useGetCategoriesQuery();
  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();

  const [category, setCategory] = useState<Partial<CategoryTypeInterface>>({
    categoryType: "",
    categoryTypeRu: "",
    order: undefined,
  });
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const handleCategoryModalOpen = (value: boolean) => {
    setIsCategoryModalOpen(value);
  };

  const handleEditCategoryActivation = (value: CategoryTypeInterface) => {
    setIsCategoryModalOpen(true);
    setIsEdit(true);
    setCategory(value);
  };

  const handleCategoryChange = (
    newCategory: Partial<CategoryTypeInterface>,
  ) => {
    setCategory((prevCategory) => {
      const updatedCategory = { ...prevCategory, ...newCategory };

      return updatedCategory;
    });
  };

  const handleSave = () => {
    if (isEdit) {
      updateCategory(category).then(() => {
        toast.success("Categorie modificată cu success!");
        handleCategoryModalOpen(false);
        setIsEdit(false);
      });
    } else {
      createCategory(category).then(() => {
        toast.success("Categorie adăugată cu success!");
        handleCategoryModalOpen(false);
        setCategory({});
      });
    }
  };

  useEffect(() => {
    if (!sessionStorage.getItem("jwt")) navigate("/management");
  }, []);

  return (
    <div className={cls.managementCategoriesWrapper}>
      <div className={cls.contentWrapper}>
        <div className={cls.headerWrapper}>
          <p className={cls.title}>Categorii</p>
        </div>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className={cls.categoriesWrapper}>
            {categoriesData &&
              categoriesData.map((category, index) => (
                <CategoryViewAdmin
                  key={index}
                  category={category}
                  handleEditCategoryActivation={handleEditCategoryActivation}
                />
              ))}
            <div
              className={cls.addWrapper}
              onClick={() => handleCategoryModalOpen(true)}
            >
              <AddIcon style={{ width: 48, height: 48, stroke: "#ffbbeb" }} />
            </div>
          </div>
        )}
      </div>
      {isCategoryModalOpen ? (
        <CategoryModal
          handleClose={() => {
            handleCategoryModalOpen(false);
            setIsEdit(false);
            setCategory({});
          }}
          category={category}
          showOrder={isEdit}
          handleCategoryChange={handleCategoryChange}
          handleSave={handleSave}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default ManagementCategories;
