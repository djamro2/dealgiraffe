
import React from 'react';

const defaultProps = {
    tabs: []
};

class Navbar extends React.Component {
    render() {
        return (
            <div className="main-navbar">
                <ul className="main-navbar-list">
                    {this.props.tabs.map(function(item) {
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

Navbar.defaultProps = defaultProps;
export default Navbar;