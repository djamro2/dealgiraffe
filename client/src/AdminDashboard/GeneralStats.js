
import React from 'react';
import Divider from 'material-ui/Divider';
import formatDate from '../lib/formatDate';

const styles = {
    styleContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    styleLeft: {
        paddingRight: '10px',
        flexGrow: 1
    },
    styleRight: {
        paddingLeft: '10px',
        flexGrow: 1
    }
};

// given size in bytes, return as mb
const formatSize = function(size) {
    return parseFloat(size * .000001).toFixed(2);
};

const GeneralStats = React.createClass({

    componentWillMount: function() {
        this.setState({
            totalProducts: 0,
            last_time_updated: "",
            totalViewsDay: 0,
            totalViewsWeek: 0,
            dbSize: 0
        });
    },
    componentDidMount: function() {
        var serverResponse = $.get("/api/GetAllProductInfo", function(response){
            this.setState({
                totalProducts: response.totalProducts,
                lastTimeUpdated: formatDate(response.lastTimeUpdated, "MM/DD/YYYY h:mma"),
                dbSize: (String(formatSize(response.dbSize)) + 'MB')
            });
        }.bind(this));
    },
    render: function() {
        return (
            <div style={styles.styleContainer}>
                <div style={styles.styleLeft}>
                    <p>Total Items: {this.state.totalProducts} </p>
                    <Divider />
                    <p>Last Run Time: {this.state.lastTimeUpdated} </p>
                    <Divider />
                    <p>Page Views Today: {this.state.totalViewsDay} </p>
                    <Divider />
                    <p>Page Views This Week: {this.state.totalViewsWeek} </p>
                </div>
                <div style={styles.styleRight}>
                    <p>Database Size: {this.state.dbSize} </p>
                    <Divider />
                </div>
            </div>
        );
    }
    
});

export default GeneralStats;