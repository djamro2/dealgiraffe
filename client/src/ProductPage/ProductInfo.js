
import React from 'react';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import formatPrice from '../lib/formatPrice';
import truncateText from '../lib/truncateText';

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
    seeMore: {
        minWidth: '50%'
    },
    readMore: {
        color: 'rgb(0, 188, 212)',
        cursor: 'pointer',
        paddingLeft: '.5rem'
    }
};

function ProductText({classChild, bulletPoints, link, summary, summaryLimit}) {
    summary = truncateText(summary, summaryLimit);
    var summaryObj = {
        __html: summary
    };

    var bulletPointsMarkup;
    if (bulletPoints) {
        bulletPointsMarkup = (
            <ul>
                {bulletPoints.map(function(item, i){
                    return (
                        <li key={i}>{item}</li>
                    );
                }.bind(this))}
            </ul>
        )
    }

    var readMore;
    if (summaryLimit !== -1 && (summary.length >= summaryLimit)) {
        readMore = <span onClick={this.showAllSummary} style={styles.readMore}>read more</span>;
    }

    return (
        <div className={classChild}>
            <span className="summary" dangerouslySetInnerHTML={summaryObj} />
            {readMore}
            <br/>
            {bulletPointsMarkup}
            <div className="read-more-container">
                <a href={link}>
                    <RaisedButton label="See More" primary={true} style={styles.seeMore} />
                </a>
            </div>
        </div>
    );
}

class ProductInfo extends React.Component {
    // clicked 'read more', set the summaryLimit to -1 (meaning no limit)
    showAllSummary(){
        this.setState({
            summaryLimit: -1
        });
    }

    constructor(props) {
        super(props);
        this.state = {
            summaryLimit: 350
        };
        this.showAllSummary = this.showAllSummary.bind(this);
        ProductText = ProductText.bind(this);
    }
    
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

        // truncate title
        if (productTitle) {
            //productTitle = truncateText(productTitle, 70); // works, but need to have truncateText end at words
        }

        return (
            <Paper zDepth={2}>
                <div className="product-content-container">
                    <Paper zDepth={2} className="card">
                        <a href={link}>
                            <CardMedia overlay={<CardTitle title={productTitle} />} >
                                <img src={productImage} />
                            </CardMedia>
                        </a>
                    </Paper>
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
                            summaryLimit={this.state.summaryLimit}
                        />
                    </div>
                </div>
                <ProductText
                    classChild="product-text-bottom"
                    bulletPoints={bulletPoints}
                    link={link}
                    summary={summary}
                    summaryLimit={this.state.summaryLimit}
                />
            </Paper>
        );
    }
}

export default ProductInfo;
