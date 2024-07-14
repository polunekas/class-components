import { jsx as _jsx } from "react/jsx-runtime";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./AppRouter";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
ReactDOM.createRoot(document.getElementById("root")).render(_jsx(React.StrictMode, { children: _jsx(ErrorBoundary, { children: _jsx(BrowserRouter, { children: _jsx(AppRouter, {}) }) }) }));
