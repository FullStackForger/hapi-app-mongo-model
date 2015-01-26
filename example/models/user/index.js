var Model = require('hapi-app-mongo-model'),
	UserModel = Model.generate("UserModel", __dirname);

module.exports = UserModel;