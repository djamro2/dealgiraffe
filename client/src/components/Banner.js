
import React from 'react';

const styles = {
    banner: {
        maxHeight: '3rem',
        padding: '.5rem 0'
    },
    bannerImg: {
        maxHeight: '3rem'
    }
};

export default class Banner extends React.Component {
    render() {
        return (
            <div className="banner" style={styles.banner}>
                <img src="/client/images/dealGiraffeLogo.png" alt="brand image" style={styles.bannerImg} />
            </div>
        );
    }
};