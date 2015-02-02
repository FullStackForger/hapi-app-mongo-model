var Model = require('hapi-app-mongo-model'),
	MockModel = Model.generate({
		collection: "mocks",
		path: __dirname
	});

module.exports = MockModel;