var Monk = require('monk'),
	Hoek = require('hoek'),
	Joi = require('joi'),
	Promise = require('mpromise'),
	AppModel = module.exports = {};


AppModel.db = null;

AppModel.connect = function (dbOptions) {
	var promise = new Promise(),
		config = dbOptions || {},
		configSchema,
		configValidation;

	configSchema = Joi.object().keys({
		url: Joi.string().regex(/^mongodb:\/\/.*$/i).required(),
		opts: Joi.object().default({})
	}).required();

	if (config.url === undefined) {
		config.url = 'mongodb://localhost:27017/test';
	}

	configValidation = Joi.validate(config, configSchema);

	if (configValidation.error) {
		throw new Error(configValidation.error);
	}

	config = configValidation.value;

	AppModel.db = Monk(config.url, config.opts, function () {
		promise.fulfill({
			db: AppModel.db,
			options: config
		});
	});

	return promise;
};