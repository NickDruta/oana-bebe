import React, { useState, useEffect, useCallback } from "react";
import debounce from "lodash/debounce";
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
  const [inputValue, setInputValue] = useState(value || defaultValue || "");

  /**
   * Debounce handleChange to avoid rapid state updates
   */
  const debouncedHandleChange = useCallback(
    debounce((nextValue: string) => {
      handleChange(nextValue);
    }, 500),
    [handleChange],
  );

  /**
   * Effect for initializing or resetting input based on external value changes
   */
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  /**
   * Update debounced change when inputValue changes
   */
  useEffect(() => {
    if (inputValue !== value) {
      debouncedHandleChange(inputValue);
    }

    /**
     * Cleanup function to cancel the debounced call on unmount or when input changes rapidly
     */
    return () => {
      debouncedHandleChange.cancel();
    };
  }, [inputValue, debouncedHandleChange, value]);

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
