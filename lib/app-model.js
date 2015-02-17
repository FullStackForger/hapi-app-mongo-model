var Monk = require('monk'),
	Hoek = require('hoek'),
	Fs = require('fs'),
	Joi = require('joi'),
	Promise = require('mpromise'),
	Actor = require('hactor'),
	ModelStatics = require('./model-statics'),
	ModelProtos = require('./model-protos'),
	AppModel = Actor.extend(ModelProtos),
	externals = module.exports = {};


externals.db = null;

/**
 * @param {Object} [dbOptions]
 * @param {String} dbOptions.url
 * @param {Object} dbOptions.opts
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
		promise.reject(new Error(configValidation.error));
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
 * Registers Model Class exposing monk collection api with additional properties:
 * - config
 * @param {Object} options
 * @param {String} options.collection
 * @param {String} options.path
 * @returns {Object|null}
 */
externals.register = function (options) {

	var collectionApi = {},
		optionsSchema = {},
		self = this,
		collection, validation, config,
		model, dao, helpers, schema;

	optionsSchema = Joi.object().required().keys({
		collection: Joi.string().required(),
		path: Joi.string().required()
	});

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
		_config: config,
		_db : externals.db
	}, helpers);

	// prepare collection API ( wrap monk collection methods )
	collection = externals.db.get(config.collection);
	for (var property in collection) {
		collectionApi[property] = collection[property];
	}
	
	for (var method in ModelStatics) {
		collectionApi[method] = ModelStatics[method];
	}
	// make config and db available in collection api namespace
	collectionApi.config = config;
	collectionApi.db = externals.db;

	// return class
	return AppModel.extend(model, collectionApi);
};
