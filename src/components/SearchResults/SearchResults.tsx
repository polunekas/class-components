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

const SearchResults: React.FC<SearchResultsProps> = ({ pokemons, onCardClick, searchItem }) => {
	const handleKeyPress = (event: React.KeyboardEvent, pokemon: Pokemon) => {
		if (event.key === "Enter" || event.key === " ") {
			onCardClick(pokemon);
		}
	};

	if (searchItem) {
		return (
			<div className={styles.resultsContainer}>
				{pokemons.length > 0 ? (
					<div
						key={pokemons[0].name}
						className={styles.resultItem}
						onClick={() => onCardClick(pokemons[0])}
						onKeyDown={(event) => handleKeyPress(event, pokemons[0])}
						role="button"
						tabIndex={0}
						aria-label={`Show details for ${pokemons[0].name}`}
					>
						<h3>{pokemons[0].name[0].toUpperCase() + pokemons[0].name.slice(1)}</h3>
						<p>Height: {pokemons[0].height}</p>
						<p>Weight: {pokemons[0].weight}</p>
						<p>Abilities: {pokemons[0].abilities}</p>
						<p>Types: {pokemons[0].types}</p>
					</div>
				) : (
					<p>No pokemons found</p>
				)}
			</div>
		);
	}

	return (
		<div className={styles.resultsContainer}>
			{pokemons.length > 0 ? (
				pokemons.map((result, index) => (
					<div
						key={index}
						className={styles.resultItem}
						onClick={() => onCardClick(result)}
						onKeyDown={(event) => handleKeyPress(event, result)}
						role="button"
						tabIndex={0}
						aria-label={`Show details for ${result.name}`}
					>
						<h3>{result.name[0].toUpperCase() + result.name.slice(1)}</h3>
						<p>Height: {result.height}</p>
						<p>Weight: {result.weight}</p>
						<p>Abilities: {result.abilities}</p>
						<p>Types: {result.types}</p>
					</div>
				))
			) : (
				<p>No pokemons found</p>
			)}
		</div>
	);
};

export default SearchResults;
