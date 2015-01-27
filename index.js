var Async = require('async'),
	MongoDB = require('mongodb'),
	Joi = require('Joi'),
	Hoek = require('hoek'),
	ModelFactory = require('./lib/model-factory'),
	AppModel = {};

// heavily borrowed from: 
// https://github.com/Marsup/hapi-mongodb/blob/master/lib/index.js

AppModel.register = function (server, options, next) {
	var requireConnId = options instanceof Array && options.length > 1,
		singleOption, optionsSchema, connect;
	
	singleOption = Joi.object({
		url: Joi.string().required(),
		connectionId: requireConnId ? Joi.string().required() : Joi.string(),
		settings: Joi.object()
	});

	optionsSchema = Joi.array().includes(singleOption).min(1).single();
	
	connect = function (options, done) {

		AppModel
			.connect()
			.then(function (db) {

				AppModel.db = db;
				AppModel.options = options;

				server.log([ 'hapi-mongodb', 'info' ], 'MongoClient connection created for ' + JSON.stringify(options));
				done(null, db);							

			}, function (error) {
				if (error) {
					return done(error);
				}				
			});
	};

	optionsSchema.validate(options, function (err, options) {
		if (err) {
			return next(err);
		}

		Async.map(options, connect, function (err, dbs) {
			if (err) {
				server.log([ 'hapi-mongodb', 'error' ], err);
				return next(err);
			}

			server.expose('app-model', AppModel);
			next();
		});
	})
};

AppModel.register.attributes = {
	name: 'app-model',
	version: '1.0.0'
};


module.exports = Hoek.merge(AppModel, ModelFactory);

