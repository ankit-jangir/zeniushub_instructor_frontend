import { StrictMode } from "react";
import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ThemeProvider } from "./instructor/common/header/ThemeContext";
import { Provider } from "react-redux";
import { store } from "./instructor/Redux/Store";

createRoot(document.getElementById("root")).render(
  <ThemeProvider>
    <Provider store={store}>
      <App />
    </Provider>
  </ThemeProvider>
);
