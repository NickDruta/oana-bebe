import React, { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash/debounce';
import clsx from 'clsx';
import cls from './Input.module.scss';

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
  const [inputValue, setInputValue] = useState(value || defaultValue || "");

  const debouncedHandleChange = useCallback(
      debounce((value: string) => {
        handleChange(value);
      }, 500),
      [handleChange]
  );

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    if (inputValue !== value) {
      debouncedHandleChange(inputValue);
    }
  }, [inputValue, debouncedHandleChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
      <input
          className={clsx(cls.input, className)}
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
      />
  );
};

export default Input;
