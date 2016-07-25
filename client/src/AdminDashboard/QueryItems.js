
import React from 'react';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconButton from 'material-ui/IconButton';
import formatDate from './../lib/formatDate';

const styles = {
    tableFlex: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        overflowX: 'scroll',
        overflowY: 'hidden',
        paddingBottom: '10px'
    },
    tableFlexColumn: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start'
    },
    tableFlexColumnItem: {
        padding: '12px 20px',
        borderBottom: '1px solid rgb(230, 230, 230)',
        textAlign: 'center',
        whiteSpace: 'nowrap'
    }
};

const maxLength = function(text, limit) {
    if (text.length <= limit) {
        return text;
    }
    var nextText = text.substring(0, limit);
    nextText += "...";
    return nextText;
};

// return none if last day is 1969, otherwise format correctly date
const getFormattedDate = function(date, format) {
    var dateObj = new Date(date);
    if ( !isNaN(dateObj.getFullYear()) && dateObj.getFullYear() === 1969) {
        return "none";
    }
    return formatDate(date, format);
};

// convert a bool to its english translation
const toEnglish = function(bool) {
    if (!bool || bool==="" || bool==false)
        return "no";
    return "yes";
};

const QueryItems = React.createClass({
    handleDelete: function(id) {
        $.ajax({
            type: "DELETE",
            url: "/api/DeleteQueueItem",
            data: {id: id},
            success: function(result) {

                var oldQueueItems = this.state.queueItems;
                var newQueueItems = [];
                for (var i = 0; i < oldQueueItems.length; i++) {
                    if (oldQueueItems[i]._id === result._id) {
                        oldQueueItems.splice(i, 1);
                        newQueueItems = oldQueueItems;
                        break;
                    }
                }

                this.setState({
                    queueItems: newQueueItems
                });
            }.bind(this)
        });
    },
    
    handleTogglePause: function(id) {
        $.ajax({
            type: "POST",
            url: "/api/TogglePauseQueueItem",
            data: {id: id},
            success: function(result) {

                var oldQueueItems = this.state.queueItems;
                var newQueueItems = [];
                for (var i = 0; i < oldQueueItems.length; i++) {
                    if (oldQueueItems[i]._id === result._id) {
                        oldQueueItems[i].paused = result.paused;
                        newQueueItems = oldQueueItems;
                        break;
                    }
                }

                this.setState({
                    queueItems: newQueueItems
                });
            }.bind(this)
        });
    },
    
    componentWillMount: function() {
        this.setState({
            queueItems: [
                {searchQuery:'loading...'}
            ]
        });
    },
    
    componentDidMount: function() {
        var serverResponse = $.get("/api/GetAllQueueItems", function(response){
            this.setState({
                queueItems: response
            });
        }.bind(this));  
    },
    
    render: function() {
        return (
            <div className="table-container">
                <div className="table-flex" style={styles.tableFlex}>
                    <div className="table-flex-column" style={styles.tableFlexColumn}>
                        <div className="table-flex-column-item table-flex-title" style={styles.tableFlexColumnItem}>Search Query</div>
                        {this.state.queueItems.map(function(item, i){
                            return (
                                <div key={item._id}
                                     className={ (i === (this.state.queueItems.length-1) ? "no-border-bottom" : "") }
                                     style={styles.tableFlexColumnItem}
                                >
                                    { maxLength(item.searchQuery, 25) }
                                </div>
                            );
                        }.bind(this))}
                    </div>

                    <div className="table-flex-column" style={styles.tableFlexColumn}>
                        <div className="table-flex-column-item table-flex-title" style={styles.tableFlexColumnItem}>Search Index</div>
                        {this.state.queueItems.map(function(item, i){
                            return (
                                <div key={item._id}
                                     className={ (i === (this.state.queueItems.length-1) ? "no-border-bottom" : "") }
                                     style={styles.tableFlexColumnItem}>
                                    {item.searchIndex}
                                </div>
                            );
                        }.bind(this))}
                    </div>

                    <div className="table-flex-column" style={styles.tableFlexColumn}>
                        <div className="table-flex-column-item table-flex-title" style={styles.tableFlexColumnItem}>Category</div>
                        {this.state.queueItems.map(function(item, i){
                            return (
                                <div key={item._id}
                                     className={ (i === (this.state.queueItems.length-1) ? "no-border-bottom" : "") }
                                     style={styles.tableFlexColumnItem}>
                                    {item.category}
                                </div>
                            );
                        }.bind(this))}
                    </div>

                    <div className="table-flex-column" style={styles.tableFlexColumn}>
                        <div className="table-flex-column-item table-flex-title" style={styles.tableFlexColumnItem}>Current Page</div>
                        {this.state.queueItems.map(function(item, i){
                            return (
                                <div key={item._id}
                                     className={ (i === (this.state.queueItems.length-1) ? "no-border-bottom" : "") }
                                     style={styles.tableFlexColumnItem}>
                                    {item.currentPage}
                                </div>
                            );
                        }.bind(this))}
                    </div>

                    <div className="table-flex-column" style={styles.tableFlexColumn}>
                        <div className="table-flex-column-item table-flex-title" style={styles.tableFlexColumnItem}>Last Run Time</div>
                        {this.state.queueItems.map(function(item, i){
                            return (
                                <div key={item._id}
                                     className={ (i === (this.state.queueItems.length-1) ? "no-border-bottom" : "") }
                                     style={styles.tableFlexColumnItem}>
                                    {getFormattedDate(item.lastRunTime, "MM/DD h:mma")}
                                </div>
                            );
                        }.bind(this))}
                    </div>

                    <div className="table-flex-column" style={styles.tableFlexColumn}>
                        <div className="table-flex-column-item table-flex-title" style={styles.tableFlexColumnItem}>Paused?</div>
                        {this.state.queueItems.map(function(item, i){
                            return (
                                <div key={item._id}
                                     className={ (i === (this.state.queueItems.length-1) ? "no-border-bottom" : "") }
                                     style={styles.tableFlexColumnItem}>
                                    {toEnglish(item.paused)}
                                </div>
                            );
                        }.bind(this))}
                    </div>

                    <div className="table-flex-column" style={styles.tableFlexColumn}>
                        <div className="table-flex-column-item table-flex-title" style={styles.tableFlexColumnItem}>Actions</div>
                        {this.state.queueItems.map(function(item, i){
                            return (
                                <IconMenu
                                    key={item._id}
                                    className={ (i === (this.state.queueItems.length-1) ? "no-border-bottom table-icon-menu" : "table-icon-menu") }
                                    iconButtonElement={
                                        <IconButton><MoreVertIcon/></IconButton>
                                    }
                                    targetOrigin={{horizontal: 'right', vertical: 'top'}}
                                    anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                                >
                                    <MenuItem primaryText="Pause" onClick={() => this.handleTogglePause(item._id)} />
                                    <MenuItem primaryText="Delete" onClick={() => this.handleDelete(item._id)}/>
                                </IconMenu>
                            );
                        }.bind(this))}
                    </div>
                </div>
            </div>
        );
    }
});

export default QueryItems;