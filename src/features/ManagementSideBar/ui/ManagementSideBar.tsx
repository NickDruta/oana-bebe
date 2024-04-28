import React from "react";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";
import { Logo } from "shared/assets";
import cls from "./ManagementSideBar.module.scss";

const ManagementSideBar = () => {
  const navigate = useNavigate();

  const goToMainPage = () => {
    navigate("/");
    navigate(0);
  };

  return (
    <div className={cls.managementSideBarWrapper}>
      <Logo className={cls.logo} onClick={goToMainPage} />
      <div className={cls.linksWrapper}>
        <p
          className={clsx(
            cls.link,
            window.location.pathname === "/management/products" && cls.active,
          )}
          onClick={() => navigate("/management/products")}
        >
          Produse
        </p>
        <p
          className={clsx(
            cls.link,
            window.location.pathname === "/management/orders" && cls.active,
          )}
          onClick={() => navigate("/management/orders")}
        >
          Comenzi
        </p>
        <p
          className={clsx(
            cls.link,
            window.location.pathname === "/management/slider" && cls.active,
          )}
          onClick={() => navigate("/management/slider")}
        >
          Slider
        </p>
        <p
          className={clsx(
            cls.link,
            window.location.pathname === "/management/categories" && cls.active,
          )}
          onClick={() => navigate("/management/categories")}
        >
          Categorii
        </p>
        <p
          className={clsx(
            cls.link,
            window.location.pathname === "/management/companies" && cls.active,
          )}
          onClick={() => navigate("/management/companies")}
        >
          Companii
        </p>
      </div>
    </div>
  );
};

export default ManagementSideBar;
