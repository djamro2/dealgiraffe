
import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin(); /* remove this after React 1.0 comes out */

// puts all the individual components into final version
import Banner from './Banner';
import Navbar from './Navbar';

const FullPage = (
    <div className="main-col">
        <Banner />
        <Navbar />
    </div>
);

ReactDOM.render(
    FullPage,
    document.getElementById('app')
);