
import React from 'react';
import ProductTable from './ProductTable';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';

const styles = {
    buttonRow: {
        paddingTop: '15px',
        textAlign: 'right'
    }
};

// child of ModuleContent
const ProductControls = React.createClass({

    getMaxPages: function() {
        if (!this.state || !this.state.totalProducts) {
            return 0;
        }
        return (Math.ceil(this.state.totalProducts/this.state.amtPerPage));
    },
    handleOpen: function(){
        this.setState(
            {openDialog: true}
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
        return (
            <div>
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

                <ProductTable
                    amtPerPage={this.state.amtPerPage}
                    productPage={this.state.productPage}
                    productOrderBy={this.state.productOrderBy}
                />

            </div>
        );
    }
});

export default ProductControls;
