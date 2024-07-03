import React, { Component, ChangeEvent } from 'react';

interface SearchBarProps {
  fromSearch?: (searchItem: string) => void;
}

interface SearchBarState {
  searchItem: string;
}

class SearchBar extends Component<SearchBarProps, SearchBarState> {
  constructor(props: SearchBarProps) {
    super(props);
    const savedsearchItem = localStorage.getItem('searchItem') || '';
    this.state = {
      searchItem: savedsearchItem,
    };
  }

  handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({ searchItem: event.target.value });
  };

  handleSearch = () => {
    const trimmedsearchItem = this.state.searchItem.trim();
    localStorage.setItem('searchItem', trimmedsearchItem);

    if (this.props.fromSearch) {
      this.props.fromSearch(trimmedsearchItem);
    }
  };

  render() {
    return (
      <div>
        <input
          type="text"
          value={this.state.searchItem}
          onChange={this.handleInputChange}
        />
        <button onClick={this.handleSearch}>Search</button>
      </div>
    );
  }
}

export default SearchBar;
