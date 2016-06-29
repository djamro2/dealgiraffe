
import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin(); /* remove this after React 1.0 comes out */

// puts all the individual Components into final version
import Banner from '../Components/Banner';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import SearchBox from './SearchBox';
import ProductItems from './ProductItems';
import muiTheme from '../lib/defaultMuiTheme';

function FullPage({items}) {
    return (
        <MuiThemeProvider muiTheme={muiTheme}>
            <div className="main-col">
                <Banner />
                <Navbar />
                <SearchBox />
                <ProductItems items={items}/>
                <Footer />
            </div>
        </MuiThemeProvider>
    );
};

function getHomePageItems(callback) {
    var tempItems = [
        {title: 'Sample Title', priceText: '$5.00'},
        {title: 'Sample Title', priceText: '$5.00'},
        {title: 'Sample Title', priceText: '$5.00'},
        {title: 'Sample Title', priceText: '$5.00'},
        {title: 'Sample Title', priceText: '$5.00'},
        {title: 'Sample Title', priceText: '$5.00'},
        {title: 'Sample Title', priceText: '$5.00'},
        {title: 'Sample Title', priceText: '$5.00'},
        {title: 'Sample Title', priceText: '$5.00'},
        {title: 'Sample Title', priceText: '$5.00'}
    ];
    return callback(null, tempItems);
}

getHomePageItems(function(err, items) {
    if (err) {
        console.log('Error getting items: ' + err);
    }
    ReactDOM.render(
        <FullPage items={items} />,
        document.getElementById('app')
    );
});
