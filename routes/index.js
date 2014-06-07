/**
 * This file is where you define your application routes and controllers.
 * 
 * Start by including the middleware you want to run for every request;
 * you can attach middleware to the pre('routes') and pre('render') events.
 * 
 * For simplicity, the default setup for route controllers is for each to be
 * in its own file, and we import all the files in the /routes/views directory.
 * 
 * Each of these files is a route controller, and is responsible for all the
 * processing that needs to happen for the route (e.g. loading data, handling
 * form submissions, rendering the view template, etc).
 * 
 * Bind each route pattern your application should respond to in the function
 * that is exported from this module, following the examples below.
 * 
 * See the Express application routing documentation for more information:
 * http://expressjs.com/api.html#app.VERB
 */

 var _ = require('underscore'),
 keystone = require('keystone'),
 middleware = require('./middleware'),
 importRoutes = keystone.importer(__dirname);

// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);

// Import Route Controllers
var routes = {
	views: importRoutes('./views'),
	keystone:importRoutes('../node_modules/keystone/routes/api')
};

var initList = function(protect) {
	return function(req, res, next) {
		req.list = keystone.list(req.params.list);
		if (!req.list || (protect && req.list.get('hidden'))) {
			req.flash('error', 'List ' + req.params.list + ' could not be found.');
			return res.redirect('/keystone');
		}
		next();
	}
}

console.log(routes);

// Setup Route Bindings
exports = module.exports = function(app) {
	// Views
	app.get('/', routes.views.index);
	app.get('/upload', routes.views.upload);
	app.post('/upload', routes.views.upload);
	app.get('/video/:id', routes.views.video);
	app.post('/video', routes.views.video);
	app.get('/home', routes.views.home);
	app.post('/home', routes.views.home);
	app.all('/keystone/api/:list/:action', initList(), routes.keystone.list);

	
	
	// NOTE: To protect a route so that only admins can see it, use the requireUser middleware:
	// app.get('/protected', middleware.requireUser, routes.views.protected);
	
}
