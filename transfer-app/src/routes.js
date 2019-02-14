import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import App from './App';
import DownloadPage from './DownloadPage'

export default (
    <BrowserRouter>
        <Route path="/" component={App} />
        <Route path="/transfers/" component={DownloadPage} />
    </BrowserRouter>
);
