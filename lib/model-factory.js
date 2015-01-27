var Fs = require('fs'),
	Util = require('util'),
	Hoek = require('hoek'),
	Joi = require('joi'),
	Promise = require('mpromise'),
	Mongodb = require('mongodb'),
	BaseModel = require('./base-model'),
	ModelFactory = {},
	ModelApi = {};


ModelApi.update = function () {

	var args = new Array(arguments.length);
	for (var i = 0 ; i < args.length ; ++i) {
		args[i] = arguments[i];
	}
	
	var collection = ModelApi.db.collection(this._collection);
	collection.update.apply(collection, args);
};

ModelApi.remove = function () {

	var args = new Array(arguments.length);
	for (var i = 0 ; i < args.length ; ++i) {
		args[i] = arguments[i];
	}

	var collection = ModelApi.db.collection(this._collection);
	collection.remove.apply(collection, args);
};

/**
 * Database connection
 * @type {null|object}
 */
ModelFactory.db = null;

/**
 * Connects to the database
 * @param {string} config.url
 * @param {object} config.settings
 */
ModelFactory.connect = function (config) {
	var promise = new Promise();

	Mongodb.MongoClient.connect(config.url, config.settings, function (err, db) {
		if (err) {
			promise.reject(err);
		}
		ModelApi.db = db;
		promise.resolve(db);
	});

	return promise;
};

/**
 * Closes shared database connection
 */
ModelFactory.disconnect = function () {
	ModelFactory.db.close();
};

/**
 * @public
 * @param collectionName
 * @param path
 * @returns {Function}
 */
ModelFactory.generate = function (collectionName, path) {
	var dao, helpers, schema, key;
	

	function Model (data) {
		BaseModel.call(this);
		if (Joi.validate(data, Joi.object()).error != null) {
			throw new Error('data parameter must be an object. Check schema definition.');
		}

		Hoek.merge(this, data);
	}

	Util.inherits(Model, BaseModel);
	
	if (arguments.length < 2 ||
		Joi.validate(collectionName, Joi.string()).error != null ||
		Joi.validate(path, Joi.string()).error != null) {

		throw new Error("'modelName' and 'path' string parameters are required.");
	}

	if (Fs.existsSync(path + '/schema.js')) {
		schema = require(path + '/schema');
	} else {
		throw new Error(path + '/schema.js not found. Have you created schema for the model?');
	}
	
	if (Fs.existsSync(path + '/dao.js')) {
		dao = require(path + '/dao');
	}	

	if (Fs.existsSync(path + '/helpers.js')) {
		helpers = require(path + '/helpers');
	}
	
	// Expose properties and methods on custom Model Class
	for (key in dao) {
		if (dao.hasOwnProperty(key)) {
			Model[key] = dao[key];
		}
	}
	
	// merge helpers
	Hoek.merge(Model.prototype, helpers);
	
	// exposed on Model and available from model object
	Model._collection = Model.prototype._collection = collectionName;
	Model._schema = Model.prototype._schema = schema;

	Model.create = function (data) {
		return new Model(data);
	};

	return Model;
};

module.exports = {
	generate: ModelFactory.generate
};