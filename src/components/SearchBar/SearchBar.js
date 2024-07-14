import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import useSearchItem from '../../hooks/useSearchItem';
import styles from './SearchBar.module.css';
const SearchBar = ({ fromSearch }) => {
    const [searchItem, setSearchItem] = useSearchItem();
    const [inputValue, setInputValue] = useState(searchItem);
    const [placeholder, setPlaceholder] = useState(searchItem ? '' : 'pikachu');
    const handleInputChange = (event) => {
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
    const handleFormSubmit = (event) => {
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
    return (_jsxs("form", { onSubmit: handleFormSubmit, className: styles.searchBarContainer, children: [_jsx("input", { type: "text", value: inputValue, onChange: handleInputChange, placeholder: placeholder, onFocus: handleFocus, className: styles.input }), _jsx("button", { type: "submit", className: styles.button, children: "Search" })] }));
};
export default SearchBar;
