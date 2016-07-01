
import React from 'react';
import Paper from 'material-ui/Paper';

const styles = {
    paperStyles: {
        width: '100%',
        height: '100%',
        padding: '.5rem'
    }
};

class ProductItems extends React.Component {
    render() {
        var items = this.props.items;
        return (
            <ul className="product-items">
                {items.map(function(item, i){
                    return (
                        <li key={i}>
                            <Paper zDepth={2} style={styles.paperStyles}>
                                {item.title}
                            </Paper>
                        </li>
                    );
                }.bind(this))}
            </ul>
        );
    }
}

export default ProductItems;