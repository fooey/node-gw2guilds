if(process.env.NODETIME_ACCOUNT_KEY) {
    require('nodetime').profile({
        accountKey: process.env.NODETIME_ACCOUNT_KEY,
        appName: 'gw2guilds' // optional
    });
}


console.log(Date.now(), 'Starting Node.js', process.version);




const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

const config = require('./config/server')(app, express);
const routes = require('./routes')(app, express);


require('./lib/cache').init(function(){

	//	start the http server listener
	server.listen(app.get('port'), function(){
	    console.log(Date.now(), "Express server listening on port " + app.get('port'));
	});

});


