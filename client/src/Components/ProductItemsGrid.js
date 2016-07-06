
import React from 'react';
import ProductCard from './ProductCard';

const styles = {};

class ProductItemsGrid extends React.Component {
    render() {
        var products = this.props.products;
        return (
            <ul className="product-items">
                {products.map(function(product, i){
                    return (
                        <li key={i}>
                            <ProductCard
                                product={product}
                            />
                        </li>
                    );
                }.bind(this))}
            </ul>
        );
    }
}

export default ProductItemsGrid;