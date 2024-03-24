import React, { useState } from "react";
import {
  ProductInterface, useGetProductDetailsQuery,
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
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [updateProduct] = useUpdateProductMutation();

  const handleCreate = () => {
    // let newImages = selectedProduct?.image.map((img, idx) =>
    //     idx === index ? { ...img, discount: Number(discountValue) } : img
    // );

    // updateProduct({
    //   productId: selectedProduct?.productId,
    //   // imageId: selectedProduct?.image[index],
    //   productName: null,
    //   description: null,
    //   price: null,
    //   productCompany: null,
    //   isDiscount: true,
    //   discountPrice: Number(discountValue),
    // })
    //     .then(() => handleClose());
  };

  const handleReset = () => {
    // updateProduct({
    //   productId: selectedProduct.productId,
    //   imageId: selectedProduct.images[index].imageId,
    //   productName: null,
    //   description: null,
    //   price: null,
    //   productCompany: null,
    //   isDiscount: false,
    //   discountPrice: 0,
    // }).then(() => window.location.reload());
  };

  return (
      <Modal handleClickAway={handleClose}>
        <div className={cls.modalWrapper}>
          <p className={cls.title}>Crează reducere</p>
          <div className={cls.colorsWrapper}>
            {selectedProduct?.image.map((item, i) => (
                <div
                    key={i}
                    className={clsx(
                        cls.color,
                        selectedColorIndex === i &&
                        cls.activeColor
                    )}
                    style={{ background: item.color }}
                    onClick={() => setSelectedColorIndex(i)}
                />
            ))}
          </div>
          <Input
              defaultValue={selectedProduct.image[selectedColorIndex].discountPrice ? String(selectedProduct.image[selectedColorIndex].discountPrice) : ""}
              value={discountValue ?? ''}
              handleChange={(value) => setDiscountValue(value)}
              placeholder="Reducerea"
          />
          <div className={cls.buttonsWrapper}>
            {selectedProduct?.image[selectedColorIndex].discountPrice ? (
                <Button type="secondary" text="Resetează" onClick={handleReset} />
            ) : <></>}
            <Button type="primary" text="Crează" onClick={handleCreate} />
          </div>
        </div>
      </Modal>
  )
};

export default DiscountModal;
