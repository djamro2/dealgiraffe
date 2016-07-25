
import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import QueryItems from './QueryItems'
import AddItemDialog from './RaisedInputDialog';

const styles = {
    buttonRow: {
        paddingTop: '15px',
        textAlign: 'right'
    },
    container: {
        padding: '1rem',
        marginTop: '2rem'
    }
};

const QueryModule = React.createClass({
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
            <Paper zDepth={2} style={styles.container}>
                <QueryItems />
                <div style={styles.buttonRow}>
                    <RaisedButton
                        label="Add Query"
                        primary={true}
                        onTouchTap={this.handleOpen}
                    />
                </div>
            </Paper>
        );
    }

});

export default QueryModule;
