import React, { useState, useEffect, useCallback } from "react";
import debounce from "lodash/debounce";
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

  // Create a debounced function that only triggers after 500ms of inactivity
  const debouncedHandleChange = useCallback(
    debounce((nextValue: string) => {
      handleChange(nextValue);
    }, 500),
    [handleChange],
  );

  // Update local state when the parent component provides new 'value'
  useEffect(() => {
    setTextValue(value);
  }, [value]);

  /**
   * Call the debounced change handler function whenever textValue changes
   */
  useEffect(() => {
    if (textValue !== value) {
      debouncedHandleChange(textValue);
    }

    /**
     * Cleanup function to cancel the debounced call on unmount or when input changes rapidly
     */
    return () => {
      debouncedHandleChange.cancel();
    };
  }, [textValue, debouncedHandleChange, value]);

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
