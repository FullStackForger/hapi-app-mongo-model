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

	var model = Hoek.merge({}, this),
		self = this,
		schema = this._config.schema,
		promise = new Promise;

	// don't validate id
	delete model._id; 
	
	Joi.validate(model, schema, function(error, value) {
		if (error != null) {
			promise.reject(error.message);
		}
		
		// restore id if exists
		if (self._id) {
			value._id = self._id			
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
		self = this,
		collection = this._db().get(this._config.collection),
		objectId;

	this.validate()
		.then(function (validatedObject) {
			collection.findAndModify({
				query: validatedObject,
				update: {
					$setOnInsert: validatedObject
				}
			}, {
				new: true,   // return new doc if one is upserted
				upsert: true // insert the document if it does not exist
			}, function(error, result) {
				if (error) {
					promise.reject(error);
					return;
				}
				self = Hoek.merge(self, result);
				promise.fulfill(self);
			})			
		}).onReject(function(error) {
			promise.reject(error);
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