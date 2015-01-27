var MongoDB = require('mongodb'),
	Joi = require('joi'),
	Hoek = require('hoek'),
	ModelFactory = require('./lib/model-factory'),
	AppModel = {};

AppModel.register = function (server, options, next) {

	var connect = function (options, done) {
		Mongodb.MongoClient.connect(options.url, options.settings, function (err, db) {
			if (err) {
				return done(err);
			}

			plugin.log([ 'hapi-mongodb', 'info' ], 'MongoClient connection created for ' + JSON.stringify(options));
			done(null, db);
		});
	};

	async.map(options, connect, function (err, dbs) {
		if (err) {
			plugin.log([ 'hapi-mongodb', 'error' ], err);
			return next(err);
		}

		plugin.expose('db', options.length === 1 ? dbs[0] : dbs);
		next();
	});
	
	AppModel
		.connect(options.url, options.settings)
		.then(function (db) {

			AppModel.db = db;
			AppModel.options = options;

			server.expose('app-model', AppModel);
			next();

		}, function (error) {
			server.log('Error connecting to MongoDB via Model.');
			return next(error);
		});
};

AppModel.register.attributes = {
	name: 'app-model',
	version: '1.0.0'
};


module.exports = Hoek.merge(AppModel, ModelFactory);

