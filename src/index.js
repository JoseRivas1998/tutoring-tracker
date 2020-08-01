import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.css';

import App from './containers/App/App';

const app = (<App/>);

const browserRouter = (<BrowserRouter>{app}</BrowserRouter>);

ReactDOM.render(browserRouter, document.getElementById('root'));
