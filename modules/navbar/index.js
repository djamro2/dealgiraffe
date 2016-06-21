/**
 * Created by djamr on 5/26/2016.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Navbar from './lib/Navbar';

injectTapEventPlugin();
ReactDOM.render(<Navbar />, document.getElementById('app'));