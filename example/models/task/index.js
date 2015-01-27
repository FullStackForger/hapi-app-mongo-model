var Model = require('hapi-app-mongo-model'),
	TaskModel = Model.generate({
		collection: "users",
		path: __dirname
	});

module.exports = TaskModel;