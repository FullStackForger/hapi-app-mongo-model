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
		schema = this.config.schema,
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
