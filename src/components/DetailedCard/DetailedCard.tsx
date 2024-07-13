import React from 'react';
import styles from './DetailedCard.module.css';

interface Pokemon {
	name: string;
	height: number;
	weight: number;
	abilities: string;
	types: string;
}

interface DetailedCardProps {
	pokemon: Pokemon | null;
	onClose: () => void;
}

const DetailedCard: React.FC<DetailedCardProps> = ({ pokemon, onClose }) => {
	if (!pokemon) return null;

	return (
		<div className={styles.detailedCard}>
			<h2>{pokemon.name[0].toUpperCase() + pokemon.name.slice(1)}</h2>
			<p>Height: {pokemon.height}</p>
			<p>Weight: {pokemon.weight}</p>
			<p>Abilities: {pokemon.abilities}</p>
			<p>Types: {pokemon.types}</p>
			<button onClick={onClose} className={styles.closeButton}>Close</button>
		</div>
	);
};

export default DetailedCard;
