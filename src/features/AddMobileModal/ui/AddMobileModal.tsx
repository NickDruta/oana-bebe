import React, { useState } from "react";
import { Button, Input, Modal } from "shared/ui";
import { useCreateOrderMutation } from "entities/OrdersData";
import cls from "./AddMobileModal.module.scss";

interface AddMobileModalProps {
  handleClickAway: () => void;
}

const AddMobileModal = ({ handleClickAway }: AddMobileModalProps) => {
  const [mobile, setMobile] = useState("");
  const [createOrder] = useCreateOrderMutation();

  const cart = localStorage.getItem("cart");
  const parsedCart = cart && JSON.parse(cart);

  const handleCreate = () => {
    createOrder(
      JSON.stringify({
        phoneNumber: mobile,
        productDetails: parsedCart,
      })
    ).then(() => {
      localStorage.removeItem("cart");
      window.dispatchEvent(new Event("cart"));
      handleClickAway();
    });
  };

  return (
    <Modal handleClickAway={handleClickAway}>
      <div className={cls.modalWrapper}>
        <p className={cls.title}>Adauga numărul de telefon:</p>
        <Input
          value={mobile}
          handleChange={(value) => setMobile(value)}
          placeholder="Mobile"
        />
        <Button type="primary" text="Finalizare" onClick={handleCreate} />
      </div>
    </Modal>
  );
};

export default AddMobileModal;
