
import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import muiTheme from '../lib/defaultMuiTheme';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin(); /* remove this after React 1.0 comes out */

import AdminNavbar from './AdminNavbar';
import GeneralStats from './GeneralStats';
import QueryModule from './QueryModule';
import ProductModule from './ProductModule';
import RaisedInputDialog from './RaisedInputDialog';

const styles = {
    container: {
        margin: 'auto',
        maxWidth: '960px'
    },
    dialog: {
        textAlign: 'center'
    }
};

class AdminDashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            openDialog: false,
            dialogTitle: '',
            dialogInputs: [],
            dialogSubmitCallback: undefined,
            dialogAddRow: undefined,
            dialogPreviousState: undefined
        };

        this.createDialog = this.createDialog.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
    }

    // create the dialog that shows up
    // title - String
    // input - Array of objects {id: '', text: ''}
    // submitCallback - function called when submit is clicked
    // addRow - function called when Add Row is clicked, will update the inputs[] variable
    createDialog(title, inputs, submitCallback, addRow) {
        this.setState({
            openDialog: true,
            dialogTitle: title,
            dialogInputs: inputs,
            dialogSubmitCallback: submitCallback,
            dialogAddRow: addRow
        });
    }

    closeDialog() {
        this.setState({
            openDialog: false
        });
    }

    render() {
        var dialogControls = {
            addRowsToDialog: this.addRowsToDialog,
            createDialog: this.createDialog,
            closeDialog: this.closeDialog
        };

        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                <div className="center-column" style={styles.container}>
                    <AdminNavbar />
                    <GeneralStats />
                    <QueryModule />
                    <ProductModule dialogControls={dialogControls} />
                    <RaisedInputDialog
                        open={this.state.openDialog}
                        previousState={this.state.dialogPreviousState}
                        title={this.state.dialogTitle}
                        inputs={this.state.dialogInputs}
                        submitCallback={this.state.dialogSubmitCallback}
                        addRow={this.state.dialogAddRow}
                        dialogControls={dialogControls}
                        style={styles.dialog}
                    />
                </div>
            </MuiThemeProvider>
        );
    }
}

ReactDOM.render(
    <AdminDashboard />,
    document.getElementById('app')
);
