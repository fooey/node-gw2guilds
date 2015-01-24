"use strict";

const path = require('path');

const pubFolder = path.join(process.cwd(), 'public');
const faviconPath = path.join(pubFolder, 'images/gw2-dragon-32.png');


module.exports = function(app, express) {
	if (process.env.NODE_ENV === 'development') {
		app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
		app.locals.pretty = true;
		app.use(express.logger('dev'));
	}
	else {
		app.use(express.errorHandler());
		app.use(express.logger('default'));
	}


	app.use(express.cookieParser());



	/*
	* Full CORS
	*/
	app.use(function(req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		next();
	});



	// set a cookie
	app.use(function(req, res, next) {
		var uaUUID = req.cookies.uaUUID;

		if (!uaUUID) {
	    	uaUUID = require('uuid').v4();

			const cookieMaxAge = 1000 * 60 * 60 * 24 * 356 * 2; // 2 years
			res.cookie('uaUUID', uaUUID, { maxAge: cookieMaxAge, httpOnly: true});
		}

		next(); // <-- important!
	});

	app.set('port', process.env.PORT || 3000);

	app.set('views', path.join(process.cwd(), 'views'));
	app.set('view engine', 'jade');
	app.set('view cache', true);


	app.use(express.favicon(faviconPath));
	app.use(app.router);
	app.use(express.static(pubFolder));
	app.use(require('compression')({
		threshold: 512
	}));
};
