
import React from 'react';
import GeneralStats from './GeneralStats';
import QueryControls from './QueryControls';
import ProductControls from './ProductControls';

const ModuleContent = React.createClass({

    render: function() {

        switch (this.props.moduleType) {
            case "General Stats":
                return <GeneralStats />;
            case "Query Controls":
                return <QueryControls />;
            case "Product Controls":
                return <ProductControls />;
        }

    }

});

export default ModuleContent;
