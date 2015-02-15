var Async = require('async'),
	Joi = require('Joi'),
	Hoek = require('hoek'),
	ModelFactory = require('./lib/model-factory'),
	AppModel = {};

const LOG_LABEL = 'hapi-app-mongo-models';


/**
 * Hapi Plugin registration method
 *
 * multiple db connection management has been borrowed heavily from:
 * https://github.com/Marsup/hapi-mongodb/blob/master/lib/index.js
 */
AppModel.register = function (server, options, next) {
	var requireConnId = false,
		singleOption, optionsSchema, connect;
	

	if (options instanceof Array && options.length > 1) {
		requireConnId = true;
	}
	
	singleOption = Joi.object({
		url: Joi.string().required(),
		connectionId: requireConnId ? Joi.string().required() : Joi.string(),
		settings: Joi.object()
	});

	optionsSchema = Joi.array().includes(singleOption).min(1).single();
	
	connect = function (options, done) {

		AppModel
			.connect(options)
			.then(function (db) {

				server.log([LOG_LABEL, 'info' ], 'MongoClient connection created for ' + JSON.stringify(options));
				done(null, db);

			}, function (error) {
				if (error) {
					server.log([LOG_LABEL, 'error' ], 'MongoClient connection failed for ' + JSON.stringify(options));
					return done(error);
				}				
			});
	};

	optionsSchema.validate(options, function (error, options) {
		if (error) {
			server.log([LOG_LABEL, 'error' ], 'Plugin ' + LOG_LABEL + ' registration failed due to invalid configuration options');
			return next(error);
		}

		Async.map(options, connect, function (error, dbs) {
			if (error) {
				server.log([LOG_LABEL, 'error' ], error);
				return next(error);
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

