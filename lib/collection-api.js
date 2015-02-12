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
function generate(modelProxy) {
	var modelProxySchema, validatedProxy;
	
	if (modelProxy == undefined) {
		throw new Error("Model Proxy param is missing, model proxy with db connections.");
	}
	
	modelProxySchema = {
		db : Joi.object().required(),
		dbs : Joi.array().min(1).includes(Joi.object()).single().required()
	};

	validatedProxy = Joi.validate(modelProxy, modelProxySchema);
	
	if (validatedProxy.error) {
		throw new Error(validatedProxy.error);
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

			validatedObjects = validatedObjects.map(function (object) {
				return Hoek.merge({}, object);
			});

			collection.insert(validatedObjects, function (error, data) {
				if (error) {
					promise.reject(error);
					return;
				}
				if (data.length > 1) {
					data = data.map(function(object) {
						return new self(object);
					});
				} else {
					data = new self(data[0]);
				}
				
				promise.fulfill(data);
			});
			
		}).onReject(function(error) {
			promise.reject(error);
		});
	
	return promise;
};

CollectionApi.find = function (query, options) {
	var db = ModelProxy.db,
		promise = new Promise(),
		collection,
		self = this,
		args = [];

	if (ModelProxy.dbs.length > 1) {
		db = ModelProxy.db[this.config.connectionId];
	}

	collection = db.collection(this.config.collection);
	collection.find(query, options || {}, function (error, result) {
		if (error) {
			promise.reject(error);
			return;
		}
		result.toArray(function(error, items) {
			result = items.map(function(object) {
				return new self(object);
			});
			promise.fulfill(result);
		});
	});

	return promise;
};

CollectionApi.findOne = function (query, options) {
	var db = ModelProxy.db,
		promise = new Promise(),
		collection,
		self = this,
		args = [];

	if (ModelProxy.dbs.length > 1) {
		db = ModelProxy.db[this.config.connectionId];
	}

	collection = db.collection(this.config.collection);
	collection.findOne(query, options || {}, function(error, result) {
		if (error) {
			promise.reject(error);
			return;
		}
		if (!result) {
			promise.fulfill(null);
			return;	
		}
		
		promise.fulfill(new self(result));		
	});

	return promise;
};

CollectionApi.update = function (query, update, options) {
	var db = ModelProxy.db,
		promise = new Promise(),
		collection;

	if (ModelProxy.dbs.length > 1) {
		db = ModelProxy.db[this.config.connectionId];
	}
	 
	try {
		updateQuery = update.toJSON()		
	} catch(e) {
		updateQuery = update;		
	}
	delete updateQuery._id;
	
	collection = db.collection(this.config.collection);
	collection.update(query, update, options || {}, function(error, result) {
		if (error) {
			promise.reject(error);
			return;
		}
		promise.fulfill(result);
	});
	
	return promise;
};

CollectionApi.remove = function (query) {
	var args = new Array(arguments.length),
		db = ModelProxy.db,
		promise = new Promise(),
		collection;

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
	generate : generate
};