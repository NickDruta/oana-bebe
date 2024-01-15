import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "app/App";
import "./index.css";

import 'shared/providers/translation/translation'

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
    <App />
);
