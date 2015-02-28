var Promise = require('mpromise'),
	Async = require('async'),
	Joi = require('joi'),
	Hoek = require('hoek'),
	statics = module.exports = {};

statics.validate = function (data) {
	var promise = new Promise(),
		objectArr = (data instanceof Array) ? data : [data],
		schema = this.config.schema,
		self = this;

	Async.map(objectArr, function validateObject (object, done) {
		// don't validate id
		var objectId;
		if (object._id) {
			objectId = object._id;
			delete object._id;
		}

		Joi.validate(object, schema, function(error, value) {
			if (error != null) {
				return done(error);
			}
			// restore id if exists
			if (objectId) {
				value._id = objectId;
			}
			done(undefined, value);
		});
	}, function onMapError(error, values) {
		if (error) {
			promise.reject(error.message);
			return;
		}
		promise.fulfill(values);
	});
	
	return promise;
};

/**
 * Inserts documents returning promise
 * @param {Array|object|Model} documents
 * @return {Promise} 
 */
statics.insertAndParse = function (documents) {
	var promise = new Promise(),
		self = this;

	this.validate(documents)
		.then(function (validatedObjects) {

			validatedObjects = validatedObjects.map(function (object) {
				return Hoek.merge({}, object);
			});

			self.insert(validatedObjects, function(error, data) {

				if (error) {
					promise.reject(error);
					return;
				}

				if (data.length > 1) {
					data = data.map(function (object) {
						return new self(object);
					});
				} else {
					data = new self(data[0]);
				}

				promise.fulfill(data);


			});
		}, function (error) {
			promise.reject (error);
		});
	
	return promise;
};

statics.findAndParse = function (query, options) {
	var promise = new Promise(),
		self = this;

	this.find(query, options || {}, function(error, result) {
		console.error("result:");
		console.error(result);

		console.error("error:");
		console.error(error);
		
		
		if (error) {
			return promise.reject(error);
		}   

		result = result.map(function(object) {
			return new self(object);
		});
		
		promise.fulfill(result);
	});

	return promise;
};

statics.findOneAndParse = function (query, options) {
	var promise = new Promise(),
		self = this;

	this.findOne(query, options || {}, function(error, result) {

		if (error) {
			promise.reject(error);
			return;
		}
		
		if (!result) {
			promise.fulfill(null);
			return;	
		}
		
		result = new self(result);
		promise.fulfill(result);
		
	});

	return promise;
};

statics.forceFind = function (object) {
	var promise = new Promise(),
		self = this;

	this.validate(object)
		.then(function(validatedObject) {
			self.findAndModify({
				query: validatedObject[0],
				update: {
					$setOnInsert: validatedObject[0]
				}
			}, {
				new: true,   // return new doc if one is upserted
				upsert: true // insert the document if it does not exist
			}, function(error, result) {
				
				if (error) {
					promise.reject(error);
					return;
				}

				result = new self(result);
				promise.fulfill(result);
			})
		}).onReject(function (error) {
			promise.reject(error);
		});

	return promise;
};