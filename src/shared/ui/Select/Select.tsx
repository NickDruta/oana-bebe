import React, { useState } from "react";
import cls from "./Select.module.scss";

interface SelectProps {
  options: string[];
  value: string;
  placeholder: string;
  handleChange: (option: string) => void;
}

const Select = ({ options, value, handleChange, placeholder }: SelectProps) => {
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
        <div className={cls.optionsWrapper}>
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
