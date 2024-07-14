import React, { type ChangeEvent, type FormEvent, useState, useEffect } from 'react';
import useSearchItem from '../../hooks/useSearchItem';
import styles from './SearchBar.module.css';

interface SearchBarProps {
	fromSearch?: (searchItem: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ fromSearch }) => {
	const [searchItem, setSearchItem] = useSearchItem();
	const [inputValue, setInputValue] = useState(searchItem);
	const [placeholder, setPlaceholder] = useState(searchItem ? '' : 'pikachu');

	const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
		setInputValue(event.target.value);
	};

	const handleSearch = () => {
		const trimmedSearchItem = inputValue.trim();
		if (fromSearch) {
			fromSearch(trimmedSearchItem);
		}
		setSearchItem(trimmedSearchItem);
		setInputValue('');
	};

	const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		handleSearch();
	};

	const handleFocus = () => {
		setPlaceholder('');
	};

	useEffect(() => {
		if (inputValue === '') {
			setSearchItem('');
		}
	}, [inputValue, setSearchItem]);

	return (
		<form onSubmit={handleFormSubmit} className={styles.searchBarContainer}>
			<input
				type="text"
				value={inputValue}
				onChange={handleInputChange}
				placeholder={placeholder}
				onFocus={handleFocus}
				className={styles.input}
			/>
			<button type="submit" className={styles.button}>
				Search
			</button>
		</form>
	);
};

export default SearchBar;
