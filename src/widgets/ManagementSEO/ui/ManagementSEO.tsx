import cls from "./ManagementSEO.module.scss";
import React, { useState } from "react";
import { EditIcon } from "shared/assets";
import { EditAboutDataModal } from "entities/EditAboutDataModal";
import { useGetCategoriesQuery } from "entities/CategoryData";
import { LoadingSpinner } from "shared/ui";
import { EditCategoryDataModal } from "entities/EditCategoryDataModal";

const ManagementSEO = () => {
  const { data: categoriesData, isLoading } = useGetCategoriesQuery();

  const [editAboutModalOpen, setEditAboutModalOpen] = useState(false);
  const [editCategoryName, setEditCategoryName] = useState<string | null>(null);

  return (
    <div className={cls.managementSEOWrapper}>
      <div className={cls.contentWrapper}>
        <div className={cls.headerWrapper}>
          <p className={cls.title}>SEO</p>
        </div>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className={cls.itemsWrapper}>
            <div className={cls.itemWrapper}>
              <p>Homepage</p>
              <EditIcon
                width={18}
                height={18}
                fill={"#000"}
                cursor={"pointer"}
                onClick={() => setEditAboutModalOpen(true)}
              />
            </div>
            {categoriesData
              ?.flatMap((item) => item.categorySet)
              .map((category) => (
                <div className={cls.itemWrapper}>
                  <p>{category.categoryName}</p>
                  <EditIcon
                    width={18}
                    height={18}
                    fill={"#000"}
                    cursor={"pointer"}
                    onClick={() =>
                      setEditCategoryName(
                        category.categoryName
                          .replaceAll(" ", "—")
                          .toLowerCase(),
                      )
                    }
                  />
                </div>
              ))}
          </div>
        )}
      </div>
      {editAboutModalOpen ? (
        <EditAboutDataModal handleClose={() => setEditAboutModalOpen(false)} />
      ) : null}
      {editCategoryName ? (
        <EditCategoryDataModal
          handleClose={() => setEditCategoryName(null)}
          name={editCategoryName}
        />
      ) : null}
    </div>
  );
};

export default ManagementSEO;
