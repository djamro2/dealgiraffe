
import React from 'react';
import Paper from 'material-ui/Paper';
import truncateText from './../lib/truncateText';

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
    title: {
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
    },
    price: {
        position: 'absolute',
        top: 0,
        right: 0,
        padding: '.35rem .5rem',
        fontWeight: '600',
        backgroundColor: 'rgba(0, 188, 212, .8)',
        borderBottomLeftRadius: '5px',
        borderLeft: '1px solid black',
        borderBottom: '1px solid black'
    }
};

class ProductCard extends React.Component {
    render () {
        var product = this.props.product;
        var title = truncateText(product.title, 50);
        return (
            <Paper style={styles.card} zDepth={2} >
                <span style={styles.price}>
                    {product.priceFormatted}
                </span>
                <a href={product.pageURL} style={styles.imgLink}>
                    <img style={styles.img} src={product.image} alt={product.title} />
                </a>
                <span style={styles.title}>
                    <a href={product.pageURL} style={styles.titleLink}>{title}</a>
                </span>
            </Paper>
        );
    }
}

export default ProductCard;
