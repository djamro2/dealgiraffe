
import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import AddProductItem from './AddProductItem';
import AddQueryItem from './AddQueryItem';

const AddItemDialog = React.createClass({
    componentWillMount: function() {
        this.setState({
            open: (this.props && this.props.open) || false,
            formFields: null
        });
    },

    handleClose: function() {
        this.setState({
            open: false
        });
    },

    handleSubmit: function() {
        var url = '';
        if (this.props.title === "Add Query") {
            url = '/api/AddQueueItem';
        } else if (this.props.title === "Add Product") {
            url = '/api/AddProductItem';
        } else {
            return console.error('Not submitting because title is incorrect');
        }

        $.ajax({
            type: "POST",
            url: url,
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

        var innerContent;
        if (this.props.title === "Add Query") {
            innerContent = <AddQueryItem handleInputChange={this.getFormFields} />;
        } else if (this.props.title === "Add Product") {
            innerContent = <AddProductItem handleInputChange={this.getFormFields} />;
        } else {
            innerContent = <AddProductItem handleInputChange={this.getFormFields} />;
        }

        return (
            <Dialog
                title={this.props.title}
                actions={actions}
                modal={false}
                open={this.state.open}
                onRequestClose={this.handleClose}
            >
                {innerContent}
            </Dialog>
        );
    }
    
});

export default AddItemDialog;