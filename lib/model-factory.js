var Fs = require('fs'),
	Util = require('util'),
	Hoek = require('hoek'),
	Joi = require('joi'),
	Promise = require('mpromise'),
	Mongodb = require('mongodb'),
	BaseModel = require('./base-model'),
	CollectionApi = require('./collection-api'),
	ModelFactory = {},
	ModelProxy = {},
	CollectionApiMethods;

/**
 * Object stores database connections
 * todo: consider removing default connection once connection id can be configured in model
 * dbs - Database connection array
 * db - Last opened (default) connection
 * @type {{dbs: Array, db: null|object}}
 */
ModelProxy = { dbs : [], db: null}
CollectionApiMethods = CollectionApi.getMethods(ModelProxy);

/**
 * Connects to the database, it allows multiple connections
 *
 * Multiple connection management is largely borrowed from: 
 *  https://github.com/Marsup/hapi-mongodb/blob/master/lib/index.js
 *  
 * @param {string} config.url
 * @param {object} config.settings
 */
ModelFactory.connect = function (config) {
	var promise = new Promise(),
		config = config || {},
		configSchema,
		configValidation,
		dbObject;
	
	configSchema = Joi.object().keys({
		url: Joi.string().regex(/^mongodb:\/\/.*$/i).required(),
		settings: Joi.object().default({}),
		connectionId: Joi.string().default(null)
	}).required();

	if (config.url === undefined) {
		config.url = 'mongodb://localhost:27017/test';
	} 
	
	configValidation = Joi.validate(config, configSchema);

	if (configValidation.error) {
		throw new Error(configValidation.error);
	}
	
	config = configValidation.value;
	
	// todo: replace db with dbObjects and document
	dbObject = { db: null, settings: null, error: null };

	Mongodb.MongoClient.connect(config.url, config.settings, function (err, db) {

		if (err) {
			promise.reject({
				db: null,
				config: config,
				error: err.message
			});
		}

		ModelProxy.dbs["connectionId"] = db;
		ModelProxy.db = db;

		promise.fulfill({
			db: db,
			settings: config
		});
	});

	return promise;
};

/**
 * Closes database connection 
 * @param {object} db
 */
ModelFactory.disconnect = function (db) {
	db.close();
};

/**
 * Closes all database connections
 */
ModelFactory.disconnectAll = function () {
	ModelProxy.dbs.forEach(function(db) {
		ModelProxy.db.close(db);
	});
};

/**
 * * 
 * @param {object} config
 * @param {string} config.collection
 * @param {string} config.connectionId
 * @param {string} config.path
 * @returns {Model}
 */
ModelFactory.generate = function (config) {
	var dao, helpers, schema, key, configSchema, configValidation;

	configSchema = {
		collection: Joi.string().required(),
		path: Joi.string().required(),
		connectionId: Joi.string().default(null)
	};

	function Model (data) {
		BaseModel.call(this);
		if (Joi.validate(data, Joi.object()).error != null) {
			throw new Error('data parameter must be an object. Check schema definition.');
		}

		Hoek.merge(this, data);
	}

	Util.inherits(Model, BaseModel);

	configValidation = Joi.validate(config, configSchema);

	if (configValidation.error) {
		throw new Error("Model configuration error: " + config.error);
	}
	
	config = configValidation.value;

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

	// Expose Collection API (DAO) methods on Model Class
	for (key in CollectionApiMethods) {
		if (CollectionApiMethods.hasOwnProperty(key)) {
			Model[key] = CollectionApiMethods[key];
		}
	}
	
	// Expose custom DAO methods on Model Class
	if (dao) {
		for (key in dao) {
			if (dao.hasOwnProperty(key)) {
				Model[key] = dao[key];
			}
		}
	}

	// merge custom helpers
	if (helpers) {
		Hoek.merge(Model.prototype, helpers);
	}
	
	// exposed on Model and available from model class
	Model.config = config;
	Model.proxy = ModelProxy;
	Model.config.schema = schema;

	// expose config as private on model object
	Model.prototype._config = config;	

	Model.create = function (data) {
		return new Model(data);
	};

	return Model;
};

module.exports = ModelFactory;