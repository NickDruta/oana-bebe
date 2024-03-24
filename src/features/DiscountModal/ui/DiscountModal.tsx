import React, { useState } from "react";
import {PricesInfo} from "features/PricesInfo";
import {
  ProductInterface
} from "entities/ProductsData";
import { Button, Modal } from "shared/ui";
import cls from "./DiscountModal.module.scss";

interface DiscountModalProps {
  handleClose: () => void;
  resetData: () => void;
  selectedProduct: ProductInterface;
}

const DiscountModal = ({
  handleClose,
  resetData,
  selectedProduct,
}: DiscountModalProps) => {
  const [triggerAction, setTriggerAction] = useState(false);

  return (
      <Modal handleClickAway={handleClose}>
        <div className={cls.modalWrapper}>
          <p className={cls.title}>Crează reducere</p>
          <PricesInfo
              product={selectedProduct}
              triggerAction={triggerAction}
              resetTrigger={() => {
                resetData()
                setTriggerAction(false)
              }}
              handleClose={handleClose}
          />
          <div className={cls.buttonsWrapper}>
            <Button type="primary" text="Crează" onClick={() => setTriggerAction(true)}/>
          </div>
        </div>
      </Modal>
  )
};

export default DiscountModal;
