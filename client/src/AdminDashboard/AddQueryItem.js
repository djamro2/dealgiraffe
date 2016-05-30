
import React from 'react';
import TextField from 'material-ui/TextField';

const styles = {
    textFieldContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    }
};

const AddQueryItem = React.createClass({

    handleChange: function(evt) {
        var nextState = this.state; nextState[evt.target.id] = evt.target.value;
        this.setState(nextState);
        this.props.handleInputChange(nextState);
    },
    componentWillMount: function() {
        this.setState({
            searchQuery: '',
            searchIndex: 'PCHardware',
            category: ''
        });
    },
    render: function() {
        return (
            <div style={styles.textFieldContainer}>
                <TextField
                    id="searchQuery"
                    value={this.state.searchQuery}
                    onChange={this.handleChange}
                    floatingLabelText="Search Query"
                />
                <TextField
                    id="searchIndex"
                    value={this.state.searchIndex}
                    onChange={this.handleChange}
                    floatingLabelText="Search Index"
                />
                <TextField
                    id="category"
                    value={this.state.category}
                    onChange={this.handleChange}
                    floatingLabelText="Category (for internal use)"
                />
            </div>
        );
    }

});

export default AddQueryItem;