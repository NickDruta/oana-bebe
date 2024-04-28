import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "features/LoginForm";
import cls from "./ManagementHome.module.scss";

const ManagementHome = () => {
  const navigate = useNavigate();
  const localLogin = sessionStorage.getItem("jwt");

  const goToMainPage = () => {
    navigate("/");
    navigate(0);
  };

  useEffect(() => {
    if (localLogin) {
      navigate("/management/products");
    }
  }, []);

  return (
    <div className={cls.managementHomeWrapper}>
      <LoginForm goToMainPage={goToMainPage} />
    </div>
  );
};

export default ManagementHome;
