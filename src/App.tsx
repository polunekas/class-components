import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import styles from "./App.module.css";
import SearchBar from "./components/SearchBar/SearchBar";
import SearchResults from "./components/SearchResults/SearchResults";
import Loader from "./components/Loader/Loader";
import Pagination from "./components/Pagination/Pagination";
import pikachuGif from "./assets/pikachu-pokemon.gif";
import pokemonHeader from "./assets/pokemon_header.webp";
import { fetchPokemonData, fetchPokemonsList } from "./api";

const App: React.FC = () => {
	const [searchItem] = useState<string>(() => localStorage.getItem("searchItem") || "");
	const [pokemons, setPokemons] = useState<Pokemon[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [throwError, setThrowError] = useState<boolean>(false);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [totalPages, setTotalPages] = useState<number>(0);
	const [setSelectedPokemon] = useState<Pokemon | null>(null);
	const [setIsDetailsLoading] = useState<boolean>(false);
	const resultsContainerRef = useRef<HTMLDivElement>(null);
	const location = useLocation();
	const navigate = useNavigate();

	const handleSearch = useCallback(
		async (searchItem: string, page = 1) => {
			setError(null);
			setIsLoading(true);
			console.log(`handleSearch called with searchItem: "${searchItem}", page: ${page}`);

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
									.map((ability: { ability: { name: string } }) => ability.ability.name)
									.join(", ")
								: "Not Found",
							types: data.types
								? data.types
									.map((type: { type: { name: string } }) => type.type.name)
									.join(", ")
								: "Not Found",
						},
					];
					console.log("Pokemons fetched by searchItem:", pokemons);
				} else {
					const offset = (page - 1) * 20;
					const { results, count } = await fetchPokemonsList(offset);
					setTotalPages(Math.ceil(count / 20));
					console.log("Total Pokemons count:", count);

					const pokemonDetailsPromises = results.map(async (pokemon, index) => {
						await new Promise((resolve) => setTimeout(resolve, index * 100));
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
								.map((ability: { ability: { name: string } }) => ability.ability.name)
								.join(", ")
							: "Not Found",
						types: data.types
							? data.types
								.map((type: { type: { name: string } }) => type.type.name)
								.join(", ")
							: "Not Found",
					}));
					console.log("Pokemons fetched by page:", pokemons);
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
						console.log(`Scrolled to pokemon: ${searchItem} at index ${foundIndex}`);
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

	const handleCardClick = useCallback(async (pokemon: Pokemon) => {
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
			localStorage.setItem("searchItem", data.name);
		} catch (error) {
			console.error(error);
			setError("Failed to fetch details");
		} finally {
			setIsDetailsLoading(false);
		}
	}, [currentPage, navigate, setIsDetailsLoading, setSelectedPokemon]);

	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const page = parseInt(params.get("page") || "1", 10);
		const details = params.get("details");

		console.log("useEffect triggered");
		console.log("Current page:", page);
		console.log("Current details:", details);
		console.log("Current searchItem:", searchItem);

		if (page !== currentPage) {
			console.log(`Updating URL to match currentPage: ${currentPage}`);
			navigate(`/?page=${currentPage}`, { replace: true });
		}

		if (details) {
			handleCardClick({ name: details, height: 0, weight: 0, abilities: "", types: "" });
		} else {
			console.log("Handling search with empty searchItem");
			handleSearch("", page);
		}
	}, [currentPage, navigate, location.search, handleCardClick, handleSearch, searchItem]);


	const triggerError = () => {
		setThrowError(true);
	};

	const handlePageChange = (page: number) => {
		console.log(`handlePageChange called with page: ${page}, currentPage: ${currentPage}`);
		if (page !== currentPage) {
			setCurrentPage(page);
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
				<button className={styles.errorButton} onClick={triggerError}>
					Throw Error
				</button>
			</header>
			<SearchBar fromSearch={(searchItem) => {
				setCurrentPage(1);
				handleSearch(searchItem, 1);
			}} />
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
					<Outlet />
				</div>
			)}
			<img src={pikachuGif} alt="Pikachu" className={styles.fixedGif} />
		</div>
	);
};

export default App;
