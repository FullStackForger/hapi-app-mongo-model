var Model = require('../../../'),
	UserModel = Model.register({
		collection: "users",
		path: __dirname
	});

module.exports = UserModel;