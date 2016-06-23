
import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';

class SearchBox extends React.Component {
    render() {
        return(
            <div className="search-box">
                <input type="text" placeholder="Search items" />
                <RaisedButton className='search-button' label="Search" primary={true} />
            </div>
        );
    }
}

export default SearchBox;