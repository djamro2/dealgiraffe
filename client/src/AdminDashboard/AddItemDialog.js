
import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import AddProductItem from './AddProductItem';
import AddQueryItem from './AddQueryItem';

const AddItemDialog = React.createClass({

    componentWillMount: function() {
        this.setState({
            open: this.props.open,
            formFields: null
        });
    },
    handleClose: function() {
        this.setState({
            open: false
        });
    },
    handleSubmit: function() {
        $.ajax({
            type: "POST",
            url: "/api/AddQueueItem",
            data: this.state.formFields,
            success: function(result) {
                this.setState({
                    open: false
                });
                location.reload();
            }.bind(this)
        });
    },
    componentWillReceiveProps: function(nextProps) {
        this.setState({
            open: nextProps.open
        });
    },
    getFormFields: function(formFields) {
        this.setState({
            formFields: formFields
        });
    },
    render: function() {

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

        if (this.props.title === "Add Query") {
            return (
                <Dialog
                    title={this.props.title}
                    actions={actions}
                    modal={false}
                    open={this.state.open}
                    onRequestClose={this.handleClose}
                >
                    <AddQueryItem handleInputChange={this.getFormFields} />
                </Dialog>
            );
        }

        return (
            <Dialog
                title={this.props.title}
                actions={actions}
                modal={false}
                open={this.state.open}
                onRequestClose={this.handleClose}
            >
                <AddProductItem/>
            </Dialog>
        );
    }
    
});

export default AddItemDialog;