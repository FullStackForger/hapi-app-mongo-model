var Joi = require('joi');

module.exports = {
	title: Joi.string(),
	created: Joi.date(),
	copy: Joi.string()
};
