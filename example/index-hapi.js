var Hapi = require('hapi'),
	Good = require('good'),
	Boom = require('boom'),
	User = require('./models/user'),
	Task = require('./models/task'),
	Model = require('../'),
	server = new Hapi.Server(),
	plugins,
	routes;

// array of plugins to register
plugins = [{
	register: Good,
	options: {
		reporters: [{
			reporter: require('good-console'),
			args: [{ log: '*', response: '*', errpr: '*' }]
		}]
	}
},{
	register: Model,
	options: {
		"url": "mongodb://localhost:27017/test_app",
		"settings": {
			"db": {
				"native_parser": false
			}
		}
	}
}];

// array of routes to load
routes = [{
	method: 'GET',
	path: '/user',
	handler: function userHandler(request, reply) {
		User.findOne(request.query)
			.then(function(data) {
				reply(data);
			}, function (error) {
				reply(Boom.badImplementation(error));
			});
	}
},{
	method: 'GET',
	path: '/users',
	handler: function userHandler(request, reply) {
		User.find(request.query)
			.then(function(data) {
				reply(data);
			}, function (error) {
				reply(Boom.badImplementation(error));
			});
	}
},{
	method: 'GET',
	path: '/user/remove-all',
	handler: function userHandler(request, reply) {

		User.remove({})
			.onFulfill(function(data) {
				reply({
					removed: data
				});
			})
			.onReject(function (error) {
				reply(Boom.badImplementation(error));
			});
	}
},{
	method: 'GET',
	path: '/user/save',
	handler: function userHandler(request, reply) {

		var user = {
			fname : request.query.fname,
			lname : request.query.lname
		};

		User.insert(user)
			.then(reply)
			.onReject(function(error) {
				reply(Boom.badRequest('Invalid query: ' + error, error));
				throw new Error(error);
			});
	}
},{
	method: 'GET',
	path: '/task',
	handler: function taskHandler(request, reply) {
		var task = new Task({
			name: 'another thing to do'
		});

		task.validate()
			.then(function(data) {
				reply(data.toJSON());
			}, function (error) {
				reply(Boom.badImplementation(error));
			});
	}
}];


// register plugins
server.register(plugins, function (error) {
	if (error) {
		throw new (error);
	}
	
	server.connection({
		host: 'localhost',
		port: 8080
	});
	
	server.route(routes);
	server.start();
});