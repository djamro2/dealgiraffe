
import React from 'react';

class ProductItems extends React.Component {
    render() {
        var items = this.props.items;
        return (
            <ul className="product-items">
                {items.map(function(item, i){
                    return (
                        <li key={i}>
                            {item.title}
                        </li>
                    );
                }.bind(this))}
            </ul>
        );
    }
}

export default ProductItems;