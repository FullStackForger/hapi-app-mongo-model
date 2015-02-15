var Model = require('../../../'),
	TaskModel = Model.generate({
		collection: "users",
		path: __dirname
	});

module.exports = TaskModel;