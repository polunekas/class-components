import { Component, type ChangeEvent, type KeyboardEvent } from 'react';
import styles from './SearchBar.module.css';

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
    const savedSearchItem = localStorage.getItem('searchItem') || '';
    this.state = {
      searchItem: savedSearchItem,
      placeholder: savedSearchItem ? '' : 'pikachu',
      showAlert: false,
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

  handleFocus = () => {
    this.setState({ placeholder: '' });
  };

  handleBlur = () => {
    if (!this.state.searchItem) {
      this.setState({ placeholder: 'pikachu' });
    }
  };

  closeAlert = () => {
    this.setState({ showAlert: false });
  };

  render() {
    return (
      <div className={styles.searchBarContainer}>
        <input
          type="text"
          value={this.state.searchItem}
          onChange={this.handleInputChange}
          onKeyPress={this.handleKeyPress}
          placeholder={this.state.placeholder}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          className={styles.input}
        />
        <button onClick={this.handleSearch} className={styles.button}>Search</button>
        {this.state.showAlert && (
          <div className={styles.alert}>
            <p>Please enter a search term.</p>
            <button onClick={this.closeAlert} className={styles.closeAlertButton}>Close</button>
          </div>
        )}
      </div>
    );
  }
}

export default SearchBar;
