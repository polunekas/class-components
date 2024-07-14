import { jsx as _jsx } from "react/jsx-runtime";
import styles from "./SearchResults.module.css";
const SearchResults = ({ pokemons, onCardClick }) => {
    const handleKeyPress = (event, pokemon) => {
        if (event.key === "Enter" || event.key === " ") {
            onCardClick(pokemon);
        }
    };
    return (_jsx("div", { className: styles.resultsContainer, children: pokemons.length > 0 ? (pokemons.map((pokemon, index) => (_jsx("div", { className: styles.resultItem, onClick: () => onCardClick(pokemon), onKeyDown: (event) => handleKeyPress(event, pokemon), role: "button", tabIndex: 0, "aria-label": `Show details for ${pokemon.name}`, children: _jsx("h3", { children: pokemon.name[0].toUpperCase() + pokemon.name.slice(1) }) }, index)))) : (_jsx("p", { children: "No pokemons found" })) }));
};
export default SearchResults;
