var Joi = require('joi'),
	userSchema;

userSchema = {
	fname: Joi.string(),
	lname: Joi.string()
};

module.exports = userSchema;