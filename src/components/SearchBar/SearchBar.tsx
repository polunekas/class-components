import React, { ChangeEvent, FormEvent, useState } from "react";
import useSearchItem from "../../hooks/useSearchItem";
import styles from "./SearchBar.module.css";

interface SearchBarProps {
	fromSearch?: (searchItem: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ fromSearch }) => {
	const [searchItem, setSearchItem] = useSearchItem();
	const [placeholder, setPlaceholder] = useState(searchItem ? "" : "pikachu");
	const [showAlert, setShowAlert] = useState(false);

	const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
		setSearchItem(event.target.value);
	};

	const handleSearch = () => {
		const trimmedSearchItem = searchItem.trim();

		if (fromSearch) {
			fromSearch(trimmedSearchItem);
		}
	};

	const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		handleSearch();
	};

	const handleFocus = () => {
		setPlaceholder("");
	};

	const closeAlert = () => {
		setShowAlert(false);
	};

	return (
		<form
			onSubmit={handleFormSubmit}
			className={styles.searchBarContainer}
		>
			<input
				type="text"
				value={searchItem}
				onChange={handleInputChange}
				placeholder={placeholder}
				onFocus={handleFocus}
				className={styles.input}
			/>
			<button type="submit" className={styles.button}>
				Search
			</button>
			{showAlert && (
				<div className={styles.alert}>
					<p>Please enter a search term.</p>
					<button
						onClick={closeAlert}
						className={styles.closeAlertButton}
					>
						Close
					</button>
				</div>
			)}
		</form>
	);
};

export default SearchBar;
