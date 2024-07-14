var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef, useCallback } from "react";
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
const App = () => {
    const [searchItem, setSearchItem] = useState(() => localStorage.getItem("searchItem") || "");
    const [pokemons, setPokemons] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [throwError, setThrowError] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [selectedPokemon, setSelectedPokemon] = useState(null);
    const resultsContainerRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();
    const handleSearch = useCallback((searchItem_1, ...args_1) => __awaiter(void 0, [searchItem_1, ...args_1], void 0, function* (searchItem, page = 1) {
        setError(null);
        setIsLoading(true);
        console.log(`handleSearch called with searchItem: "${searchItem}", page: ${page}`);
        try {
            let pokemons = [];
            if (searchItem) {
                const data = yield fetchPokemonData(searchItem);
                pokemons = [
                    {
                        name: data.name || "Not Found",
                        height: data.height || 0,
                        weight: data.weight || 0,
                        abilities: data.abilities
                            ? data.abilities.map((ability) => ability.ability.name).join(", ")
                            : "Not Found",
                        types: data.types
                            ? data.types.map((type) => type.type.name).join(", ")
                            : "Not Found",
                    },
                ];
                console.log("Pokemons fetched by searchItem:", pokemons);
            }
            else {
                const offset = (page - 1) * 20;
                const { results, count } = yield fetchPokemonsList(offset);
                setTotalPages(Math.ceil(count / 20));
                console.log("Total Pokemons count:", count);
                const pokemonDetailsPromises = results.map((pokemon, index) => __awaiter(void 0, void 0, void 0, function* () {
                    yield new Promise((resolve) => setTimeout(resolve, index * 100));
                    const response = yield fetch(pokemon.url);
                    if (!response.ok) {
                        throw new Error(`Failed to fetch details for ${pokemon.name}`);
                    }
                    return response.json();
                }));
                const detailedData = yield Promise.all(pokemonDetailsPromises);
                pokemons = detailedData.map((data) => ({
                    name: data.name || "Not Found",
                    height: data.height || 0,
                    weight: data.weight || 0,
                    abilities: data.abilities
                        ? data.abilities.map((ability) => ability.ability.name).join(", ")
                        : "Not Found",
                    types: data.types
                        ? data.types.map((type) => type.type.name).join(", ")
                        : "Not Found",
                }));
                console.log("Pokemons fetched by page:", pokemons);
            }
            setPokemons(pokemons);
            setIsLoading(false);
            if (searchItem) {
                const foundIndex = pokemons.findIndex((pokemon) => pokemon.name === searchItem.toLowerCase());
                if (foundIndex !== -1 && resultsContainerRef.current) {
                    resultsContainerRef.current.scrollTo({
                        top: foundIndex * 100,
                        behavior: "smooth",
                    });
                    console.log(`Scrolled to pokemon: ${searchItem} at index ${foundIndex}`);
                }
            }
        }
        catch (error) {
            console.error(error);
            if (error instanceof Error) {
                setError(error.message);
            }
            else {
                setError("An unknown error occurred");
            }
            setIsLoading(false);
        }
    }), []);
    const handleCardClick = useCallback((pokemon) => __awaiter(void 0, void 0, void 0, function* () {
        setSelectedPokemon(null);
        navigate(`/?page=${currentPage}&details=${pokemon.name}`);
        try {
            const data = yield fetchPokemonData(pokemon.name);
            setSelectedPokemon({
                name: data.name,
                height: data.height,
                weight: data.weight,
                abilities: data.abilities
                    .map((ability) => ability.ability.name)
                    .join(", "),
                types: data.types.map((type) => type.type.name).join(", "),
            });
            localStorage.setItem("searchItem", data.name);
        }
        catch (error) {
            console.error(error);
            setError("Failed to fetch details");
        }
    }), [currentPage, navigate]);
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
        }
        else {
            console.log("Handling search with empty searchItem");
            handleSearch("", page);
        }
    }, [currentPage, navigate, location.search, handleCardClick, handleSearch, searchItem]);
    const triggerError = () => {
        setThrowError(true);
    };
    const handlePageChange = (page) => {
        console.log(`handlePageChange called with page: ${page}, currentPage: ${currentPage}`);
        if (page !== currentPage) {
            setCurrentPage(page);
        }
    };
    const handleCloseDetails = () => {
        setSelectedPokemon(null);
        navigate(`/?page=${currentPage}`);
    };
    const handleResultsSectionKeyPress = (event) => {
        if (event.key === "Enter" || event.key === " ") {
            handleCloseDetails();
        }
    };
    if (throwError) {
        throw new Error("Test error thrown");
    }
    return (_jsxs("div", { id: "root", className: styles.root, children: [_jsxs("header", { className: styles.header, children: [_jsx("img", { src: pokemonHeader, alt: "Pokemon", className: styles.headerLogo }), _jsx("button", { className: styles.errorButton, onClick: triggerError, children: "Throw Error" })] }), _jsx(SearchBar, { fromSearch: (searchItem) => {
                    setCurrentPage(1);
                    handleSearch(searchItem, 1);
                } }), isLoading ? (_jsx(Loader, {})) : error ? (_jsx("p", { children: error })) : (_jsxs("div", { className: styles.content, children: [_jsxs("div", { className: styles.resultsSection, ref: resultsContainerRef, onClick: handleCloseDetails, onKeyDown: handleResultsSectionKeyPress, role: "button", tabIndex: 0, "aria-label": "Close details section", children: [_jsx(SearchResults, { pokemons: pokemons, onCardClick: handleCardClick, searchItem: searchItem }), _jsx(Pagination, { currentPage: currentPage, totalPages: totalPages, onPageChange: handlePageChange })] }), selectedPokemon && (_jsx("div", { className: styles.detailsSection, children: _jsx(DetailedCard, { pokemon: selectedPokemon, onClose: handleCloseDetails }) }))] })), _jsx("img", { src: pikachuGif, alt: "Pikachu", className: styles.fixedGif })] }));
};
export default App;
