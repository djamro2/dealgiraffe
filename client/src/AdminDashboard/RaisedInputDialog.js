
import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

const styles = {
    dialog: {
        textAlign: 'center'
    }
};

class RaisedInputDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inputs: []
        };

        this.setInputs = this.setInputs.bind(this);
        this.handleAddRow = this.handleAddRow.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
    }

    setInputs(inputs) {
        var state = this.state;
        state.inputs = inputs;
        for (var i = 0 ; i < inputs.length; i++) {
            if (!state[inputs[i].id]) {
                state[inputs[i].id] = '';
            }
        }
        this.setState(state);
    }

    componentWillReceiveProps(nextProps) {
        // state variables need to be set to be put into TextField
        if (nextProps.inputs) {
            this.setInputs(nextProps.inputs);
        }
    }

    handleAddRow() {
        if (this.props.addRow) {
            this.setInputs(this.props.addRow(this.state));
        } else {
            console.error('No add row callback');
        }
    }

    handleClose() {
        var dialogControls = this.props.dialogControls;
        dialogControls.closeDialog();
    }

    handleTextFieldChange (evt) {
        var state = this.state;
        state[evt.target.id] = evt.target.value;
        this.setState(state);
    }

    handleSubmit() {
        this.props.submitCallback(this.state);
    }

    render() {
        var inputs = this.state.inputs;
        const actions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onTouchTap={this.handleClose}
            />,
            <FlatButton
                label="Submit"
                primary={true}
                keyboardFocused={true}
                onTouchTap={this.handleSubmit}
            />
        ];

        if (this.props.addRow) {
            actions.splice(1, 0, (
                <FlatButton
                    label="Add Row(s)"
                    primary={true}
                    keyboardFocused={true}
                    onTouchTap={this.handleAddRow}
                />
            ));
        }

        var textFields = [];
        for (var i = 0; i < inputs.length; i++) {
            var id = inputs[i].id;
            textFields.push (
                <TextField
                    key={id}
                    id={id}
                    value={this.state[id]}
                    onChange={this.handleTextFieldChange}
                    floatingLabelText={this.props.inputs[i].text}
                    style={styles.textField}
                />
            );
        }

        var openDialog = this.props.open;

        return (
            <Dialog
                title={this.props.title}
                open={openDialog}
                actions={actions}
                modal={false}
                onRequestClose={this.handleClose}
                style={styles.dialog}
            >
                {textFields}
            </Dialog>
        );
    }
}

export default RaisedInputDialog;