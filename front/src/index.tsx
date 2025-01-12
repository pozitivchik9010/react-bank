import React from "react";
import ReactDOM from "react-dom/client";

import "./normalize.css";
import "./index.css";

import App from "./App";
import { loadSession } from "./util/sesion";

loadSession()
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
	<App />
);
