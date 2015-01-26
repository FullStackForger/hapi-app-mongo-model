var Hoek = require('hoek'),
	Joi = require('joi'),
	Promise = require('promise'),
	Model = {},
	modelHelpers;


modelHelpers = {
	validate : function () {
		var model = this,
			schema = this.schema;
		
		return new Promise(function(resolve, reject) {
			Joi.validate(model, schema, function(error, value) {
				if (error != null) {
					reject(error.message);
				}
				resolve(value);
			});
		});
	},
	
	toJSON : function () {
		return JSON.parse(JSON.stringify(JSON.stringify(Hoek.applyToDefaults({}, this))));
	},
	
	toString : function () {
		return JSON.stringify(JSON.stringify(Hoek.applyToDefaults({}, this)), null, 4);
	}
}

/**
 * @public
 * @param modelName
 * @param path 
 * @returns {Model}
 */
function generateModel(modelName, path) {
	var dao, helpers, schema, key, validation, Model;

	if (arguments.length < 2) {
		throw new Error("'modelName' and 'path' parameters are required. Check Model Schema.");
	}

	validation = Joi.validate(modelName, Joi.string());
	if (validation.error != null) {
		throw new Error("'modelName' parameter error: " + validation.error + ". Check Model Schema.");
	}

	validation = Joi.validate(path, Joi.string());
	if (validation.error != null) {
		throw new Error("'path' parameter error: " + validation.error + " . Check Model Schema.");
	}

	dao = require(path + '/dao'),
	helpers = require(path + '/helpers'),
	schema = require(path + '/schema');

	Model = function (data) {
		if (Joi.validate(data, Joi.object()).error != null) {
			throw new Error('data parameter must be an object. Check schema definition.');
		}

		Hoek.merge(this, data);
	};

	// Hoek.merge can't be used on constructor function
	for (key in dao) {
		if (dao.hasOwnProperty(key)) {
			Model[key] = dao[key];
		}
	}
	
	Hoek.merge(Model.prototype, modelHelpers);
	Hoek.merge(Model.prototype, helpers);

	// exposed on Model and available from model object
	Model.name = Model.prototype.name = modelName;
	Model.schema = Model.prototype.schema = schema;
	
	Model.create = function (data) {
		return new Model(data); 
	};
	
	return Model;
};

module.exports = {
	generate: generateModel
};