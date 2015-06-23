'use strict';
require('babel/register');


if (process.env.NODE_ENV === 'production') {
    console.log('enabling newrelic service');
    require('newrelic');
}


process.chdir(__dirname);
require('app-module-path').addPath(process.cwd());

require('./server-start');