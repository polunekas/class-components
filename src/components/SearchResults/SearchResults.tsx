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
  results: Pokemon[];
}

const SearchResults: React.FC<SearchResultsProps> = ({ results }) => {
  return (
    <div className={styles.resultsContainer}>
      {results.length > 0 ? (
        results.map((result, index) => (
          <div key={index} className={styles.resultItem}>
            <h3>{result.name[0].toUpperCase() + result.name.slice(1)}</h3>
            <p>Height: {result.height}</p>
            <p>Weight: {result.weight}</p>
            <p>Abilities: {result.abilities}</p>
            <p>Types: {result.types}</p>
          </div>
        ))
      ) : (
        <p>No results found</p>
      )}
    </div>
  );
};

export default SearchResults;
