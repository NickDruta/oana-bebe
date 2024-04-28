import React from "react";
import Modal from "shared/ui/Modal/Modal";
import { CategoryTypeInterface } from "entities/ProductsData";
import { Input } from "shared/ui";
import cls from "./CategoryModal.module.scss";
import { Button } from "../../../shared/ui";

interface Props {
  handleClose: () => void;
  category: Partial<CategoryTypeInterface>;
  showOrder: boolean;
  handleCategoryChange: (value: Partial<CategoryTypeInterface>) => void;
  handleSave: () => void;
}

const CategoryModal = ({
  handleClose,
  category,
  showOrder,
  handleCategoryChange,
  handleSave,
}: Props) => {
  return (
    <Modal handleClickAway={handleClose}>
      <div className={cls.modalWrapper}>
        <p className={cls.title}>
          {showOrder ? "Editeaza" : "Adauga"} Categorie
        </p>
        <div className={cls.contentWrapper}>
          <Input
            placeholder={"Numele categoriei în RO"}
            value={category.categoryType ?? ""}
            handleChange={(value) =>
              handleCategoryChange({ categoryType: value })
            }
          />
          <Input
            placeholder={"Numele categoriei în RU"}
            value={category.categoryTypeRu ?? ""}
            handleChange={(value) =>
              handleCategoryChange({ categoryTypeRu: value })
            }
          />
          {showOrder ? (
            <Input
              placeholder={"Ordinea"}
              value={category.order ?? ""}
              handleChange={(value) => handleCategoryChange({ order: value })}
            />
          ) : (
            <></>
          )}
        </div>
        <Button type={"primary"} text={"Salvează"} onClick={handleSave} />
      </div>
    </Modal>
  );
};

export default CategoryModal;
