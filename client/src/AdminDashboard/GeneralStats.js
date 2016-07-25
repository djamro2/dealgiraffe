
import React from 'react';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import numeral from 'numeral';
import formatDate from '../lib/formatDate';

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: '1rem',
        marginTop: '2rem'
    },
    leftStats: {
        paddingRight: '10px',
        flexGrow: 1
    },
    rightStats: {
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
        $.get("/api/GetAllProductInfo", function(response){
            this.setState({
                totalProducts: response.totalProducts,
                lastTimeUpdated: formatDate(response.lastTimeUpdated, "MM/DD/YYYY h:mma"),
                dbSize: (String(formatSize(response.dbSize)) + 'MB'),
                cycleTime: response.cycleTime
            });
        }.bind(this));
    },

    render: function() {
        if (!this.state) {
            return false;
        }

        return (
            <Paper zDepth={2} style={styles.container}>
                <div style={styles.leftStats}>
                    <p>Total Items: {this.state.totalProducts} </p>
                    <Divider />
                    <p>Last Run Time: {this.state.lastTimeUpdated} </p>
                    <Divider />
                    <p>Page Views Today: {this.state.totalViewsDay} </p>
                    <Divider />
                    <p>Page Views This Week: {this.state.totalViewsWeek} </p>
                </div>
                <div style={styles.rightStats}>
                    <p>Database Size: {this.state.dbSize} </p>
                    <Divider />
                    <p>Cycle Time: {numeral(Number(this.state.cycleTime)).format('0,0')}ms</p>
                    <Divider />
                </div>
            </Paper>
        );
    }
});

export default GeneralStats;