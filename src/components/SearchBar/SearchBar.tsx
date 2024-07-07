import React, { Component, type ChangeEvent, type FormEvent } from "react";
import styles from "./SearchBar.module.css";

interface SearchBarProps {
  fromSearch?: (searchItem: string) => void;
}

interface SearchBarState {
  searchItem: string;
  placeholder: string;
  showAlert: boolean;
}

class SearchBar extends Component<SearchBarProps, SearchBarState> {
  constructor(props: SearchBarProps) {
    super(props);
    const savedSearchItem = localStorage.getItem("searchItem") || "";
    this.state = {
      searchItem: savedSearchItem,
      placeholder: savedSearchItem ? "" : "pikachu",
      showAlert: false,
    };
  }

  handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({ searchItem: event.target.value });
  };

  handleSearch = () => {
    const trimmedSearchItem = this.state.searchItem.trim();
    localStorage.setItem("searchItem", trimmedSearchItem);

    if (this.props.fromSearch) {
      this.props.fromSearch(trimmedSearchItem);
    }
  };

  handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    this.handleSearch();
  };

  handleFocus = () => {
    this.setState({ placeholder: "" });
  };

  closeAlert = () => {
    this.setState({ showAlert: false });
  };

  render() {
    return (
      <form
        onSubmit={this.handleFormSubmit}
        className={styles.searchBarContainer}
      >
        <input
          type="text"
          value={this.state.searchItem}
          onChange={this.handleInputChange}
          placeholder="pikachu"
          onFocus={this.handleFocus}
          className={styles.input}
        />
        <button type="submit" className={styles.button}>
          Search
        </button>
        {this.state.showAlert && (
          <div className={styles.alert}>
            <p>Please enter a search term.</p>
            <button
              onClick={this.closeAlert}
              className={styles.closeAlertButton}
            >
              Close
            </button>
          </div>
        )}
      </form>
    );
  }
}

export default SearchBar;
