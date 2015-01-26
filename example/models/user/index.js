var Model = require('hapi-app-mongo-model'),
	UserModel = Model.generate("users", __dirname);

module.exports = UserModel;