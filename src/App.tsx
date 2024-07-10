import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./App.module.css";
import SearchBar from "./components/SearchBar/SearchBar";
import SearchResults from "./components/SearchResults/SearchResults";
import Loader from "./components/Loader/Loader";
import Pagination from "./components/Pagination/Pagination";
import pikachuGif from "./assets/pikachu-pokemon.gif";
import pokemonHeader from "./assets/pokemon_header.webp";
import { fetchPokemonData, fetchPokemonsList } from "./api";
import type { PokemonCard } from "./api";

interface Pokemon {
	name: string;
	height: number;
	weight: number;
	abilities: string;
	types: string;
}

const App: React.FC = () => {
	const [searchItem, setSearchItem] = useState<string>("");
	const [pokemons, setPokemons] = useState<Pokemon[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [showPopup, setShowPopup] = useState<boolean>(false);
	const [throwError, setThrowError] = useState<boolean>(false);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const resultsContainerRef = useRef<HTMLDivElement>(null);
	const location = useLocation();
	const navigate = useNavigate();

	useEffect(() => {
		const savedSearchItem = localStorage.getItem("searchItem");
		if (savedSearchItem) {
			handleSearch(savedSearchItem);
		} else {
			handleSearch("");
		}
	}, []);

	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const page = parseInt(params.get("page") || "1", 10);
		setCurrentPage(page);
	}, [location.search]);

	const handleSearch = async (searchItem: string) => {
		setSearchItem(searchItem);
		setError(null);
		setIsLoading(true);

		try {
			let pokemons: Pokemon[] = [];
			if (searchItem) {
				const data = await fetchPokemonData(searchItem);
				pokemons = [
					{
						name: data.name || "Not Found",
						height: data.height || "Not Found",
						weight: data.weight || "Not Found",
						abilities: data.abilities
							? data.abilities
								.map(
									(ability: { ability: { name: string } }) =>
										ability.ability.name,
								)
								.join(", ")
							: "Not Found",
						types: data.types
							? data.types
								.map((type: { type: { name: string } }) => type.type.name)
								.join(", ")
							: "Not Found",
					},
				];
			} else {
				const offset = (currentPage - 1) * 20;
				const pokemonCards: PokemonCard[] = await fetchPokemonsList(offset);
				const pokemonDetailsPromises = pokemonCards.map((pokemon) =>
					fetch(pokemon.url).then((response) => response.json()),
				);

				const detailedData = await Promise.all(pokemonDetailsPromises);

				pokemons = detailedData.map((data) => ({
					name: data.name || "Not Found",
					height: data.height || "Not Found",
					weight: data.weight || "Not Found",
					abilities: data.abilities
						? data.abilities
							.map(
								(ability: { ability: { name: string } }) =>
									ability.ability.name,
							)
							.join(", ")
						: "Not Found",
					types: data.types
						? data.types
							.map((type: { type: { name: string } }) => type.type.name)
							.join(", ")
						: "Not Found",
				}));
			}

			setPokemons(pokemons);
			setIsLoading(false);

			if (searchItem) {
				const foundIndex = pokemons.findIndex(
					(pokemon) => pokemon.name === searchItem.toLowerCase(),
				);
				if (foundIndex !== -1 && resultsContainerRef.current) {
					resultsContainerRef.current.scrollTo({
						top: foundIndex * 100,
						behavior: "smooth",
					});
				}
			}
		} catch (error) {
			console.error(error);
			if (error instanceof Error) {
				setError(error.message);
			} else {
				setError("An unknown error occurred");
			}
			setIsLoading(false);
		}
	};

	const togglePopup = () => {
		setShowPopup((prev) => !prev);
	};

	const triggerError = () => {
		setThrowError(true);
	};

	const handleKeyPress = (event: React.KeyboardEvent) => {
		if (event.key === "Enter" || event.key === " ") {
			togglePopup();
		}
	};

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	if (throwError) {
		throw new Error("Test error thrown");
	}

	return (
		<div id="root" className={styles.root}>
			<header className={styles.header}>
				<img
					src={pokemonHeader}
					alt="Pokemon"
					className={styles.headerLogo}
				/>
				<button
					className={styles.descriptionButton}
					onClick={togglePopup}
				>
					How to use
				</button>
				<button className={styles.errorButton} onClick={triggerError}>
					Throw Error
				</button>
			</header>
			{showPopup && (
				<>
					<div
						className={styles.overlay}
						role="button"
						tabIndex={0}
						onClick={togglePopup}
						onKeyDown={handleKeyPress}
						aria-label="Close popup"
					></div>
					<dialog open className={`${styles.popup} ${styles.fadeIn}`}>
						<h2>How to use the search</h2>
						<p>Type the name of a Pokémon and click Search or press Enter.</p>
						<p>Example: pikachu</p>
						<button className={styles.closeButton} onClick={togglePopup}>
							Close
						</button>
					</dialog>
				</>
			)}
			<SearchBar fromSearch={handleSearch} />
			{isLoading ? (
				<Loader />
			) : error ? (
				<p>{error}</p>
			) : (
				<div
					ref={resultsContainerRef}
					className={styles.resultsContainer}
				>
					<SearchResults pokemons={pokemons} />
					<Pagination
						currentPage={currentPage}
						totalPages={Math.ceil(pokemons.length / 20)}
						onPageChange={handlePageChange}
					/>
				</div>
			)}
			<img src={pikachuGif} alt="Pikachu" className={styles.fixedGif} />
		</div>
	);
};

export default App;
