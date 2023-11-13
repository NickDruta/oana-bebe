import React, { useState } from "react";
import {
  ProductInterface,
  useUpdateProductMutation,
} from "entities/ProductsData";
import { Button, Input, Modal } from "shared/ui";
import cls from "./DiscountModal.module.scss";
import clsx from "clsx";

interface DiscountModalProps {
  handleClose: () => void;
  selectedProduct: ProductInterface;
}

const DiscountModal = ({
  handleClose,
  selectedProduct,
}: DiscountModalProps) => {
  const [discountValue, setDiscountValue] = useState("");
  const [index, setIndex] = useState(0);
  const [updateProduct] = useUpdateProductMutation();

  const handleCreate = () => {
    let newImages = selectedProduct.images.map((img, idx) =>
      idx === index ? { ...img, discount: Number(discountValue) } : img
    );

    updateProduct({
      productId: selectedProduct.productId,
      imageId: selectedProduct.images[index].imageId,
      productName: null,
      description: null,
      price: null,
      productCompany: null,
      isDiscount: true,
      discountPrice: discountValue,
    }).then(() => window.location.reload());
  };

  const handleReset = () => {
    updateProduct({
      productId: selectedProduct.productId,
      imageId: selectedProduct.images[index].imageId,
      productName: null,
      description: null,
      price: null,
      productCompany: null,
      isDiscount: false,
      discountPrice: 0,
    }).then(() => window.location.reload());
  };

  return (
    <Modal handleClickAway={handleClose}>
      <div className={cls.modalWrapper}>
        <p className={cls.title}>Crează reducere</p>
        <div className={cls.colorsWrapper}>
          {selectedProduct.images.map((item, i) => (
            <div
              key={i}
              className={clsx(
                cls.color,
                selectedProduct.images[index].imageId === item.imageId &&
                  cls.activeColor
              )}
              style={{ background: item.colorName }}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
        <Input
          defaultValue={selectedProduct.images[index].discount ?? ""}
          value={discountValue ?? ''}
          handleChange={(value) => setDiscountValue(value)}
          placeholder="Reducerea"
        />
        <div className={cls.buttonsWrapper}>
          {selectedProduct.images[index].discount ? (
              <Button type="secondary" text="Resetează" onClick={handleReset} />
            ) : <></>}
          <Button type="primary" text="Crează" onClick={handleCreate} />
        </div>
      </div>
    </Modal>
  );
};

export default DiscountModal;
