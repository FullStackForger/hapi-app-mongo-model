var Model = require('../../../'),
	TaskModel = Model.register({
		collection: "users",
		path: __dirname
	});

module.exports = TaskModel;