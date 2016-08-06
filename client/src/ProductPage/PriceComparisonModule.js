
import React from 'react';
import Paper from 'material-ui/Paper';

const styles = {
	container: {
		padding: '1rem',
		marginTop: '2rem'
	},
	table: {
		margin: 'auto'
	},
	title: {
		margin: 0
	}
};

// specific function for pulling the name out of the url. May be special cases
const getStoreName = function(url) {
	var store = '';
	if (!url) {
		return store;
	}

	// special cases (name is different than url)
	if (url.indexOf('bestbuy') > -1) {
		return 'Best Buy';
	}

	var endingIndex = -1;
	var domainTypes = ['.com', '.net', '.io', '.co.uk', '.org'];
	for (var i = 0; (i < domainTypes.length) && (endingIndex === -1); i++) {
		endingIndex = url.indexOf(domainTypes[i]);
	}

	// sanity check
	if (endingIndex === -1) {
		return store;
	}

	var startingIndex = endingIndex-1;
	while(url.charAt(startingIndex) !== '.' && startingIndex !== 0) {
		startingIndex--;
	}
	store = url.substring(startingIndex+1, endingIndex);
	store = store.charAt(0).toUpperCase() + store.slice(1);

	return store;
};

// return an object featuring all of the other prices with extra attributes
const parseOtherPrices = function(product) {
	var otherPrices = product.OtherPrices;
	for (var i = 0; i < otherPrices.length; i++) {
		otherPrices[i].store = getStoreName(otherPrices[i].url);
	}
	return otherPrices;
};

class PriceComparisonModule extends React.Component {
	render() {
		var product = this.props.product;
		if (!product || !product.OtherPrices || product.OtherPrices.length === 0) {
			return null;
		}

		var otherPrices = parseOtherPrices(product);
		return (
			<Paper zDepth={2} style={styles.container}>
				<h2 style={styles.title} className="module-title">Price Comparison</h2>
				<table className="price-comparison-table">
					<thead>
						<tr>
							<th>Store</th>
							<th>Price</th>
							<th>Product Link</th>
						</tr>
					</thead>
					<tbody>
					{otherPrices.map(function(priceObj, i) {
						return (
							<tr key={i}>
								<td>{priceObj.store}</td>
								<td>{priceObj.price}</td>
								<td><a href={priceObj.url} className="product-comparison-link">Link</a></td>
							</tr>
						);
					}.bind(this))}
					</tbody>
				</table>
			</Paper>
		)
	}
}

export default PriceComparisonModule;