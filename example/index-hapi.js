var Hapi = require('hapi'),
	Good = require('good'),
	Boom = require('boom'),
	User = require('./models/user'),
	Task = require('./models/task'),
	server = new Hapi.Server(),
	plugins,
	routes;

plugins = [{
	register: Good,
	options: {
		reporters: [{
			reporter: require('good-console'),
			args: [{ log: '*', response: '*' }]
		}]
	}
}];

routes = [{
	method: 'GET',
	path: '/user',
	handler: function userHandler(request, reply) {
		var user = new User({
			fname: 'Tom',
			lname: 'Boldie'
		});
		
		user.validate()
			.onFulfill(function(data) {
				reply(data.toJSON());
			})
			.onReject(function (error) {
				reply(Boom.badImplementation(error));
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

server.register(plugins, function (error) {
	if (error) {
		console.error(err);		
	}
	
	server.connection({
		host: 'localhost',
		port: 8080
	});
	
	server.route(routes);
	server.start();
});