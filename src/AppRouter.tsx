import React from "react";
import { Routes, Route } from "react-router-dom";
import App from "./App";
import NotFound from "./components/NotFound/NotFound";
import DetailedCard from "./components/DetailedCard/DetailedCard";
import { type Pokemon } from "./models/Pokemon";

const AppRouter: React.FC = () => (
	<Routes>
		<Route path="/" element={<App />} />
		<Route
			path="/details/:pokemonName"
			element={<DetailedCard pokemon={null as unknown as Pokemon} onClose={() => { }} />}
		/>
		<Route path="*" element={<NotFound />} />
	</Routes>
);

export default AppRouter;
