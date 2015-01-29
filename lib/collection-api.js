var Promise = require('mpromise'),
	Async = require('async'),
	Joi = require('joi'),
	Hoek = require('hoek'),
	CollectionApi = {},
	ModelProxy;

/**
 * Returns Collection object with API methods
 * @param modelProxy
 * @param modelProxy.db
 * @param modelProxy.dbs
 * @returns {{}}
 */
function getMethods(modelProxy) {
	if (modelProxy == undefined) {
		throw new Error("Pass model proxy with db connections");
	}
	
	ModelProxy = modelProxy;
	return CollectionApi;
}

CollectionApi.validate = function (data) {
	var promise = new Promise(),
		objectArr = (data instanceof Array) ? data : [data],
		schema = this.config.schema,
		self = this;
	

	Async.map(objectArr, function validateObject (object, done) {
		Joi.validate(object, schema, function(error, value) {
			if (error != null) {
				return done(error);
			}
			done(undefined, value);
		});
	}, function(error, values) {
		if (error) {
			promise.reject(error.message);
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
CollectionApi.insert = function (documents) {

	var db = ModelProxy.db,
		promise = new Promise(),
		self = this,
		collection;

	if (ModelProxy.dbs.length > 1) {
		db = ModelProxy.db[this.config.connectionId];
	}

	collection = db.collection(this.config.collection);

	CollectionApi
		.validate.call(this, documents)
		.onFulfill(function(validatedObjects) {

			validatedObjects = validatedObjects.map(function(object) {
				return Hoek.merge({}, object);
			});

			collection.insert(validatedObjects, function insertCompleted(error, data) {
				data = data.map(function(object) {
					return new self(object);
				});
				promise.fulfill(data);
			});
			
		}).onReject(function(error) {
			promise.reject(error);
		});
	
	return promise;
};


CollectionApi.update = function () {

	var args = new Array(arguments.length),
		db = ModelProxy.db,
		collection;

	for (var i = 0 ; i < args.length ; ++i) {
		args[i] = arguments[i];
	}

	if (ModelProxy.dbs.length > 1) {
		db = ModelProxy.db[this.config.connectionId];
	}


	collection = db.collection(this.config.collection);
	collection.update.apply(collection, args);
};

CollectionApi.remove = function (query) {

	var args = new Array(arguments.length),
		db = ModelProxy.db,
		collection,
		promise = new Promise();

	for (var i = 0 ; i < args.length ; ++i) {
		args[i] = arguments[i];
	}

	if (ModelProxy.dbs.length > 1) {
		db = ModelProxy.db[this.config.connectionId];
	}

	collection = db.collection(this.config.collection);
	collection.remove(query, function removeComplete(error, result) {
		if (error) {
			promise.reject(error);
		}
		promise.fulfill(result);
	});
	
	return promise;
};

module.exports = {	
	getMethods : getMethods
};