import React, { Component, type ReactNode, createRef } from 'react';
import styles from './App.module.css';
import SearchBar from './components/SearchBar/SearchBar';
import SearchResults from './components/SearchResults/SearchResults';
import Loader from './components/Loader/Loader';
import pikachuGif from './assets/pikachu-pokemon.gif';
import pokemonHeader from './assets/pokemon_header.webp';
import { fetchPokemonData, fetchPokemonsList } from './api';
import type { PokemonCard } from './api';

interface Pokemon {
  name: string;
  height: number;
  weight: number;
  abilities: string;
  types: string;
}

interface AppState {
  searchItem: string;
  pokemons: Pokemon[];
  error: string | null;
  isLoading: boolean;
  showPopup: boolean;
  throwError: boolean;
}

class App extends Component<object, AppState> {
  resultsContainerRef: React.RefObject<HTMLDivElement>;

  constructor(props: object) {
    super(props);
    this.state = {
      searchItem: '',
      pokemons: [],
      error: null,
      isLoading: false,
      showPopup: false,
      throwError: false,
    };
    this.resultsContainerRef = createRef();
  }

  componentDidMount() {
    const savedSearchItem = localStorage.getItem('searchItem');
    if (savedSearchItem) {
      this.handleSearch(savedSearchItem);
    } else {
      this.handleSearch('');
    }
  }

  handleSearch = async (searchItem: string) => {
    this.setState({ searchItem, error: null, isLoading: true });

    try {
      let pokemons: Pokemon[] = [];
      if (searchItem) {
        const data = await fetchPokemonData(searchItem);
        pokemons = [
          {
            name: data.name || 'Not Found',
            height: data.height || 'Not Found',
            weight: data.weight || 'Not Found',
            abilities: data.abilities
              ? data.abilities
                  .map(
                    (ability: { ability: { name: string } }) =>
                      ability.ability.name
                  )
                  .join(', ')
              : 'Not Found',
            types: data.types
              ? data.types
                  .map((type: { type: { name: string } }) => type.type.name)
                  .join(', ')
              : 'Not Found',
          },
        ];
      } else {
        const pokemonCards: PokemonCard[] = await fetchPokemonsList();
        const pokemonDetailsPromises = pokemonCards.map((pokemon) =>
          fetch(pokemon.url).then((response) => response.json())
        );

        const detailedData = await Promise.all(pokemonDetailsPromises);

        pokemons = detailedData.map((data) => ({
          name: data.name || 'Not Found',
          height: data.height || 'Not Found',
          weight: data.weight || 'Not Found',
          abilities: data.abilities
            ? data.abilities
                .map(
                  (ability: { ability: { name: string } }) =>
                    ability.ability.name
                )
                .join(', ')
            : 'Not Found',
          types: data.types
            ? data.types
                .map((type: { type: { name: string } }) => type.type.name)
                .join(', ')
            : 'Not Found',
        }));
      }

      this.setState({ pokemons, isLoading: false }, () => {
        if (searchItem) {
          const foundIndex = pokemons.findIndex(
            (pokemon) => pokemon.name === searchItem.toLowerCase()
          );
          if (foundIndex !== -1 && this.resultsContainerRef.current) {
            this.resultsContainerRef.current.scrollTo({
              top: foundIndex * 100,
              behavior: 'smooth',
            });
          }
        }
      });
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        this.setState({ error: error.message, isLoading: false });
      } else {
        this.setState({ error: 'An unknown error occurred', isLoading: false });
      }
    }
  };

  togglePopup = () => {
    this.setState((prevState) => ({ showPopup: !prevState.showPopup }));
  };

  triggerError = () => {
    this.setState({ throwError: true });
  };

  handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      this.togglePopup();
    }
  };

  render(): ReactNode {
    if (this.state.throwError) {
      throw new Error('Test error thrown');
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
            onClick={this.togglePopup}
          >
            How to use
          </button>
          <button className={styles.errorButton} onClick={this.triggerError}>
            Throw Error
          </button>
        </header>
        {this.state.showPopup && (
          <>
            <div
              className={styles.overlay}
              role="button"
              tabIndex={0}
              onClick={this.togglePopup}
              onKeyDown={this.handleKeyPress}
              aria-label="Close popup"
            ></div>
            <dialog open className={`${styles.popup} ${styles.fadeIn}`}>
              <h2>How to use the search</h2>
              <p>Type the name of a Pokémon and click Search or press Enter.</p>
              <p>Example: pikachu</p>
              <button className={styles.closeButton} onClick={this.togglePopup}>
                Close
              </button>
            </dialog>
          </>
        )}
        <SearchBar fromSearch={this.handleSearch} />
        {this.state.isLoading ? (
          <Loader />
        ) : this.state.error ? (
          <p>{this.state.error}</p>
        ) : (
          <div
            ref={this.resultsContainerRef}
            className={styles.resultsContainer}
          >
            <SearchResults pokemons={this.state.pokemons} />
          </div>
        )}
        <img src={pikachuGif} alt="Pikachu" className={styles.fixedGif} />
      </div>
    );
  }
}

export default App;
