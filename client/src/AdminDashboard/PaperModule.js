
import React from 'react';
import Paper from 'material-ui/Paper';
import ModuleContent from './ModuleContent';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {deepOrange500} from 'material-ui/styles/colors';

const muiTheme = getMuiTheme({
    palette: {
        accent1Color: deepOrange500
    }
});

const style = {
    padding: '15px',
    marginTop: '20px'
};

const PaperModule = React.createClass({

    render: function() {

        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                <Paper style={style} zDepth={2}>
                    <h2 className="module-name">{this.props.moduleName}</h2>
                    <ModuleContent moduleType={this.props.moduleName} />
                </Paper>
            </MuiThemeProvider>
        );

    }

});

export default PaperModule;