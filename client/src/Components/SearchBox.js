
import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';

const styles = {
    inputStyles: {
        borderRadius: '5px',
        border: '1px solid #999'
    }
};

class SearchBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchVal: ''
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleInputEnter = this.handleInputEnter.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
    }

    handleInputChange(event) {
        this.setState({
            searchVal: event.target.value
        });
    }

    handleInputEnter(event) {
        if (event.keyCode === 13) {
            this.handleSearch(event);
        }
    }

    handleSearch(event) {
        if (!this.state || !this.state.searchVal) {
            return;
        }
        window.location.href = '/search?query=' + this.state.searchVal;
    }

    componentWillMount() {
        if (this.props.style) {
            styles.parentStyles = this.props.style;
        }
        if (this.props.searchQuery) {
            this.setState({
                searchVal: this.props.searchQuery
            });
        }
    }

    render() {
        return(
            <Paper style={styles.parentStyles} zDepth={2} className="search-box">
                <input
                    style={styles.inputStyles}
                    type="text"
                    placeholder="Search items"
                    value={this.state.searchVal}
                    onKeyDown={this.handleInputEnter}
                    onChange={this.handleInputChange}
                />
                <RaisedButton
                    className='search-button'
                    label="Search"
                    primary={true}
                    onMouseDown={this.handleSearch} />
            </Paper>
        );
    }
}

export default SearchBox;