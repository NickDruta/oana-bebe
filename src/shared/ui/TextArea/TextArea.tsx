import React, { useState, useEffect } from "react";
import clsx from "clsx";
import cls from "./TextArea.module.scss";

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

  useEffect(() => {
    const timer = setTimeout(() => {
      handleChange(textValue);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [textValue, handleChange]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextValue(e.target.value);
  };

  return (
    <textarea
      className={clsx(cls.textArea, className)}
      placeholder={placeholder}
      value={textValue}
      onChange={handleTextChange}
    ></textarea>
  );
};

export default TextArea;
