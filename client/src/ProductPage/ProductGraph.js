
import React from 'react';
import Paper from 'material-ui/Paper';

class ProductGraph extends React.Component {

    // TODO: default props

    componentDidMount() {
        // init graph after component mounted
        if (this.props.product) {
            initGraphData(this.props.product);
        } else {
            console.warn('No product props in ProductGraph, graph will not be shown')
        }
    }

    render() {
        return (
            <Paper>
                <h2 className="module-title">Price Graph</h2>
                <div className="price-graph-container">
                    <svg id="price-graph"></svg>
                </div>
            </Paper>
        );
    }
}

export default ProductGraph;