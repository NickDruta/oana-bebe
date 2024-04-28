import React, { ReactElement } from "react";
import { createPortal } from "react-dom";
import { useClickAwayListener } from "shared/hooks";
import cls from "./Modal.module.scss";

interface ModalProps {
  children: ReactElement;
  handleClickAway: () => void;
}

const Modal = ({ children, handleClickAway }: ModalProps) => {
  const wrapperRef = useClickAwayListener({
    handleClickAway,
    delayActivation: true,
  });
  const rootElement = document.getElementById("root");

  if (!rootElement) {
    return null;
  }

  const component = (
    <div className={cls.overlay}>
      <div ref={wrapperRef} className={cls.modalWrapper}>
        {children}
      </div>
    </div>
  );

  return createPortal(component, rootElement);
};

export default Modal;
