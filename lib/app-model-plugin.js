var Joi = require('Joi'),
	AppModel = require('./app-model'),
	HapiPlugin = {};

const LOG_LABEL = 'hapi-app-mongo-models';

/**
 * Hapi Plugin registration method
 *
 * todo: consider adding connection management
 * ( https://github.com/Marsup/hapi-mongodb/blob/master/lib/index.js )
 */
HapiPlugin.register = function (server, options, next) {
	var optionsSchema, connect;

	optionsSchema = Joi.object({
		url: Joi.string().required(),
		opts: Joi.object()
	});

	optionsSchema.validate(options, function (error, options) {
		if (error) {
			server.log([LOG_LABEL, 'error' ], 'Plugin ' + LOG_LABEL + ' registration failed due to invalid configuration options');
			return next(error);
		}

		AppModel
			.connect(options)
			.then(function (db) {

				server.log([LOG_LABEL, 'info' ], 'MongoClient connection created for ' + JSON.stringify(options));
				next();

			}, function (error) {

				if (error) {
					server.log([LOG_LABEL, 'error' ], 'MongoClient connection failed for ' + JSON.stringify(options));
					return next(error);
				}

			});
	})
};

HapiPlugin.register.attributes = {
	name: 'app-model',
	version: '1.0.0'
};

module.exports = HapiPlugin;