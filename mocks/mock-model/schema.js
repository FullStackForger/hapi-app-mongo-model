var Joi = require('joi'),
	mockSchema;

mockSchema = {
	title: Joi.string().required(),
	fullName: Joi.string().min(6).required(),
	locale: Joi.string().regex(/^[a-z]{2}-[a-z]{2}$/i)
};

module.exports = mockSchema;