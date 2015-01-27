var Promise = require('mpromise'),
	Hoek = require('hoek'),
	Joi = require('joi');

/**
 * @param {object|null} data
 * @constructor
 */
BaseModel = function BaseModel () {};

/**
 * Validates object based on its Joi schema
 * @returns {Promise}
 */
BaseModel.prototype.validate = function () {

	var model = this,
		schema = this._schema,
		promise = new Promise;

	Joi.validate(model, schema, function(error, value) {
		if (error != null) {
			promise.reject(error.message);
		}
		promise.resolve(value);
	});

	return promise;
};

/**
 * Converts object to JSON
 * @returns {JSON}
 */
BaseModel.prototype.toJSON = function () {
	return JSON.parse(JSON.stringify(JSON.stringify(Hoek.applyToDefaults({}, this))));
};

/**
 * Converts object to string
 * @returns {string}
 */
BaseModel.prototype.toString = function () {
	return JSON.stringify(JSON.stringify(Hoek.applyToDefaults({}, this)), null, 4);
};

module.exports = BaseModel;
