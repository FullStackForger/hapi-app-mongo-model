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
	manager.db.get('test').insert({
		name: "monko monko"
	});
});




	