import React, { useState } from "react";
import clsx from "clsx";
import {
  CategoryAndSubcategory,
  SubCategoryResponse,
} from "entities/CategoryData";
import { useClickAwayListener } from "shared/hooks";
import cls from "./CategoryView.module.scss";
import { i18n } from "shared/providers";

interface CategoryViewProps {
  category: CategoryAndSubcategory;
  isActive: boolean;
  subcategoryActive: string;
  handleCategoryChange: (
    category: string,
    subcategoryId: string,
    subCategoryId: number,
  ) => void;
}

const CategoryView = ({
  category,
  isActive,
  subcategoryActive,
  handleCategoryChange,
}: CategoryViewProps) => {
  const isRu = i18n.language === "ru";
  const [isOpen, setIsOpen] = useState(false);

  const handleClickAway = () => {
    setIsOpen(false);
  };

  const wrapperRef = useClickAwayListener({ handleClickAway });

  const handleClick = (subcategory: SubCategoryResponse) => {
    console.log("subcategory --->", subcategory);
    if (subcategory.categoryName === subcategoryActive) {
      setIsOpen(false);
      setTimeout(() => {
        window.location.href = "/produse";
      }, 100); // 0.1 second timeout
    } else {
      setIsOpen(false);
      setTimeout(() => {
        handleCategoryChange(
          category.categoryType,
          subcategory.categoryName,
          subcategory.categoryId,
        );
      }, 100); // 0.1 second timeout
    }
  };

  const handleOpening = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={cls.categoryWrapper} ref={wrapperRef}>
      <div
        className={clsx(
          cls.category,
          (isOpen || isActive) && cls.activeCategory,
        )}
        onClick={handleOpening}
      >
        <p>{isRu ? category.categoryTypeRu : category.categoryType}</p>
        <p>&#8595;</p>
      </div>
      {isOpen ? (
        <div className={cls.subcategoriesWrapper}>
          {category.categorySet.map((subcategory, index) => (
            <p
              key={index}
              style={
                subcategory.categoryName === subcategoryActive
                  ? { color: "#cc3292" }
                  : {}
              }
              onClick={() => {
                handleClick(subcategory);
              }}
            >
              {isRu ? subcategory.categoryNameRu : subcategory.categoryName}
            </p>
          ))}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default CategoryView;
