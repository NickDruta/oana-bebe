import React from "react";
import clsx from "clsx";
import { changeLanguage } from "i18next";
import cls from "./Switcher.module.scss";

interface SwitcherProps<T> {
  selectedOption: T;
  options: T[];
  onChange: (selectedOption: T) => void;
  className?: string;
}

const Switcher = <T extends string>({
  selectedOption,
  options,
  onChange,
  className,
}: SwitcherProps<T>) => {
  return (
    <div className={clsx(cls.switcherWrapper, className)}>
      {options.map((item, index) => (
        <div
          key={index}
          className={cls.item}
          onClick={() => {
            window.location.reload();
            changeLanguage(item);
          }}
        >
          {item}
        </div>
      ))}
      <div
        className={clsx(
          cls.activeBackground,
          selectedOption !== options[0] ? cls.right : cls.left,
        )}
      />
    </div>
  );
};

export default Switcher;
