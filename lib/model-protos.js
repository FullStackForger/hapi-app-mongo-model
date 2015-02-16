var Promise = require('mpromise'),
	Hoek = require('hoek'),
	Joi = require('joi'),
	protos = module.exports = {};


protos.constructor = function (object) {
	for (var key in object) {
		if (object.hasOwnProperty(key) && typeof(object["copy"]) != 'function') {
			this[key] = object[key];
		}
	}
};

/**
 * Validates object based on its Joi schema
 * @returns {Promise}
 */
protos.validate = function () {

	var model = this,
		schema = this._config.schema,
		promise = new Promise;

	Joi.validate(model, schema, function(error, value) {
		if (error != null) {
			promise.reject(error.message);
		}
		promise.fulfill(value);
	});

	return promise;
};

/**
 * Saves object returning promise
 * @returns {Promise}
 */
protos.save = function () {
	var promise = new Promise,
		collection = this._db.get(this._config.collection);

	collection.update(collection.id(this._id), this.toJSON(), function (error, result) {
		if (error) {
			promise.reject(error);
			return;
		}

		promise.fulfill(this.query.update);
	});

	return promise;
};

/**
 * Converts object to JSON
 * @returns {JSON}
 */
protos.toJSON = function () {
	return Hoek.applyToDefaults({}, this);
};

/**
 * Converts object to string
 * @returns {string}
 */
protos.toString = function () {
	return JSON.stringify(Hoek.applyToDefaults({}, this));
};