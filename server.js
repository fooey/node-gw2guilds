if (process.env.NODETIME_ACCOUNT_KEY) {
	require('newrelic');

    require('nodetime').profile({
        accountKey: process.env.NODETIME_ACCOUNT_KEY,
        appName: 'gw2guilds' // optional
    });
}

const gw2api = require('gw2api');


GLOBAL.guilds = {};




const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

require('./config/server')(app, express);
require('./routes')(app, express);


console.log(Date.now(), 'Starting Node.js', process.version);
server.listen(app.get('port'), function() {
    console.log(Date.now(), "Express server listening on port " + app.get('port'));
});


