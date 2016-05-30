
import React from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconButton from 'material-ui/IconButton';
import formatDate from './../lib/formatDate';

const toEnglish = function(bool) {
    if (!bool || bool==="" || bool==false)
        return "no";
    return "yes";
};

const QueryTable = React.createClass({

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
            selectable: false,
            height: '300px',
            queueItems: [
                {searchQuery:'loading...'}
            ]
        });
    },
    componentDidMount: function() {
        $('.mui-body-table').css('overflow-x', 'auto');
        var serverResponse = $.get("/api/GetAllQueueItems", function(response){
            this.setState({
                queueItems: response
            });
        }.bind(this));  
    },
    render: function() {
        return (
            <Table
                height={this.state.height}
                selectable={this.state.selectable}
                bodyStyle={{width: '-fit-content'}}
            >
                <TableHeader>
                    <TableRow>
                        <TableHeaderColumn>Search Query</TableHeaderColumn>
                        <TableHeaderColumn>Search Index</TableHeaderColumn>
                        <TableHeaderColumn>Category</TableHeaderColumn>
                        <TableHeaderColumn>Current Page</TableHeaderColumn>
                        <TableHeaderColumn>Last Run Time</TableHeaderColumn>
                        <TableHeaderColumn>Paused?</TableHeaderColumn>
                        <TableHeaderColumn>Actions</TableHeaderColumn>
                    </TableRow>
                </TableHeader>
                <TableBody>

                    {this.state.queueItems.map(function(item) {

                        return (
                            <TableRow key={item._id}>
                                <TableRowColumn>{item.searchQuery}</TableRowColumn>
                                <TableRowColumn>{item.searchIndex}</TableRowColumn>
                                <TableRowColumn>{item.category}</TableRowColumn>
                                <TableRowColumn>{item.currentPage}</TableRowColumn>
                                <TableRowColumn>{formatDate(item.lastRunTime, "MM/DD h:mma")}</TableRowColumn>
                                <TableRowColumn>{toEnglish(item.paused)}</TableRowColumn>
                                <TableRowColumn>
                                    <IconMenu
                                        iconButtonElement={
                                            <IconButton><MoreVertIcon/></IconButton>
                                        }
                                        targetOrigin={{horizontal: 'right', vertical: 'top'}}
                                        anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                                    >
                                        <MenuItem primaryText="Pause" onClick={() => this.handleTogglePause(item._id)} />
                                        <MenuItem primaryText="Delete" onClick={() => this.handleDelete(item._id)}/>
                                    </IconMenu>
                                </TableRowColumn>
                            </TableRow>
                        );

                    }.bind(this) )};

                </TableBody>
            </Table>
        );
    }

});

export default QueryTable;