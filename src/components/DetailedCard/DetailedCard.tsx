import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./DetailedCard.module.css";
import { fetchPokemonData } from "../../api";
import Loader from "../Loader/Loader";

interface Pokemon {
	name: string;
	height: number;
	weight: number;
	abilities: string;
	types: string;
}

const DetailedCard: React.FC = () => {
	const { pokemonName } = useParams();
	const [pokemon, setPokemon] = useState<Pokemon | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const getPokemonData = async () => {
			setIsLoading(true);
			try {
				if (pokemonName) {
					const data = await fetchPokemonData(pokemonName);
					setPokemon({
						name: data.name,
						height: data.height,
						weight: data.weight,
						abilities: data.abilities
							.map((ability: { ability: { name: string } }) => ability.ability.name)
							.join(", "),
						types: data.types
							.map((type: { type: { name: string } }) => type.type.name)
							.join(", "),
					});
				}
			} catch (error) {
				console.error(error);
				setError("Failed to fetch details");
			} finally {
				setIsLoading(false);
			}
		};

		getPokemonData();
	}, [pokemonName]);

	if (isLoading) {
		return <Loader />;
	}

	if (error) {
		return <p>{error}</p>;
	}

	if (!pokemon) {
		return null;
	}

	return (
		<div className={styles.detailedCard}>
			<h2>{pokemon.name[0].toUpperCase() + pokemon.name.slice(1)}</h2>
			<p>Height: {pokemon.height}</p>
			<p>Weight: {pokemon.weight}</p>
			<p>Abilities: {pokemon.abilities}</p>
			<p>Types: {pokemon.types}</p>
		</div>
	);
};

export default DetailedCard;
