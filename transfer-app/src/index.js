import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import DownloadPage from './DownloadPage';
import NotFoundPage from './NotFoundPage';

// import routes from './routes';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './index.css';

import * as serviceWorker from './serviceWorker';

ReactDOM.render(
    (
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={App} />
                <Route exact path="/transfer/*" component={DownloadPage} />
                <Route path="*" component={NotFoundPage} />
            </Switch>
        </BrowserRouter>
    ),
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
