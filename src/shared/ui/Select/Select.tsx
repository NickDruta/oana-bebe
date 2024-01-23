import React, { useState } from "react";
import cls from "./Select.module.scss";
import clsx from "clsx";

interface SelectProps {
  options: string[];
  value: string;
  placeholder: string;
  handleChange: (option: string) => void;
  optionsClassName?: string;
}

const Select = ({ options, value, handleChange, placeholder, optionsClassName }: SelectProps) => {
  const [optionsVisible, setOptionsVisible] = useState(false);

  const selectOption = (value: string) => {
    handleChange(value);
    setOptionsVisible(false);
  };

  return (
    <div className={cls.selectWrapper}>
      <div
        className={cls.value}
        onClick={() => setOptionsVisible(!optionsVisible)}
      >
        <p className={!value ? cls.placeholder : ""}>{value || placeholder}</p>
        <p>&#8593;</p>
      </div>
      {optionsVisible ? (
        <div className={clsx(cls.optionsWrapper, optionsClassName)}>
          {options.map((option, index) => (
            <div
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                selectOption(option);
              }}
              className={cls.option}
            >
              {option}
            </div>
          ))}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Select;
