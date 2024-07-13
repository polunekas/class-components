import React from "react";
import { Routes, Route } from "react-router-dom";
import App from "./App";
import NotFound from "./components/NotFound/NotFound";
import DetailedCard from "./components/DetailedCard/DetailedCard";

const AppRouter: React.FC = () => (
	<Routes>
		<Route path="/" element={<App />}>
			<Route path="details/:pokemonName" element={<DetailedCard />} />
		</Route>
		<Route path="*" element={<NotFound />} />
	</Routes>
);

export default AppRouter;
