import React from "react";
import styles from "./DetailedCard.module.css";

interface Pokemon {
  name: string;
  height: number;
  weight: number;
  abilities: string;
  types: string;
}

interface DetailedCardProps {
  pokemon: Pokemon;
}

const DetailedCard: React.FC<DetailedCardProps> = ({ pokemon }) => {
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
