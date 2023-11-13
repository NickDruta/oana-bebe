import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "features/LoginForm";
import cls from "./ManagementHome.module.scss";

const ManagementHome = () => {
  const navigate = useNavigate();
  const sessionLogin = sessionStorage.getItem("admin");

  const goToMainPage = () => {
    navigate("/");
    navigate(0);
  };

  useEffect(() => {
    if (sessionLogin) {
      navigate("/management/categories");
    }
  }, [])

  return (
    <div className={cls.managementHomeWrapper}>
      <LoginForm goToMainPage={goToMainPage} />
    </div>
  );
};

export default ManagementHome;
