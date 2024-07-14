import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Routes, Route } from "react-router-dom";
import App from "./App";
import NotFound from "./components/NotFound/NotFound";
import DetailedCard from "./components/DetailedCard/DetailedCard";
const AppRouter = () => (_jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(App, {}) }), _jsx(Route, { path: "/details/:pokemonName", element: _jsx(DetailedCard, { pokemon: null, onClose: () => { } }) }), _jsx(Route, { path: "*", element: _jsx(NotFound, {}) })] }));
export default AppRouter;
