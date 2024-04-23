import React from "react";
import { ToastContainer } from "react-toastify";
import { BrowserRouter as Router } from "react-router-dom";
import { StoreProvider } from "app/providers/StoreProvider";
import { useRoutes } from "shared/hooks";
import cls from "./App.module.scss";

import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const routes = useRoutes();

  return (
    <Router>
      <StoreProvider>
        <div className={cls.appWrapper} id="app-wrapper">
          {routes}
        </div>
        <ToastContainer style={{ zIndex: 9999 }} />
      </StoreProvider>
    </Router>
  );
};

export default App;
