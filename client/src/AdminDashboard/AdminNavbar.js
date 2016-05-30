
import React from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Home from 'material-ui/svg-icons/action/home';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {white} from 'material-ui/styles/colors';
import {deepOrange500} from 'material-ui/styles/colors';

const muiTheme = getMuiTheme({
    palette: {
        accent1Color: deepOrange500
    }
});

const AdminNavbar = React.createClass({

    render: function() {

        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                <AppBar
                    title="DealGiraffe"
                    iconElementLeft={
                        <a href="/">
                            <IconButton>
                                <Home color={white}/>
                            </IconButton>
                        </a>
                    }
                    iconElementRight={
                        <IconMenu
                            iconButtonElement={
                                <IconButton><MoreVertIcon /></IconButton>
                            }
                            targetOrigin={{horizontal: 'right', vertical: 'top'}}
                            anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                        >
                            <a href="/admin" className="no-link-style">
                                <MenuItem primaryText="Refresh"/>
                            </a>
                        </IconMenu>
                    }
                />
            </MuiThemeProvider>
        );

    }

});

export default AdminNavbar;