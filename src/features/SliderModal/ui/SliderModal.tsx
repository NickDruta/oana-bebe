import React from "react";
import { Button, Input, Modal } from "../../../shared/ui";
import cls from "./SliderModal.module.scss";
import { Slider } from "../../../entities/SliderData/types/sliderTypes";

interface Props {
  slider: Partial<Slider>;
  handleChange: (value: Partial<Slider>) => void;
  handleFileChange: (value: File) => void;
  handleSave: () => void;
  handleClose: () => void;
}

const SliderModal = ({
  slider,
  handleChange,
  handleFileChange,
  handleSave,
  handleClose,
}: Props) => {
  return (
    <Modal handleClickAway={handleClose}>
      <div className={cls.modalWrapper}>
        <p className={cls.title}>Adaugă o nouă imagine</p>
        <div className={cls.contentWrapper}>
          <input
            type="file"
            onChange={(e) => {
              if (e.target.files) {
                const file = e.target.files[0];
                handleFileChange(file);
              }
            }}
          />
          <Input
            placeholder={"Linkul care se va deschide: /produse/334?color=0"}
            value={slider.linkUrl ?? ""}
            handleChange={(value) => handleChange({ linkUrl: value })}
          />
        </div>
        <Button type="primary" text="Salvează" onClick={handleSave} />
      </div>
    </Modal>
  );
};

export default SliderModal;
