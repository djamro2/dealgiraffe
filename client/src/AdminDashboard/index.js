
/*
 * This component deals with putting everything together for the final AdminDashboard
 */

import React from 'react';
import AdminNavbar from './AdminNavbar';
import PaperModule from './PaperModule';

const styles = {
    margin: 'auto',
    maxWidth: '960px'
};

const AdminDashboardApp = React.createClass({

    render: function() {
        return (
            <div className="center-column" style={styles}>
                <AdminNavbar />
                <PaperModule moduleName="General Stats" />
                <PaperModule moduleName="Query Controls" />
                <PaperModule moduleName="Product Controls" />
            </div>
        );
    }

});

export default AdminDashboardApp;
