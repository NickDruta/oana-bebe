import React, { useCallback, useState } from "react";
import { toast } from "react-toastify";
import { AddBasicInfo } from "features/AddBasicInfo";
import {
  ProductInterface,
  useUpdateBasicInfoMutation,
} from "entities/ProductsData";
import { Button, Modal, Switcher } from "shared/ui";
import { translateText } from "shared/lib/translateText/translateText";
import cls from "./EditProduct.module.scss";

interface Props {
  selectedProduct: ProductInterface;
  handleClose: () => void;
}

const EditProduct = ({ selectedProduct, handleClose }: Props) => {
  const [triggerUpdate] = useUpdateBasicInfoMutation();
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(selectedProduct);
  const [language, setLanguage] = useState("ro");

  const handleChange = useCallback(
    (
      key: keyof ProductInterface,
      value: string | number | boolean | object | null,
    ) => {
      setProduct((currentProduct) => ({ ...currentProduct, [key]: value }));
    },
    [],
  );

  const saveBasicInfo = async () => {
    setLoading(true);

    triggerUpdate({
      productId: product.productId,
      productName: product.productName,
      productNameRu: product.productNameRu,
      description: product.description,
      descriptionRu: product.descriptionRu,
      companyName: product.companyName,
      categoryId: product.category.categoryId,
      specifications: product.specifications,
      specificationsRu: product.specificationsRu,
    }).then((res: any) => {
      if ("data" in res) {
        setLoading(false);
        handleClose();
        window.location.reload();
        toast.success("Informațiile generale ale produsului au fost salvate!");
      } else {
        setLoading(false);
        toast.error(res.error.data.error);
      }
    });
  };

  const questionHandleClose = () => {
    if (window.confirm("Sigur vrei sa închizi?")) {
      handleClose();
    }
  };

  return (
    <Modal handleClickAway={questionHandleClose}>
      <div className={cls.modalWrapper}>
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <p className={cls.title}>Editează produs</p>
          <Switcher
            selectedOption={language}
            options={["ro", "ru"]}
            onChange={setLanguage}
          />
        </div>
        <div className={cls.dataWrapper}>
          <AddBasicInfo
            product={product}
            handleChange={handleChange}
            isRO={language === "ro"}
            isEdit
          />
          <div className={cls.buttonsWrapper}>
            <Button
              type={"primary"}
              text="Finiseaza"
              onClick={saveBasicInfo}
              disabled={loading}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default EditProduct;
