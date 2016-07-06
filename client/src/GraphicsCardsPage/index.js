
import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin(); /* remove this after React 1.0 comes out */

// puts all the individual Components into final version
import Banner from '../Components/Banner';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import muiTheme from '../lib/defaultMuiTheme';
import parseResponse from '../lib/parseResponse';
import ProductItemsGrid from '../Components/ProductItemsGrid';

function FullPage({products}) {
    return (
        <MuiThemeProvider muiTheme={muiTheme}>
            <div className="main-col search-page">
                <Banner style={{margin: '0 .5rem'}} />
                <Navbar style={{margin: '0 .5rem'}} />
                <ProductItemsGrid products={products} />
                <Footer />
            </div>
        </MuiThemeProvider>
    );
}

$.get("/api/GetGraphicsPageProducts/", function(products){
    products = parseResponse(products);
    ReactDOM.render(
        <FullPage products={products} />,
        document.getElementById('app')
    );
}.bind(this));