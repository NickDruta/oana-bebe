import React, { useState, useEffect } from "react";
import clsx from "clsx";
import cls from "./Input.module.scss";

interface InputProps {
  placeholder: string;
  value: string;
  handleChange: (value: string) => void;
  defaultValue?: string;
  className?: string;
}

const Input = ({
  placeholder,
  value,
  handleChange,
  defaultValue,
  className,
}: InputProps) => {
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleChange(inputValue);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [inputValue, handleChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <input
      className={clsx(cls.input, className)}
      placeholder={placeholder}
      value={inputValue ? inputValue : undefined}
      defaultValue={defaultValue}
      onChange={handleInputChange}
    />
  );
};

export default Input;
