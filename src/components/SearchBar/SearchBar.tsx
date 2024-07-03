import React, { Component, ChangeEvent, KeyboardEvent } from 'react';
import './SearchBar.css';

interface SearchBarProps {
  fromSearch?: (searchItem: string) => void;
}

interface SearchBarState {
  searchItem: string;
}

class SearchBar extends Component<SearchBarProps, SearchBarState> {
  constructor(props: SearchBarProps) {
    super(props);
    const savedSearchItem = localStorage.getItem('searchItem') || '';
    this.state = {
      searchItem: savedSearchItem,
    };
  }

  handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({ searchItem: event.target.value });
  };

  handleSearch = () => {
    const trimmedSearchItem = this.state.searchItem.trim();
    localStorage.setItem('searchItem', trimmedSearchItem);

    if (this.props.fromSearch) {
      this.props.fromSearch(trimmedSearchItem);
    }
  };

  handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      this.handleSearch();
    }
  };

  render() {
    return (
      <div className="search-bar-container">
        <input
          type="text"
          value={this.state.searchItem}
          onChange={this.handleInputChange}
          onKeyPress={this.handleKeyPress}
        />
        <button onClick={this.handleSearch}>Search</button>
      </div>
    );
  }
}

export default SearchBar;
