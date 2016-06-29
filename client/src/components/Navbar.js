
import React from 'react';
import navbarTabsConfig from '../config/navbarTabs';
let navbarTabs = navbarTabsConfig;

class Navbar extends React.Component {
    componentWillMount() {
        if (this.props && this.props.navbarTabs) {
            navbarTabs = this.props.navbarTabs;
        }
    }

    render() {
        return (
            <div className="main-navbar">
                <ul className="main-navbar-list">
                    {navbarTabs.map(function(item, i) {
                        let extraClasses = "";
                        if (i === (navbarTabs.length-1)) {
                            extraClasses += " last-item";
                        }
                        const className = "main-navbar-list-item white" + extraClasses;
                        return (
                            <a href={item.link} key={item.name}>
                                <li className={className}>{item.name}</li>
                            </a>
                        );
                    }.bind(this))}
                </ul>
            </div>
        );
    }
};

export default Navbar;