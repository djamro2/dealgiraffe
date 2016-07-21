
import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import QueryTable from './QueryTable'
import AddItemDialog from './AddItemDialog';

const styles = {
    buttonRow: {
        paddingTop: '15px',
        textAlign: 'right'
    }
};

const QueryControls = React.createClass({
    handleOpen: function(){
        this.setState(
            {openDialog: true}
        );
    },
    
    componentWillMount: function() {
        this.setState({
            openDialog: false
        });
    },
    
    render: function() {
        return (
            <div>
                <QueryTable />
                <div style={styles.buttonRow}>
                    <RaisedButton
                        label="Add Query"
                        primary={true}
                        onTouchTap={this.handleOpen}
                    />
                </div>
                <AddItemDialog
                    title="Add Query"
                    open={this.state.openDialog}
                />
            </div>
        );
    }

});

export default QueryControls;
