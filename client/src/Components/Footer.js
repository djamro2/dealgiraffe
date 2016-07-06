
import React from 'react';

const footerItems = [
    {title: 'email: contact@dealgiraffe.com'},
    {title: 'About', link: '/about'},
    {title: 'Copyright 2016 DealGiraffe'}
];

const styles = {
    componentStyles: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        margin: 0,
        height: '5vh',
        lineHeight: '5vh'
    }
};

// renders a horizontal list of text from footerItems
class Footer extends React.Component {
    render () {
        return (
            <ul className="footer" style={styles.componentStyles}>
                {footerItems.map(function(item, i){
                    if (i !== 0) {
                        if (item.link) {
                            return <li key={i}>&bull; <a href={item.link}><span className="text">{item.title}</span></a></li>
                        }
                        return <li key={i}>&bull;<span className="text">{item.title}</span></li>
                    }
                    if (item.link) {
                        return <li key={i}><a href={item.link}><span className="text">{item.title}</span></a></li>
                    }
                    return <li key={i}><span className="text">{item.title}</span></li>
                }.bind(this))}
            </ul>
        );
    }
}

export default Footer;
