
import React from 'react';
import Paper from 'material-ui/Paper';

const styles = {
    container: {
        padding: '.5rem 1rem'
    }
};

class Info extends React.Component {
    render() {
        return (
            <Paper style={styles.container} zDepth={2}>
                <p>
                    DealGiraffe is an up and coming shopping resource meant to serve
                    as a utility for online shopping.
                </p>
                <p>
                    For and questions or comments, please email&nbsp;
                    <a href="mailto:contact@dealgiraffe.com" target="_top">
                        contact@dealgiraffe.com
                    </a>
                </p>
            </Paper>
        );
    }
}

export default Info;