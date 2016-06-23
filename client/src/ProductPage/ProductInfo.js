
import React from 'react';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import numeral from 'numeral';

// helper to convert number info currency
const getFormattedPrice = function(price){
    if (!price || isNaN(price)) {
        return "$0.00";
    }
    var updatedPrice = (Number(price)/100);
    return numeral(updatedPrice).format('$0,0.00');
};

// return an array of all the available prices
const getPricingInfo = function(product) {
    var result = [];
    var addPrice = function(label, priceObj, pretext) {
        if (!priceObj.price) {
            return;
        }
        result.push({
            label: label,
            price: priceObj.price,
            date: priceObj.date,
            text: (pretext + getFormattedPrice(priceObj.price))
        });
    };

    if (product.price_amazon_new && product.price_amazon_new.length){
        addPrice('amazonNew', product.price_amazon_new[product.price_amazon_new.length-1], '');
    }
    if (product.price_third_new && product.price_third_new.length){
        addPrice('thirdNew', product.price_third_new[product.price_third_new.length-1], '3rd Party New: ');
    }
    if (product.price_third_used && product.price_third_used.length){
        addPrice('thirdUsed', product.price_third_used[product.price_third_used.length-1], '3rd Party Used: ');
    }

    return result;
};

const styles = {
    readMoreStyle: {
        minWidth: '50%'
    }
};

function ProductText({classChild, bulletPoints, summary}) {
    return (
        <div className={classChild}>
            <p className="summary">{summary}</p>
            <ul>
                {bulletPoints.map(function(item, i){
                    return (
                        <li key={i}>{item}</li>
                    );
                }.bind(this))}
            </ul>
            <div className="read-more-container">
                <RaisedButton label="Read More" primary={true} style={styles.readMoreStyle} />
            </div>
        </div>
    );
}

class ProductInfo extends React.Component {

    // 'massage' data in product and set to state
    parseProduct(product) {
        this.setState({
            product: product,
            productImage: product.large_data.LargeImage.URL,
            productTitle: product.large_data.ItemAttributes.Title,
            bulletPoints: product.large_data.ItemAttributes.Feature,
            summary: product.large_data.EditorialReviews.EditorialReview.Content,
            prices: getPricingInfo(product)
        });
    }

    constructor(props) {
        super(props);
        this.state = {
            product: {},
            productImage: "",
            productTitle: "",
            bulletPoints: [],
            summary: "",
            prices: []
        }
    }

    componentWillMount() {
        this.parseProduct(this.props.product);
    }

    render() {
        return (
            <Paper zDepth={2}>
                <div className="product-content-container">
                    <Card className="card">
                        <CardMedia overlay={<CardTitle title={this.state.productTitle} />} >
                            <img src={this.state.productImage} />
                        </CardMedia>
                    </Card>
                    <div className="product-info">
                        <div className="prices-container">
                            {this.state.prices.map(function(item, i) {
                                return (
                                    <span className="price" key={item.label}>{item.text}</span>
                                );
                            }.bind(this))}
                        </div>
                        <ProductText
                            classChild="product-text-right"
                            summary={this.state.summary}
                            bulletPoints={this.state.bulletPoints}/>
                    </div>
                </div>
                <ProductText
                    classChild="product-text-bottom"
                    summary={this.state.summary}
                    bulletPoints={this.state.bulletPoints}/>
            </Paper>
        );
    }
}

export default ProductInfo;
