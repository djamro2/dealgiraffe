import React from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconButton from 'material-ui/IconButton';

const ProductTable = React.createClass({

    componentWillMount: function() {
        this.setState({
            selectable: false,
            height: '300px'
        });
    },

    render: function() {
        return (
            <Table
                height={this.state.height}
                selectable={this.state.selectable}
                style={{overflow: 'scroll'}}
            >
                <TableHeader>
                    <TableRow>
                        <TableHeaderColumn>Product Name</TableHeaderColumn>
                        <TableHeaderColumn>Last Time Updated</TableHeaderColumn>
                        <TableHeaderColumn>Page Views</TableHeaderColumn>
                        <TableHeaderColumn>Created</TableHeaderColumn>
                        <TableHeaderColumn>Actions</TableHeaderColumn>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableRowColumn>Radeon Something</TableRowColumn>
                        <TableRowColumn>05/28 4:30pm</TableRowColumn>
                        <TableRowColumn>230</TableRowColumn>
                        <TableRowColumn>05/22 12:00pm</TableRowColumn>
                        <TableRowColumn>
                            <IconMenu
                                iconButtonElement={
                                    <IconButton><MoreVertIcon/></IconButton>
                                }
                                targetOrigin={{horizontal: 'right', vertical: 'top'}}
                                anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                            >
                                <MenuItem primaryText="Front Page"/>
                                <MenuItem primaryText="Hide"/>
                                <MenuItem primaryText="Delete"/>
                            </IconMenu>
                        </TableRowColumn>
                    </TableRow>
                    <TableRow>
                        <TableRowColumn>nVidia</TableRowColumn>
                        <TableRowColumn>05/28 5:00pm</TableRowColumn>
                        <TableRowColumn>2,000</TableRowColumn>
                        <TableRowColumn>05/22 12:05pm</TableRowColumn>
                        <TableRowColumn>
                            <IconMenu
                                iconButtonElement={
                                    <IconButton><MoreVertIcon/></IconButton>
                                }
                                targetOrigin={{horizontal: 'right', vertical: 'top'}}
                                anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                            >
                                <MenuItem primaryText="Front Page"/>
                                <MenuItem primaryText="Hide"/>
                                <MenuItem primaryText="Delete"/>
                            </IconMenu>
                        </TableRowColumn>
                    </TableRow>
                </TableBody>
            </Table>
        );
    }

});

export default ProductTable;