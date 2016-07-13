
import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin(); /* remove this after React 1.0 comes out */

// puts all the individual Components into final version
import Banner from '../Components/Banner';
import Navbar from '../Components/Navbar';
import Info from './Info';
import Footer from '../Components/Footer';
import muiTheme from '../lib/defaultMuiTheme';

function FullPage({items}) {
    return (
        <MuiThemeProvider muiTheme={muiTheme}>
            <div className="main-col contact-page">
                <Banner />
                <Navbar />
                <Info />
                <Footer />
            </div>
        </MuiThemeProvider>
    );
}


ReactDOM.render(
    <FullPage />,
    document.getElementById('app')
);