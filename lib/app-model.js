var Monk = require('monk'),
	Hoek = require('hoek'),
	Fs = require('fs'),
	Joi = require('joi'),
	Promise = require('mpromise'),
	Actor = require('hactor'),
	externals = module.exports = {};

externals.db = null;

/**
 * @param {object} dbOptions
 * @param {string} dbOptions.url
 * @param {object} dbOptions.opts
 * @returns {Promise}
 */
externals.connect = function (dbOptions) {
	var promise = new Promise(),
		config = dbOptions || {},
		optionsSchema,
		configValidation;

	optionsSchema = Joi.object().keys({
		url: Joi.string().regex(/^mongodb:\/\/.*$/i).required(),
		opts: Joi.object().default({})
	}).required();

	if (config.url === undefined) {
		config.url = 'mongodb://localhost:27017/test';
	}

	configValidation = Joi.validate(config, optionsSchema);

	if (configValidation.error) {
		throw new Error(configValidation.error);
	}

	config = configValidation.value;

	externals.db = Monk(config.url, config.opts, function () {
		promise.fulfill({
			db: externals.db,
			options: config
		});
	});

	return promise;
};

/**
 *
 * @param {object} options
 * @param {string} options.collection
 * @param {string} options.path
 * @returns {object|null}
 */
externals.register = function (options) {

	var collectionApi = {},
		optionsSchema = {},
		collection, validation, config,
		model, dao, helpers, schema;

	optionsSchema.collection = Joi.string().required();
	optionsSchema.path = Joi.string().required();

	validation = Joi.validate(options, optionsSchema); 

	if (validation.error) {
		throw new Error("Model configuration error: " + validation.error.message);
	}

	config = validation.value;
	
	if (Fs.existsSync(config.path + '/schema.js')) {
		schema = require(config.path + '/schema');
	} else {
		throw new Error(config.path + '/schema.js not found. Have you created schema for the model?');
	}

	if (Fs.existsSync(config.path + '/dao.js')) {
		dao = require(config.path + '/dao');
	}

	if (Fs.existsSync(config.path + '/helpers.js')) {
		helpers = require(config.path + '/helpers');
	}

	// expose config and helpers
	config.schema = schema;
	model = Hoek.merge({
		config: config
	}, helpers);

	// prepare collection API ( wrap monk collection methods )
	collection = externals.db.get(config.collection);	
	for (var method in collection) {
		collectionApi[method] = collection[method];
	}
	// make config available in collection api namespace
	collectionApi.config = config;

	// return class
	return Actor.extend(model, collectionApi);
};
