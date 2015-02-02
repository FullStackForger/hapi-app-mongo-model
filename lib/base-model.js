var Promise = require('mpromise'),
	Hoek = require('hoek'),
	Joi = require('joi');

/**
 * @param {object|null} data
 * @constructor
 */
function BaseModel () {};

/**
 * Validates object based on its Joi schema
 * @returns {Promise}
 */
BaseModel.prototype.validate = function () {

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
 * Converts object to JSON
 * @returns {JSON}
 */
BaseModel.prototype.toJSON = function () {
	return JSON.parse(JSON.stringify(Hoek.applyToDefaults({}, this)));
};

/**
 * Converts object to string
 * @returns {string}
 */
BaseModel.prototype.toString = function () {
	return JSON.stringify(Hoek.applyToDefaults({}, this));
};

module.exports = BaseModel;
