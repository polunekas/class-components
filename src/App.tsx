import React, { Component, type ReactNode } from 'react';
import styles from './App.module.css';
import SearchBar from './components/SearchBar/SearchBar';
import SearchResults from './components/SearchResults/SearchResults';
import Loader from './components/Loader/Loader';
import pikachuGif from './assets/pikachu-pokemon.gif';
import pokemonHeader from './assets/pokemon_header.webp';

interface Pokemon {
  name: string;
  height: number;
  weight: number;
  abilities: string;
  types: string;
}

interface AppState {
  searchItem: string;
  results: Pokemon[];
  error: string | null;
  loading: boolean;
  showPopup: boolean;
  throwError: boolean;
}

class App extends Component<object, AppState> {
  constructor(props: object) {
    super(props);
    this.state = {
      searchItem: '',
      results: [],
      error: null,
      loading: false,
      showPopup: false,
      throwError: false,
    };
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
    this.setState({ searchItem, error: null, loading: true });

    try {
      let results: Pokemon[] = [];
      if (searchItem) {
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${searchItem.toLowerCase()}`
        );

        if (!response.ok) {
          throw new Error(`Error fetching data`);
        }

        const data = await response.json();
        results = [
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
        const response = await fetch(
          'https://pokeapi.co/api/v2/pokemon?offset=0&limit=20'
        );

        if (!response.ok) {
          throw new Error(`Error fetching data: ${response.statusText}`);
        }

        const data = await response.json();
        const pokemonDetailsPromises = data.results.map(
          (pokemon: { name: string; url: string }) =>
            fetch(pokemon.url).then((response) => response.json())
        );

        const detailedData = await Promise.all(pokemonDetailsPromises);

        results = detailedData.map((data) => ({
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

      this.setState({ results, loading: false }, () => {
        if (searchItem) {
          const foundIndex = results.findIndex(
            (pokemon) => pokemon.name === searchItem.toLowerCase()
          );
          if (foundIndex !== -1) {
            const container = document.querySelector(
              `.${styles.resultsContainer}`
            );
            if (container) {
              container.scrollTo({
                top: foundIndex * 100,
                behavior: 'smooth',
              });
            }
          }
        }
      });
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        this.setState({ error: error.message, loading: false });
      } else {
        this.setState({ error: 'An unknown error occurred', loading: false });
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

  handleKeyPressClose = (event: React.KeyboardEvent) => {
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
              onClick={this.togglePopup}
              onKeyPress={this.handleKeyPress}
              tabIndex={0}
              role="button"
              aria-label="Close popup"
            ></div>
            <div className={`${styles.popup} ${styles.fadeIn}`}>
              <h2>How to use the search</h2>
              <p>
                Type the name of a Pokémon and click Search or press Enter.
              </p>
              <p>Example: pikachu</p>
              <button
                className={styles.closeButton}
                onClick={this.togglePopup}
                onKeyPress={this.handleKeyPressClose}
                tabIndex={0}
              >
                Close
              </button>
            </div>
          </>
        )}
        <SearchBar fromSearch={this.handleSearch} />
        {this.state.loading ? (
          <Loader />
        ) : this.state.error ? (
          <p>{this.state.error}</p>
        ) : (
          <SearchResults results={this.state.results} />
        )}
        <img src={pikachuGif} alt="Pikachu" className={styles.fixedGif} />
      </div>
    );
  }
}

export default App;
