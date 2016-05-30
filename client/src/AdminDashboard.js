/**
 * Created by djamr on 5/27/2016.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import AdminDashboardApp from './AdminDashboard/';

injectTapEventPlugin(); /* remove this after React 1.0 comes out */
ReactDOM.render(
    <AdminDashboardApp />,
    document.getElementById('app')
);