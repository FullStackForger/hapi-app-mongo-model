var Joi = require('joi'),
	mockSchema;

mockSchema = {
	title: Joi.string(),
	name: Joi.string()
};

module.exports = mockSchema;