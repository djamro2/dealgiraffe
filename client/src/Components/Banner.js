
import React from 'react';

const styles = {};

export default class Banner extends React.Component {

    componentWillMount() {
        if (this.props.style) {
            styles.parentStyles = this.props.style;
        }
    }

    render() {
        return (
            <div className="banner" style={styles.parentStyles}>
                <img src="/client/images/dealGiraffeLogo.png" alt="brand image" />
            </div>
        );
    }
};