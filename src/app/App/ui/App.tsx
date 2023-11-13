import React, { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { StoreProvider } from "app/providers/StoreProvider";
import { Header } from "features/Header";
import { MobileHeader } from "features/MobileHeader";
import { Footer } from "features/Footer";
import { StickyInfo } from "entities/StickyInfo";
import { useRoutes } from "shared/hooks";
import cls from "./App.module.scss";

const App = () => {
  const routes = useRoutes();

  return (
    <Router>
      <StoreProvider>
        <div className={cls.appWrapper}>
          {routes}
        </div>
      </StoreProvider>
    </Router>
  );
};

export default App;
