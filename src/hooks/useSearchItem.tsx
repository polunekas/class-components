import { useState, useEffect } from "react";

const useSearchItem = () => {
	const [searchItem, setSearchItem] = useState<string>(() => {
		return localStorage.getItem("searchItem") || "";
	});

	useEffect(() => {
		return () => {
			localStorage.setItem("searchItem", searchItem);
		};
	}, [searchItem]);

	return [searchItem, setSearchItem] as const;
};

export default useSearchItem;
