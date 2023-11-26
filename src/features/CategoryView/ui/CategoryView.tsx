import React, { useState } from "react";
import clsx from "clsx";
import { CategoryAndSubcategory } from "entities/CategoryData";
import { useClickAwayListener } from "shared/hooks";
import cls from "./CategoryView.module.scss";
import { i18n } from "shared/providers";

interface CategoryViewProps {
  category: CategoryAndSubcategory;
  isActive: boolean;
  handleCategoryChange: (category: string, subcategoryId: number) => void;
}

const CategoryView = ({
  category,
  isActive,
  handleCategoryChange,
}: CategoryViewProps) => {
  const isRu = i18n.language === "ru";
  const [isOpen, setIsOpen] = useState(false);

  const handleClickAway = () => {
    setIsOpen(false);
  };
  const wrapperRef = useClickAwayListener({ handleClickAway });

  return (
    <div className={cls.categoryWrapper} ref={wrapperRef}>
      <div
        className={clsx(
          cls.category,
          (isOpen || isActive) && cls.activeCategory
        )}
        onClick={() => setIsOpen(true)}
      >
        <p>
          {isRu
            ? category.categoryType.categoryTypeNameRu
            : category.categoryType.categoryTypeName}
        </p>
        <p>&#8595;</p>
      </div>
      {isOpen ? (
        <div className={cls.subcategoriesWrapper}>
          {category.subCategoryResponse.map((subcategory, index) => (
            <p
              key={index}
              onClick={() => {
                setIsOpen(false);
                handleCategoryChange(
                  category.categoryType.categoryTypeName,
                  subcategory.subCategoryId
                );
              }}
            >
              {isRu
                ? subcategory.subCategoryNameRu
                : subcategory.subCategoryName}
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
