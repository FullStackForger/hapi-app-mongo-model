var Joi = require('joi'),
	userSchema;

userSchema = {
	id: Joi.string().default(null),
	name: Joi.string(),
	user: Joi.object().keys({
		name: Joi.string()
	}).default(null)
};

module.exports = userSchema;