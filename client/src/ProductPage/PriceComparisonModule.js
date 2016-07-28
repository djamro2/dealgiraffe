
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

// return an object featuring all of the other prices with extra attributes
const parseOtherPrices = function(product) {
	var otherPrices = product.OtherPrices;
	for (var i = 0; i < otherPrices.length; i++) {
		if (otherPrices[i].url.indexOf('bestbuy') > -1) {
			otherPrices[i].store = 'Best Buy';
		} else if (otherPrices[i].url.indexOf('amazon') > -1) {
			otherPrices[i].store = 'Amazon';
		} else if (otherPrices[i].url.indexOf('newegg') > -1) {
			otherPrices[i].store = 'Newegg';
		} else if (otherPrices[i].url.indexOf('walmart') > -1) {
			otherPrices[i].store = 'Walmart';
		} else if (otherPrices[i].url.indexOf('target') > -1) {
			otherPrices[i].store = 'Target';
		} else if (otherPrices[i].url.indexOf('ebay') > -1) {
			otherPrices[i].store = 'Ebay';
		}
	}

	return otherPrices;
};

class PriceComparisonModule extends React.Component {
	render() {
		var product = this.props.product;
		if (!product || !product.OtherPrices) {
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
								<td><a href={priceObj.url}>Link</a></td>
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