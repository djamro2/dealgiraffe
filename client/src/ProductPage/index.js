
import React from 'react';
import ReactDOM from 'react-dom';
import queryString from 'query-string';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin(); /* remove this after React 1.0 comes out */

// puts all the individual components into final version
import Banner from '../components/Banner';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductInfo from './ProductInfo';
import ProductGraph from './ProductGraph';
import muiTheme from '../lib/defaultMuiTheme';

function FullPage({product}) {
    return (
        <MuiThemeProvider muiTheme={muiTheme}>
            <div className="main-col">
                <Banner />
                <Navbar />
                <ProductInfo product={product}/>
                <ProductGraph product={product}/>
                <Footer />
            </div>
        </MuiThemeProvider>
    );
};

var params = queryString.parse(location.search);
$.get("/api/GetProduct/" + params.id, function(product){
    ReactDOM.render(
        <FullPage product={product} />,
        document.getElementById('app')
    );
}.bind(this));