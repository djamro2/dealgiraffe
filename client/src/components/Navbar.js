
import React from 'react';
import navbarTabsConfig from '../config/navbarTabs';
let navbarTabs = navbarTabsConfig;

const styles = {};

class Navbar extends React.Component {

    componentWillMount() {
        if (this.props && this.props.navbarTabs) {
            navbarTabs = this.props.navbarTabs;
        }
        if (this.props.style) {
            styles.parentStyles = this.props.style;
        }
    }

    render() {
        return (
            <div className="main-navbar" style={styles.parentStyles}>
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