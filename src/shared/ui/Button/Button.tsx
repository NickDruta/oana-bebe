import React from "react";
import clsx from "clsx";
import cls from "./Button.module.scss";

type ButtonType = "primary" | "secondary";

interface ButtonProps {
  type: ButtonType;
  text: string;
  onClick: (e?: any) => void;
  className?: string;
  disabled?: boolean;
}

const Button = ({ type, text, onClick, className, disabled }: ButtonProps) => {
  return (
    <div
      className={clsx(
          cls.button,
          type === "primary" ? cls.primaryButton : cls.secondaryButton,
          className,
          disabled && cls.disabled)}
      onClick={onClick}
    >
      {text}
    </div>
  );
};

export default Button;
