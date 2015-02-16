var Model = require('../../../lib/app-model'),
	NewsModel = Model.register({
		collection: "news",
		path: __dirname
	});

module.exports = NewsModel;