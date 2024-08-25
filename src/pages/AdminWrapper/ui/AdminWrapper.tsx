import React from "react";
import { useLocation } from "react-router-dom";
import { ManagementCompanies } from "widgets/ManagementCompanies";
import { ManagementCategories } from "widgets/ManagementCategories";
import { ManagementProducts } from "widgets/ManagementProducts";
import { ManagementOrders } from "widgets/ManagementOrders";
import { ManagementSideBar } from "features/ManagementSideBar";
import cls from "./AdminWrapper.module.scss";
import { ManagementSlider } from "../../../widgets/ManagementSlider";
import { ManagementSEO } from "widgets/ManagementSEO";

const AdminWrapper = () => {
  const location = useLocation();
  const typeData = location.pathname.split("/")[2];

  return (
    <div className={cls.adminWrapper}>
      <ManagementSideBar />
      {typeData === "slider" ? (
        <ManagementSlider />
      ) : typeData === "companies" ? (
        <ManagementCompanies />
      ) : typeData === "categories" ? (
        <ManagementCategories />
      ) : typeData === "products" ? (
        <ManagementProducts />
      ) : typeData === "seo" ? (
        <ManagementSEO />
      ) : (
        <ManagementOrders />
      )}
    </div>
  );
};

export default AdminWrapper;
