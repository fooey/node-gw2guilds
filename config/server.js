module.exports = function (app, express) {
	const config = this;

	const path = require('path')
	const pubFolder = path.join(process.cwd(), 'public');
	const faviconPath = path.join(pubFolder, 'images/gw2-dragon-32.png');



	if(process.env.NODE_ENV === 'development'){
		app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
		app.locals.pretty = true;
		app.use(express.logger('dev'));
	}
	else{
		app.use(express.errorHandler());
		app.use(express.logger('default'));
	}

	app.set('port', process.env.PORT || 3000);

	app.set('views', path.join(process.cwd(),'views'));
	app.set('view engine', 'jade');
	app.set('view cache', true);

	app.use(express.favicon(faviconPath));
	app.use(express.urlencoded());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(pubFolder));




	return config;
};