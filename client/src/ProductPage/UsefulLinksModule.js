
import React from 'react';
import Paper from 'material-ui/Paper';

const styles = {
	container: {
		padding: '1rem',
		marginTop: '2rem'
	},
	list: {
		marginTop: 0,
		fontWeight: '600'
	},
	title: {
		margin: 0
	}
};

class UsefulLinksModule extends React.Component {
	render() {
		var product = this.props.product;
		if (!product || !product.UsefulLinks || product.UsefulLinks.length === 0) {
			return null;
		}

		return (
			<Paper zDepth={2} style={styles.container}>
				<h2 style={styles.title} className="module-title">Helpful Links</h2>
				<ul style={styles.list}>
				{product.UsefulLinks.map(function(link, i) {
					return (
						<li key={i} className="no-link-underline">
							<a href={link.url}>{link.title}</a>
						</li>
					);
				}.bind(this))}
				</ul>
			</Paper>
		);
	}
}

export default UsefulLinksModule;