import React, { Component, ReactNode } from 'react';
import './App.css';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import SearchBar from './components/SearchBar/SearchBar';
import SearchResults from './components/SearchResults/SearchResults';
import pikachuGif from './assets/pikachu-pokemon.gif';
import pokemonHeader from './assets/pokemon_header.png';

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
  showPopup: boolean;
}

class App extends Component<object, AppState> {
  constructor(props: object) {
    super(props);
    this.state = {
      searchItem: '',
      results: [],
      error: null,
      showPopup: false,
    };
  }

  handleSearch = async (searchItem: string) => {
    this.setState({ searchItem, error: null });

    try {
      let response;
      if (searchItem) {
        response = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${searchItem.toLowerCase()}`
        );
      } else {
        response = await fetch(
          'https://pokeapi.co/api/v2/pokemon?offset=0&limit=20'
        );
      }

      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`);
      }

      const data = await response.json();
      const results = searchItem
        ? [
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
          ]
        : data.results.map((pokemon: { name: string; url: string }) => ({
            name: pokemon.name,
            height: 'Not Found',
            weight: 'Not Found',
            abilities: 'Not Found',
            types: 'Not Found',
          }));

      this.setState({ results });
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        this.setState({ error: error.message });
      } else {
        this.setState({ error: 'An unknown error occurred' });
      }
    }
  };

  togglePopup = () => {
    this.setState((prevState) => ({ showPopup: !prevState.showPopup }));
  };

  render(): ReactNode {
    return (
      <ErrorBoundary>
        <div id="root">
          <header>
            <img src={pokemonHeader} alt="Pokemon" className="header-logo" />
            <button className="description-button" onClick={this.togglePopup}>
              How to use
            </button>
          </header>
          {this.state.showPopup && (
            <>
              <div className="overlay" onClick={this.togglePopup}></div>
              <div className="popup fadeIn">
                <h2>How to use the search</h2>
                <p>
                  Type the name of a Pokémon and click "Search" or press Enter.
                </p>
                <p>Example: pikachu</p>
                <button className="close-button" onClick={this.togglePopup}>
                  Close
                </button>
              </div>
            </>
          )}
          <SearchBar fromSearch={this.handleSearch} />
          {this.state.error ? (
            <p>{this.state.error}</p>
          ) : (
            <SearchResults results={this.state.results} />
          )}
          <img src={pikachuGif} alt="Pikachu" className="fixed-gif" />
        </div>
      </ErrorBoundary>
    );
  }
}

export default App;
