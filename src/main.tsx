import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./AppRouter";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<ErrorBoundary>
			<BrowserRouter>
				<AppRouter />
			</BrowserRouter>
		</ErrorBoundary>
	</React.StrictMode>
);
