import React from "react";
import { Routes, Route } from "react-router-dom";
import App from "./App";
import NotFound from "./components/NotFound/NotFound";

const AppRouter: React.FC = () => (
  <Routes>
    <Route path="/" element={<App />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRouter;
