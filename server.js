require("babel-register");
require('dotenv').load();

const Raven = require('raven');
Raven.config('https://8136d808c63f410ba55548b92876cfdd@sentry.io/1204811').install();

// if (process.env.NODE_ENV === 'production') {
//     console.log('enabling newrelic service');
//     require('newrelic');
// }


process.chdir(__dirname);
require('app-module-path').addPath(process.cwd());

require('./server-start');
