import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGetCategoriesQuery } from "entities/CategoryData";
import { CategoryViewAdmin } from "entities/CategoryViewAdmin";
import { LoadingSpinner } from "shared/ui";
import cls from "./ManagementCategories.module.scss";

const ManagementCategories = () => {
  const navigate = useNavigate();
  const { data: categoriesData, isLoading } = useGetCategoriesQuery();

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
                <CategoryViewAdmin key={index} category={category} />
              ))}
            <CategoryViewAdmin isAdd />
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagementCategories;
