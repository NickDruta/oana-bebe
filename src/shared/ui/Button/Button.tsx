import React from "react";
import clsx from "clsx";
import cls from "./Button.module.scss";

type ButtonType = "primary" | "secondary";

interface ButtonProps {
  type: ButtonType;
  text: string;
  onClick: (e?: any) => void;
}

const Button = ({ type, text, onClick }: ButtonProps) => {
  return (
    <div
      className={clsx(cls.button, type === "primary" ? cls.primaryButton : cls.secondaryButton)}
      onClick={onClick}
    >
      {text}
    </div>
  );
};

export default Button;
