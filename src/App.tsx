import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./App.module.css";
import SearchBar from "./components/SearchBar/SearchBar";
import SearchResults from "./components/SearchResults/SearchResults";
import Loader from "./components/Loader/Loader";
import Pagination from "./components/Pagination/Pagination";
import DetailedCard from "./components/DetailedCard/DetailedCard";
import pikachuGif from "./assets/pikachu-pokemon.gif";
import pokemonHeader from "./assets/pokemon_header.webp";
import { fetchPokemonData, fetchPokemonsList } from "./api";

const useSearchItem = () => {
	const [searchItem] = useState<string>(() => {
		return localStorage.getItem("searchItem") || "";
	});

	useEffect(() => {
		return () => {
			localStorage.setItem("searchItem", searchItem);
		};
	}, [searchItem]);

	return [searchItem] as const;
};

const App: React.FC = () => {
	const [searchItem] = useSearchItem();
	const [pokemons, setPokemons] = useState<Pokemon[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [showPopup, setShowPopup] = useState<boolean>(false);
	const [throwError, setThrowError] = useState<boolean>(false);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [totalPages, setTotalPages] = useState<number>(0);
	const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
	const [isDetailsLoading, setIsDetailsLoading] = useState<boolean>(false);
	const resultsContainerRef = useRef<HTMLDivElement>(null);
	const location = useLocation();
	const navigate = useNavigate();

	const handleSearch = useCallback(
		async (searchItem: string, page = 1) => {
			setError(null);
			setIsLoading(true);
			console.log(`handleSearch called with searchItem: ${searchItem}, page: ${page}`);

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
										(ability: { ability: { name: string } }) => ability.ability.name
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
					const offset = (page - 1) * 20;
					const { results, count } = await fetchPokemonsList(offset);
					setTotalPages(Math.ceil(count / 20));
					const pokemonDetailsPromises = results.map(async (pokemon, index) => {
						await new Promise((resolve) => setTimeout(resolve, index * 100)); // Задержка между запросами
						const response = await fetch(pokemon.url);
						if (!response.ok) {
							throw new Error(`Failed to fetch details for ${pokemon.name}`);
						}
						return response.json();
					});

					const detailedData = await Promise.all(pokemonDetailsPromises);

					pokemons = detailedData.map((data) => ({
						name: data.name || "Not Found",
						height: data.height || "Not Found",
						weight: data.weight || "Not Found",
						abilities: data.abilities
							? data.abilities
								.map(
									(ability: { ability: { name: string } }) => ability.ability.name
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
						(pokemon) => pokemon.name === searchItem.toLowerCase()
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
		},
		[]
	);

	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const page = parseInt(params.get("page") || "1", 10);
		if (page !== currentPage) {
			console.log(`Updating URL to match currentPage: ${currentPage}`);
			navigate(`/?page=${currentPage}`, { replace: true });
		}
	}, [currentPage, navigate, location.search]);

	useEffect(() => {
		console.log(`currentPage changed to: ${currentPage}`);
		handleSearch(searchItem, currentPage);
	}, [currentPage, searchItem, handleSearch]);

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
		console.log(`handlePageChange called with page: ${page}, currentPage: ${currentPage}`);
		if (page !== currentPage) {
			setCurrentPage(page);
		}
	};

	const handleCardClick = async (pokemon: Pokemon) => {
		setIsDetailsLoading(true);
		setSelectedPokemon(null);
		navigate(`/?page=${currentPage}&details=${pokemon.name}`);

		try {
			const data = await fetchPokemonData(pokemon.name);
			setSelectedPokemon({
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
		} catch (error) {
			console.error(error);
			setError("Failed to fetch details");
		} finally {
			setIsDetailsLoading(false);
		}
	};

	const handleCloseDetails = () => {
		setSelectedPokemon(null);
		navigate(`/?page=${currentPage}`);
	};

	const handleResultsSectionKeyPress = (event: React.KeyboardEvent) => {
		if (event.key === "Enter" || event.key === " ") {
			handleCloseDetails();
		}
	};

	if (throwError) {
		throw new Error("Test error thrown");
	}

	return (
		<div id="root" className={styles.root}>
			<header className={styles.header}>
				<img src={pokemonHeader} alt="Pokemon" className={styles.headerLogo} />
				<button className={styles.descriptionButton} onClick={togglePopup}>
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
				<div className={styles.content}>
					<div
						className={styles.resultsSection}
						ref={resultsContainerRef}
						onClick={handleCloseDetails}
						onKeyDown={handleResultsSectionKeyPress}
						role="button"
						tabIndex={0}
						aria-label="Close details section"
					>
						<SearchResults pokemons={pokemons} onCardClick={handleCardClick} searchItem={searchItem} />
						<Pagination
							currentPage={currentPage}
							totalPages={totalPages}
							onPageChange={handlePageChange}
						/>
					</div>
					{selectedPokemon && (
						<div className={styles.detailsSection}>
							<button onClick={handleCloseDetails}>Close</button>
							{isDetailsLoading ? (
								<Loader />
							) : (
								<DetailedCard pokemon={selectedPokemon} />
							)}
						</div>
					)}
				</div>
			)}
			<img src={pikachuGif} alt="Pikachu" className={styles.fixedGif} />
		</div>
	);
};

export default App;
