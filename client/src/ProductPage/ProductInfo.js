
import React from 'react';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

import formatPrice from '../lib/formatPrice';

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
            text: (pretext + formatPrice(priceObj.price))
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

function ProductText({classChild, bulletPoints, summary, link}) {
    var summaryObj = {
        __html: summary
    };

    return (
        <div className={classChild}>
            <p className="summary" dangerouslySetInnerHTML={summaryObj}></p>
            <ul>
                {bulletPoints.map(function(item, i){
                    return (
                        <li key={i}>{item}</li>
                    );
                }.bind(this))}
            </ul>
            <div className="read-more-container">
                <a href={link}>
                    <RaisedButton label="Read More" primary={true} style={styles.readMoreStyle} />
                </a>
            </div>
        </div>
    );
}

class ProductInfo extends React.Component {

    render() {

        var product, productImage, productTitle, bulletPoints, summary, prices, link;

        try {
            product = this.props.product;
            productImage = product.large_data.LargeImage.URL;
            productTitle = product.large_data.ItemAttributes.Title;
            bulletPoints = product.large_data.ItemAttributes.Feature;
            summary = product.large_data.EditorialReviews.EditorialReview.Content;
            link = product.large_data.DetailPageURL;
            prices = getPricingInfo(product);
        } catch (e) {
            console.error(e);
        }

        return (
            <Paper zDepth={2}>
                <div className="product-content-container">
                    <Card className="card">
                        <a href={link}>
                            <CardMedia overlay={<CardTitle title={productTitle} />} >
                                <img src={productImage} />
                            </CardMedia>
                        </a>
                    </Card>
                    <div className="product-info">
                        <div className="prices-container">
                            {prices.map(function(item, i) {
                                return (
                                    <span className="price" key={item.label}>{item.text}</span>
                                );
                            }.bind(this))}
                        </div>
                        <ProductText
                            classChild="product-text-right"
                            summary={summary}
                            bulletPoints={bulletPoints}
                            link={link}
                        />
                    </div>
                </div>
                <ProductText
                    classChild="product-text-bottom"
                    summary={summary}
                    bulletPoints={bulletPoints}
                    link={link}
                />
            </Paper>
        );
    }
}

export default ProductInfo;
