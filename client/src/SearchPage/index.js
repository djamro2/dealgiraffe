
import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import queryString from 'query-string';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin(); /* remove this after React 1.0 comes out */

// puts all the individual Components into final version
import Banner from '../Components/Banner';
import Navbar from '../Components/Navbar';
import SearchBox from '../Components/SearchBox';
import SearchOptions from '../Components/SearchOptions';
import ProductItemsGrid from '../Components/ProductItemsGrid';
import Footer from '../Components/Footer';
import muiTheme from '../lib/defaultMuiTheme';
import defaultSearchOptions from '../lib/defaultSearchOptions';
import parseResponse from '../lib/parseResponse';

function handleSearchOptionChange(event, newState) {
    renderPage(newState);
}

function FullPage({searchQuery, products, numberOfItems, searching}) {
    var onSearchedItems = [];
    if (searching !== true) {
        onSearchedItems.push(
            <SearchOptions
                key={0}
                handleSearchOptionChange={handleSearchOptionChange}
                numberOfItems={numberOfItems}
            />
        );
        onSearchedItems.push(<ProductItemsGrid key={1} products={products} />);
    }

    return (
        <MuiThemeProvider muiTheme={muiTheme}>
            <div className="main-col search-page">
                <Banner style={{margin: '0 .5rem'}} />
                <Navbar style={{margin: '0 .5rem'}} />
                <SearchBox style={{margin: '0 .5rem'}} searchQuery={searchQuery} />
                {onSearchedItems}
                <Footer />
            </div>
        </MuiThemeProvider>
    );
}

function renderPage(options) {
    if (!options) {
        options = defaultSearchOptions;
    }
    
    var params = queryString.parse(location.search);
    if (params.query) { /* searched item */
        options.searchQuery = params.query;
        $.get('/api/GetSearchItems', options, function(result) {
            var products = parseResponse(result.products);
            ReactDOM.render(
                <FullPage
                    searchQuery={options.searchQuery}
                    numberOfItems={result.count}
                    products={products}
                />,
                document.getElementById('app')
            );
        });
    } else { /* did not search yet */
        ReactDOM.render(
            <FullPage searching={true} />,
            document.getElementById('app')
        );
    }

}

// load page with default options
renderPage();
