var Model = require('hapi-app-mongo-model'),
	UserModel = Model.generate({
		collection: "users",
		path: __dirname
	});

module.exports = UserModel;