
import React from 'react';
import navbarTabsConfig from '../config/navbarTabs';
let navbarTabs = navbarTabsConfig;

const styles = {
    container: {
        background: '#333'
    },
    dropdown: {
        textAlign: 'right'
    }
};

class Navbar extends React.Component {
    // switch the state of showTabs, which decides to add a class or not
    toggleTabs() {
        this.setState({
            showTabs: !(this.state.showTabs)
        });
    }

    constructor(props) {
        super(props);
        this.state = {
            showTabs: false
        };
        this.toggleTabs = this.toggleTabs.bind(this);
    }

    componentWillMount() {
        if (this.props && this.props.navbarTabs) {
            navbarTabs = this.props.navbarTabs;
        }
    }

    render() {
        return (
            <div style={styles.container}>
                <ul className="main-navbar-list">
                    <li className="dropdown-item" style={styles.dropdown} onClick={this.toggleTabs}>
                        <i className="fa fa-bars fa-lg" aria-hidden="true"></i>
                    </li>
                    {navbarTabs.map(function(item, i) {
                        // if a tab to hide, return false
                        if (this.props.hideTabs && this.props.hideTabs.indexOf(item.name) > -1) {
                            return false;
                        }

                        let extraClasses = "";
                        if (i === (navbarTabs.length-1)) {
                            extraClasses += " last-item";
                        }
                        if (this.state.showTabs) {
                            extraClasses += " shown"
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
}

export default Navbar;