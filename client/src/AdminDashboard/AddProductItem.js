
import React from 'react';
import TextField from 'material-ui/TextField';

const styles = {
    textFieldContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    }
};

const AddProductItem = React.createClass({
    handleChange: function(evt) {
        var nextState = this.state;
        nextState[evt.target.id] = evt.target.value;
        this.setState(nextState);
        this.props.handleInputChange(nextState);
    },

    componentWillMount: function() {
        this.setState({
            asin: ''
        });
    },

    render: function() {
        return (
            <div style={styles.textFieldContainer}>
                <TextField
                    id="asin"
                    value={this.state.asin}
                    onChange={this.handleChange}
                    floatingLabelText="ASIN"
                />
            </div>
        );
    }
});

export default AddProductItem;