import React from 'react';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconButton from 'material-ui/IconButton';
import formatDate from './../lib/formatDate';

const styles = {
    tableFlex: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        overflowX: 'scroll',
        overflowY: 'hidden',
        paddingBottom: '10px'
    },
    tableFlexColumn: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start'
    },
    tableFlexColumnItem: {
        padding: '12px 20px',
        borderBottom: '1px solid rgb(230, 230, 230)',
        textAlign: 'center',
        whiteSpace: 'nowrap'
    }
};

// return none if last day is 1969, otherwise format correctly date
const getFormattedDate = function(date, format) {
    var dateObj = new Date(date);
    if ( !isNaN(dateObj.getFullYear()) && dateObj.getFullYear() === 1969) {
        return "none";
    }
    return formatDate(date, format);
};

// return the total number of price points
const getPricePoints = function(item) {
    var num_amazon_new, num_third_new, num_third_used;
    num_amazon_new = item.price_amazon_new.length;
    num_third_new = item.price_third_new.length;
    num_third_used = item.price_third_used.length;

    return String(num_amazon_new) + "/" + String(num_third_new) + "/" + String(num_third_used);
};

const maxLength = function(text, limit) {
    if (text.length <= limit) {
        return text;
    }
    var nextText = text.substring(0, limit);
    nextText += "...";
    return nextText;
};

// convert a bool to its english translation
const toEnglish = function(bool) {
    if (!bool || bool==="" || bool==false)
        return "no";
    return "yes";
};

// return a page range, [start, end), 0-indexed
const getPageRange = function(productPage, amtPerPage) {
    var start = (productPage-1) * amtPerPage;
    var end = (Number(start) + Number(amtPerPage));
    return {start: start, end: end};
};

const ProductItems = React.createClass({
    // 'Add Video' clicked. Bring up the correct modal
    handleAddVideo: function(asin) {
        var dialogControls = this.props.dialogControls;
        var inputs = [
            {id: 'youtubeVideo', text: 'Embedded YouTube Link'}
        ];
        dialogControls.createDialog('Add Video URL', inputs, function(results) {
            results.asin = asin;
            $.ajax({
                type: "POST",
                url: '/api/AddProductVideo',
                data: results,
                success: function(result) {
                    dialogControls.closeDialog();
                }.bind(this)
            });
        });
    },

    // 'Add Links' clicked. Bring up the modal
    handleAddLinks: function(asin) {
        var dialogControls = this.props.dialogControls;
        var inputs = [
            {id: 'link1a', text: 'Title Link #1'},
            {id: 'link1b', text: 'URL Link #1'},
        ];

        var submitCallback = function(state) {
            var params = {
                asin: asin,
                usefulLinks: []
            }; 
            for (var i = 1; state['link' + i + 'a']; i++) {
                params.usefulLinks.push({
                    title: (state['link' + i + 'a']),
                    url: (state['link' + i + 'b'])
                });
            }

            $.ajax({
                type: "POST",
                url: '/api/AddProductLinks',
                data: params,
                success: function(result) {
                    dialogControls.closeDialog();
                }.bind(this)
            });
        };

        var addRows = function(state) {
            var inputNum = (inputs.length / 2) + 1;
            inputs.push(
                {id: ('link' + inputNum + 'a'), text: 'Title Link #' + inputNum}
            );
            inputs.push(
                {id: ('link' + inputNum + 'b'), text: 'URL Link #' + inputNum}
            );
            return inputs;
        };

        dialogControls.createDialog('Add Helpful Links', inputs, submitCallback, addRows);
    },

    handleAddOtherPrices: function(asin) {
        var dialogControls = this.props.dialogControls;
        var inputs = [
            {id: 'price1a', text: 'Price #1'},
            {id: 'price1b', text: 'Price #1 Link'},
        ];

        var submitCallback = function(state) {
            var params = {
                asin: asin,
                otherPrices: []
            }; 
            for (var i = 1; state['price' + i + 'a']; i++) {
                params.otherPrices.push({
                    price: (state['price' + i + 'a']),
                    url: (state['price' + i + 'b'])
                });
            }

            $.ajax({
                type: "POST",
                url: '/api/AddProductOtherPrices',
                data: params,
                success: function(result) {
                    dialogControls.closeDialog();
                }.bind(this)
            });
        };

        var addRows = function(state) {
            var inputNum = (inputs.length / 2) + 1;
            inputs.push(
                {id: ('price' + inputNum + 'a'), text: 'Price #' + inputNum}
            );
            inputs.push(
                {id: ('price' + inputNum + 'b'), text: 'Price #' + inputNum + ' Link'}
            );
            return inputs;
        };

        dialogControls.createDialog('Add Other Prices', inputs, submitCallback, addRows);
    },

    handleToggleFrontPage: function(id) {
        $.ajax({
            type: "POST",
            url: "/api/ToggleFrontPageProduct",
            data: {id: id},
            success: function(result) {
                var oldProducts = this.state.products;
                var newProducts = [];
                for (var i = 0; i < oldProducts.length; i++) {
                    if (oldProducts[i]._id === result._id) {
                        oldProducts[i].force_frontpage = result.force_frontpage;
                        newProducts = oldProducts;
                        break;
                    }
                }

                this.setState({
                    products: newProducts
                });
            }.bind(this)
        });
    },

    handlePrioritizeProduct: function(id) {
        $.ajax({
            type: "POST",
            url: "/api/PrioritizeProduct",
            data: {id: id},
            success: function() {
                location.reload(); /* reload page on success to see updated query table */
            }.bind(this)
        });
    },

    componentDidMount: function() {
        var pageRange = getPageRange(this.props.productPage, this.props.amtPerPage);
        var path = "/api/GetProducts/" + String(pageRange.start) + "/" + String(pageRange.end) + "/" + String(this.props.productOrderBy);
        $.get(path, function(response){
            this.setState({
                products: response
            });
        }.bind(this));
    },

    componentWillReceiveProps: function(nextProps) {
        var pageRange = getPageRange(nextProps.productPage, nextProps.amtPerPage);
        var path = "/api/GetProducts/" + String(pageRange.start) + "/" + String(pageRange.end) + "/" + String(nextProps.productOrderBy);
        $.get(path, function(response){
            this.setState({
                products: response
            });
        }.bind(this));
    },

    render: function() {
        // don't do anything if state doesn't exist yet
        if (!this.state || !this.state.products || !this.state.products.map) {
            return (
                <span></span>
            );
        }

        return (
            <div className="table-container">
                <div className="table-flex" style={styles.tableFlex}>
                    <div className="table-flex-column" style={styles.tableFlexColumn}>
                        <div className="table-flex-column-item table-flex-title"
                             style={styles.tableFlexColumnItem}
                        >
                            Product Name/Title
                        </div>
                        {this.state.products.map(function(item, i){
                            return (
                                <a href={"/product?id=" + item.asin}
                                   key={item._id}
                                   className="no-link-style"
                                   title={item.large_data.ItemAttributes.Title}>
                                    <div className={ (i === (this.state.products.length-1) ? "no-border-bottom" : "") }
                                         style={styles.tableFlexColumnItem}
                                    >
                                        {maxLength(item.large_data.ItemAttributes.Title, 25)}
                                    </div>
                                </a>
                            );
                        }.bind(this))}
                    </div>

                    <div className="table-flex-column" style={styles.tableFlexColumn}>
                        <div className="table-flex-column-item table-flex-title"
                             style={styles.tableFlexColumnItem}
                        >
                            Page Views
                        </div>
                        {this.state.products.map(function(item, i){
                            return (
                                <div key={item._id}
                                     className={ (i === (this.state.products.length-1) ? "no-border-bottom" : "") }
                                     style={styles.tableFlexColumnItem}
                                >
                                    { item.page_views }
                                </div>
                            );
                        }.bind(this))}
                    </div>

                    <div className="table-flex-column" style={styles.tableFlexColumn}>
                        <div className="table-flex-column-item table-flex-title"
                             style={styles.tableFlexColumnItem}
                        >
                            # of Price Points
                        </div>
                        {this.state.products.map(function(item, i){
                            return (
                                <div key={item._id}
                                     className={ (i === (this.state.products.length-1) ? "no-border-bottom" : "") }
                                     style={styles.tableFlexColumnItem}
                                >
                                    { getPricePoints(item) }
                                </div>
                            );
                        }.bind(this))}
                    </div>

                    <div className="table-flex-column" style={styles.tableFlexColumn}>
                        <div className="table-flex-column-item table-flex-title"
                             style={styles.tableFlexColumnItem}
                        >
                            Last Time Updated
                        </div>
                        {this.state.products.map(function(item, i){
                            return (
                                <div key={item._id}
                                     className={ (i === (this.state.products.length-1) ? "no-border-bottom" : "") }
                                     style={styles.tableFlexColumnItem}
                                >
                                    { getFormattedDate(item.last_time_updated, "MM/DD h:mma") }
                                </div>
                            );
                        }.bind(this))}
                    </div>

                    <div className="table-flex-column" style={styles.tableFlexColumn}>
                        <div className="table-flex-column-item table-flex-title"
                             style={styles.tableFlexColumnItem}
                        >
                            Date Created
                        </div>
                        {this.state.products.map(function(item, i){
                            return (
                                <div key={item._id}
                                     className={ (i === (this.state.products.length-1) ? "no-border-bottom" : "") }
                                     style={styles.tableFlexColumnItem}
                                >
                                    { getFormattedDate(item.date_created, "MM/DD h:mma") }
                                </div>
                            );
                        }.bind(this))}
                    </div>

                    <div className="table-flex-column" style={styles.tableFlexColumn}>
                        <div className="table-flex-column-item table-flex-title"
                             style={styles.tableFlexColumnItem}
                        >
                            Front Page?
                        </div>
                        {this.state.products.map(function(item, i){
                            return (
                                <div key={item._id}
                                     className={ (i === (this.state.products.length-1) ? "no-border-bottom" : "") }
                                     style={styles.tableFlexColumnItem}
                                >
                                    { toEnglish(item.force_frontpage) }
                                </div>
                            );
                        }.bind(this))}
                    </div>

                    <div className="table-flex-column" style={styles.tableFlexColumn}>
                        <div className="table-flex-column-item table-flex-title" style={styles.tableFlexColumnItem}>Actions</div>
                        {this.state.products.map(function(item, i){
                            return (
                                <IconMenu
                                    key={item._id}
                                    className={ (i === (this.state.products.length-1) ? "no-border-bottom table-icon-menu" : "table-icon-menu") }
                                    iconButtonElement={
                                        <IconButton><MoreVertIcon/></IconButton>
                                    }
                                    targetOrigin={{horizontal: 'right', vertical: 'top'}}
                                    anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                                >
                                    <MenuItem primaryText="Prioritize" onClick={() => this.handlePrioritizeProduct(item._id)} />
                                    <MenuItem primaryText="Front Page" onClick={() => this.handleToggleFrontPage(item._id)} />
                                    <MenuItem primaryText="Add Video" onClick={() => this.handleAddVideo(item.asin)} />
                                    <MenuItem primaryText="Add Links" onClick={() => this.handleAddLinks(item.asin)} />
                                    <MenuItem primaryText="Add Other Prices" onClick={() => this.handleAddOtherPrices(item.asin)} />
                                </IconMenu>
                            );
                        }.bind(this))}
                    </div>
                </div>
            </div>
        );
    }
});

export default ProductItems;