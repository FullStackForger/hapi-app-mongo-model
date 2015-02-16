var Model = require('../../../lib/app-model'),
	NewsModel = Model.register({
		collection: "users",
		path: __dirname
	});

module.exports = NewsModel;