import React, { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash/debounce';
import clsx from 'clsx';
import cls from './TextArea.module.scss';

interface TextAreaProps {
  placeholder: string;
  value: string;
  handleChange: (value: string) => void;
  className?: string;
}

const TextArea = ({
    value,
    handleChange,
    placeholder,
    className,
  }: TextAreaProps) => {
  const [textValue, setTextValue] = useState(value);

  const debouncedHandleChange = useCallback(
      debounce((value: string) => {
        handleChange(value);
      }, 500),
      []
  );

  useEffect(() => {
    if (textValue !== value) {
      debouncedHandleChange(textValue);
    }
  }, [textValue, debouncedHandleChange]);

  useEffect(() => {
    setTextValue(value);
  }, [value]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextValue(e.target.value);
  };

  return (
      <textarea
          className={clsx(cls.textArea, className)}
          placeholder={placeholder}
          value={textValue}
          onChange={handleTextChange}
      />
  );
};

export default TextArea;
