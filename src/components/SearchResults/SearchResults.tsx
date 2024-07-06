import React from 'react';
import styles from './SearchResults.module.css';

interface Pokemon {
  name: string;
  height: number;
  weight: number;
  abilities: string;
  types: string;
}

interface SearchResultsProps {
  pokemons: Pokemon[];
}

const SearchResults: React.FC<SearchResultsProps> = ({ pokemons }) => {
  return (
    <div className={styles.resultsContainer}>
      {pokemons.length > 0 ? (
        pokemons.map((result, index) => (
          <div key={index} className={styles.resultItem}>
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
