
import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import ProductTable from './ProductTable'
import AddItemDialog from './AddItemDialog';

const styles = {
    buttonRow: {
        paddingTop: '15px',
        textAlign: 'right'
    }
};

const ProductControls = React.createClass({

    handleOpen: function(){
        this.setState(
            {openDialog: true}
        );
    },

    componentWillMount: function() {
        this.setState({
            openDialog: false
        });
    },

    render: function() {

        return (
            <div>
                <ProductTable />
                <div style={styles.buttonRow}>
                    <RaisedButton
                        label="Add Product"
                        primary={true}
                        onTouchTap={this.handleOpen}
                    />
                </div>
                <AddItemDialog title="Add Product" open={this.state.openDialog} />
            </div>
        );
    }

});

export default ProductControls;
