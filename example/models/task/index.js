var Model = require('hapi-app-mongo-model'),
	TaskModel = Model.generate("users", __dirname);

module.exports = TaskModel;