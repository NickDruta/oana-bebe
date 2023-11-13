import React from "react";
import cls from "./LoadingSpinner.module.scss";

const LoadingSpinner = () => {
  return (
    <div className={cls.loadingSpinnerWrapper}>
      <div className={cls.loadingSpinner} />
    </div>
  );
};

export default LoadingSpinner;
