'use strict';
require('babel/register');

process.chdir(__dirname);
require('app-module-path').addPath(process.cwd());

require('./server-start');