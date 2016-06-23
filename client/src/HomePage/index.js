
import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin(); /* remove this after React 1.0 comes out */

// puts all the individual components into final version
import Banner from '../ProductPage/Banner';
import Navbar from '../ProductPage/Navbar';
import Footer from '../ProductPage/Footer';

// settings product page settings
const navbarTabs = [
    {name: 'Home', link: '/'},
    {name: 'PC Hardware', link: '/pchardware'},
    {name: 'Gaming', link: '/gaming'},
    {name: 'Submit Item', link: '/submit'},
    {name: 'Contact', link: '/contact'}
];

const FullPage = (
    <div className="main-col">
        <Banner />
        <Navbar tabs={navbarTabs} />
        <Footer />
    </div>
);

ReactDOM.render(
    FullPage,
    document.getElementById('app')
);
