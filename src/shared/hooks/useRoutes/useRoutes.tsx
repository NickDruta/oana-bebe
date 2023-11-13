import React from "react";
import { Route, Routes } from "react-router-dom";
import { Home } from "pages/Home";
import { Products } from "pages/Products";
import { ProductDetails } from "pages/ProductDetails";
import { About } from "pages/About";
import { Contacts } from "pages/Contacts";
import { Catalog } from "pages/Catalog";
import { ManagementHome } from "pages/ManagementHome";
import { AdminWrapper } from "pages/AdminWrapper";
import { NotFound } from "pages/NotFound";

export const useRoutes = () => {
  const publicRoutes = [
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/produse",
      element: <Products />,
    },
    {
      path: "/produse/:id",
      element: <ProductDetails />,
    },
    {
      path: "/despre",
      element: <About />,
    },
    {
      path: "/contacte",
      element: <Contacts />,
    },
    {
      path: "/catalog",
      element: <Catalog />,
    },
  ];

  const authRoutes = [
    {
      path: "/management",
      element: <ManagementHome />,
    },
    {
      path: "/management/categories",
      element: <AdminWrapper />,
    },
    {
      path: "/management/products",
      element: <AdminWrapper />,
    },
    {
      path: "/management/orders",
      element: <AdminWrapper />,
    },
  ];

  return (
    <>
      <Routes>
        <Route path="*" element={<NotFound />} />
        {publicRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
        {authRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Routes>
    </>
  );
};
