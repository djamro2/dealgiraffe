
import React from 'react';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import defaultSearchOptions from '../lib/defaultSearchOptions';

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    }
};

class SearchOptions extends React.Component {
    // handle order by change, local updates and move new object upstream
    handleOrderByChange(event, index, value) {
        var currentState = this.state;
        currentState.orderByValue = value;
        this.setState(currentState);
        if (this.props.handleSearchOptionChange) {
            this.props.handleSearchOptionChange(event, currentState);
        }
    }

    // handle page number change, local updates and move new object upstream to rerender
    handlePageNumberChange(event, index, value) {
        var currentState = this.state;
        currentState.currentPage = value;
        this.setState(currentState);
        if (this.props.handleSearchOptionChange) {
            this.props.handleSearchOptionChange(event, currentState);
        }
    }

    constructor(props) {
        super(props);
        this.state = defaultSearchOptions;
        this.handleOrderByChange = this.handleOrderByChange.bind(this);
        this.handlePageNumberChange = this.handlePageNumberChange.bind(this);
    }

    render() {
        var numPages = Math.ceil(this.props.numberOfItems / this.state.amountPerPage);

        var PageMenuItems = [];
        for (var i = 1; i <= numPages; i++) {
            PageMenuItems.push(<MenuItem value={i} primaryText={i} key={i} />);
        }

        var firstItem = ((this.state.currentPage-1) * this.state.amountPerPage) + 1;
        var lastItem  = (firstItem + this.state.amountPerPage) - 1;
        if (lastItem > this.props.numberOfItems) {
            lastItem = this.props.numberOfItems;
        }

        // add <MenuItem value="price" primaryText="Price" />
        return (
            <div style={styles.container}>
                <span className="pdl-8">Show items {firstItem} - {lastItem} out of {this.props.numberOfItems}</span>
                <span className="flex"></span>
                <span className="pdt-8 bold">Order by:</span>
                <DropDownMenu id="orderBy" className="mgr-12" value={this.state.orderByValue} onChange={this.handleOrderByChange}>
                    <MenuItem value="relevance" primaryText="Relevance" />
                    <MenuItem value="alphabetical" primaryText="Alphabetical" />
                    <MenuItem value="popular" primaryText="Popular" />
                    <MenuItem value="recent" primaryText="Recently Added" />
                </DropDownMenu>
                <span className="pdt-8 bold">Page:</span>
                <DropDownMenu id="pageNumber" className="mgr-12" value={this.state.currentPage} onChange={this.handlePageNumberChange}>
                    {PageMenuItems}
                </DropDownMenu>
            </div>
        );
    }
}

export default SearchOptions;
