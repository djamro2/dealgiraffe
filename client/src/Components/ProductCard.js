
import React from 'react';
import Paper from 'material-ui/Paper';

const styles = {
    card: {
        width: '100%',
        height: '100%',
        padding: '.5rem',
        position: 'relative'
    },
    img: {
        width: 'inherit'
    },
    imgLink: {
        width: 'inherit'
    },
    titleSpan: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        padding: '.5rem',
        backgroundColor: 'rgba(150, 150, 150, .2)'
    },
    titleLink: {
        textDecoration: 'none',
        color: 'black',
        fontWeight: 600
    }
};

// titles longer than maxLimit or 30 should be taken as a substring and have '...' added on the end
const truncateTitle = function(title, maxLimit) {
    var result = title;
    var defaultLimit = 30;
    if (title.length > (maxLimit || defaultLimit)) {
        result = title.substring(0, (maxLimit || defaultLimit));
        result += '...';
    }
    return result;
};

class ProductCard extends React.Component {
    render () {
        var product = this.props.product;
        var title = truncateTitle(product.title, 50);
        return (
            <Paper style={styles.card} zDepth={2} >
                <a href={product.pageURL} style={styles.imgLink}>
                    <img style={styles.img} src={product.image} alt={product.title} />
                </a>
                <span style={styles.titleSpan}>
                    <a href={product.pageURL} style={styles.titleLink}>{title}</a>
                </span>
            </Paper>
        );
    }
}

export default ProductCard;
