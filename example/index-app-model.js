var AppModel = require('../lib/app-model');

AppModel.connect({
	
	url: 'mongodb://localhost:27017/test',
	opts: {
		"safe": true,
		"db": {
			"native_parser": false
		}
	}	
	
}).then(function(manager) {
	
	var News = AppModel.register({
		collection: 'news',
		path: __dirname + "/models/news"
	});

	/* todo: move to tests
	News.insert({
		name: "super monko oki donko"
	}).then(function(result) {
		console.log(result);
	});
	*/
	
	/* todo: move to tests
	News.updateById('54e19a307b945e0000b9ca6f', {
		$set: { betterVersion: true }
	}).then(function(result) {
		console.log(result);
	})
	*/

}).catch(function(error) {
    throw error;
});




	