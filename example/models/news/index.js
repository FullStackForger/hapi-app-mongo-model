var Model = require('../../../'),
	UserModel = Model.generate({
		collection: "users",
		path: __dirname
	});

module.exports = UserModel;