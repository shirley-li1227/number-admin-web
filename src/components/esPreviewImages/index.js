


import React from 'react';
import ReactDOM from 'react-dom';

import Preview from './preview';

let div = document.createElement('div');
document.body.appendChild(div);

const reactDOM = ReactDOM.render(<Preview />, div);

const ESPreview = function(){};

ESPreview.open = reactDOM.open;

module.exports = ESPreview;
