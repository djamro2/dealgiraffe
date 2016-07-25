
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
        this.state = {};

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        // state variables need to be set to be put into TextField
        if (nextProps.inputs) {
            var state = this.state;
            for (var i = 0 ; i < nextProps.inputs.length; i++) {
                state[nextProps.inputs[i].id] = '';
            }
            this.setState(state);
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
        this.props.callback(this.state);
    }

    render() {
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

        var textFields = [];
        var inputs = this.props.inputs;
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