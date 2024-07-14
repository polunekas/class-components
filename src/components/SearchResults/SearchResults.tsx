import React from "react";
import styles from "./SearchResults.module.css";

interface Pokemon {
	name: string;
	height: number;
	weight: number;
	abilities: string;
	types: string;
}

interface SearchResultsProps {
	pokemons: Pokemon[];
	onCardClick: (pokemon: Pokemon) => void;
	searchItem: string;
}

const SearchResults: React.FC<SearchResultsProps> = ({ pokemons, onCardClick }) => {
	const handleKeyPress = (event: React.KeyboardEvent, pokemon: Pokemon) => {
		if (event.key === "Enter" || event.key === " ") {
			onCardClick(pokemon);
		}
	};

	return (
		<div className={styles.resultsContainer}>
			{pokemons.length > 0 ? (
				pokemons.map((pokemon, index) => (
					<div
						key={index}
						className={styles.resultItem}
						onClick={() => onCardClick(pokemon)}
						onKeyDown={(event) => handleKeyPress(event, pokemon)}
						role="button"
						tabIndex={0}
						aria-label={`Show details for ${pokemon.name}`}
					>
						<h3>{pokemon.name[0].toUpperCase() + pokemon.name.slice(1)}</h3>
					</div>
				))
			) : (
				<p>No pokemons found</p>
			)}
		</div>
	);
};

export default SearchResults;
