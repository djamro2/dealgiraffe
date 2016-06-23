
import React from 'react';

// set the title and link of tabs
const navbarTabs = [
    {name: 'Home', link: '/'},
    {name: 'PC Hardware', link: '/pchardware'},
    {name: 'Gaming', link: '/gaming'},
    {name: 'Submit Item', link: '/submit'},
    {name: 'Contact', link: '/contact'}
];

class Navbar extends React.Component {
    render() {
        return (
            <div className="main-navbar">
                <ul className="main-navbar-list">
                    {navbarTabs.map(function(item) {
                        return (
                            <a href={item.link} key={item.name}>
                                <li className="main-navbar-list-item white">{item.name}</li>
                            </a>
                        );
                    }.bind(this))}
                </ul>
            </div>
        );
    }
};

export default Navbar;