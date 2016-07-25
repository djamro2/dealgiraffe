
import React from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import AddItemDialog from './RaisedInputDialog';
import ProductItems from './ProductItems';

const styles = {
    buttonRow: {
        paddingTop: '15px',
        textAlign: 'right'
    },
    container: {
        padding: '1rem',
        marginTop: '2rem'
    }
};

// child of ModuleContent
const ProductModule = React.createClass({
    getMaxPages: function() {
        if (!this.state || !this.state.totalProducts) {
            return 0;
        }
        return (Math.ceil(this.state.totalProducts/this.state.amtPerPage));
    },

    handleAddProduct: function(){
        this.setState(
            {
                openDialog: true,
                dialogTitle: 'Add Product'
            }
        );
    },

    handleAmountPerPageChange: function(evt) {
        this.setState({
            amtPerPage: evt.target.value
        });
    },

    handleProductOrderByChange: function(evt, index, value){
        this.setState({
            productOrderBy: value
        });
    },

    handleProductPageChange: function(evt) {
        this.setState({
            productPage: evt.target.value
        });
    },

    componentWillMount: function() {
        this.setState({
            openDialog: false,
            productPage: 1,
            productOrderBy: 'newest',
            productOrderType: 'increasing',
            amtPerPage: 10
        });
    },

    componentDidMount: function() {
        $.get("/api/GetAllProductInfo", function(response){
            this.setState({
                totalProducts: response.totalProducts
            });
        }.bind(this));
    },

    render: function() {
        var dialogTitle = (this.state && this.state.dialogTitle) || 'Add Product';
        
        return (
            <Paper zDepth={2} style={styles.container}>
                <div className="table-controls-container align-right">
                    <span>
                        <span className="select-label">Order By: </span>
                        <SelectField
                            value={this.state.productOrderBy}
                            onChange={this.handleProductOrderByChange}
                        >
                            <MenuItem value={"newest"} primaryText="Newest" />
                            <MenuItem value={"oldest"} primaryText="Oldest" />
                            <MenuItem value={"pageViews"} primaryText="Page Views Greatest" />
                            <MenuItem value={"alphabetical"} primaryText="Alphabetical" />
                            <MenuItem value={"recentlyUpdated"} primaryText="Recently Updated" />
                            <MenuItem value={"oldestUpdated"} primaryText="Oldest Updated" />
                        </SelectField>
                    </span>
                    <span>
                        <span className="select-label">Page Number: </span>
                        <TextField
                            id="productPage"
                            value={this.state.productPage}
                            onChange={this.handleProductPageChange}
                        />
                        <span> (max: {this.getMaxPages()})</span>
                    </span>
                    <span>
                        <span className="select-label">Amount per page: </span>
                        <TextField
                            id="amtPerPage"
                            value={this.state.amtPerPage}
                            onChange={this.handleAmountPerPageChange}
                        />
                    </span>
                </div>

                <ProductItems
                    amtPerPage={this.state.amtPerPage}
                    productPage={this.state.productPage}
                    productOrderBy={this.state.productOrderBy}
                    dialogControls={this.props.dialogControls}
                />

                <div style={styles.buttonRow}>
                    <RaisedButton
                        label="Add Product"
                        primary={true}
                        onTouchTap={this.handleAddProduct}
                    />
                </div>
            </Paper>
        );
    }
});

export default ProductModule;
