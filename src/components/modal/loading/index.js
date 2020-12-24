'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

import LoadingContainer from './container.js';

let div = document.createElement('div');
div.className = 'virtual-modal';
document.body.appendChild(div);

const Help = ReactDOM.render(<LoadingContainer />, div);

const Loading = function () { };
Loading.show = Help.show;
Loading.close = Help.close;

module.exports = Loading;
