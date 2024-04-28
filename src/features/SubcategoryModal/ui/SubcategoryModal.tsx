import React from "react";
import Modal from "shared/ui/Modal/Modal";
import { CategoryInterface } from "entities/ProductsData";
import { Input } from "shared/ui";
import cls from "./SubcategoryModal.module.scss";
import { Button } from "../../../shared/ui";

interface Props {
  handleClose: () => void;
  subcategory: Partial<CategoryInterface>;
  showOrder: boolean;
  handleSubcategory: (value: Partial<CategoryInterface>) => void;
  handleSave: () => void;
}

const SubcategoryModal = ({
  handleClose,
  subcategory,
  showOrder,
  handleSubcategory,
  handleSave,
}: Props) => {
  return (
    <Modal handleClickAway={handleClose}>
      <div className={cls.modalWrapper}>
        <p className={cls.title}>Adauga Subcategorie</p>
        <div className={cls.contentWrapper}>
          <Input
            placeholder={"Numele subcategoriei în RO"}
            value={subcategory.categoryName ?? ""}
            handleChange={(value) => handleSubcategory({ categoryName: value })}
          />
          <Input
            placeholder={"Numele subcategoriei în RU"}
            value={subcategory.categoryNameRu ?? ""}
            handleChange={(value) =>
              handleSubcategory({ categoryNameRu: value })
            }
          />
          {showOrder ? (
            <Input
              placeholder={"Ordinea"}
              value={subcategory.order ?? ""}
              handleChange={(value) => handleSubcategory({ order: value })}
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

export default SubcategoryModal;
