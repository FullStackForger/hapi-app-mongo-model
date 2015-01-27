var ModelFactory = require('./lib/model-factory'),
	Model = {};

// Public API method
Model.generate = ModelFactory.generate;

// Hapi public register method
Model.register = function (server, options, next) {

	var models = options.models || {};
	var mongodb = options.mongodb;
	var autoIndex = options.hasOwnProperty('autoIndex') ? options.autoIndex : true;

	Object.keys(models).forEach(function (key) {

		models[key] = require(Path.join(process.cwd(), models[key]));
	});

	Model
		.connect(mongodb)
		.then(function (db) {

			Model.db =db;
			server.expose('Model', Model);
			next();
			
		}, function (error) {
			server.log('Error connecting to MongoDB via Model.');
			return next(err);
		});
};

Model.register.attributes = {
	name: 'myPlugin',
	version: '1.0.0'
};


module.exports = Model;

