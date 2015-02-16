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
	News.drop();
	 */
	
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

	/* todo: move to tests
	var news = {
		title: 'good news',
		paperId: 'MY-PAPER',
		copy: 'lorem ipsum lorem ipsum lorem ipsum lorem ipsum '
	};
	News.findAndModify({
		query: { paperId: news.paperId },
		update: {
			$setOnInsert: news
		}
	}, {
		new: true,   // return new doc if one is upserted
		upsert: true // insert the document if it does not exist
	}).then(function(result) {
		console.log(result);
	})
	*/
	
	/* todo: move to tests
	var news = new News({
		title: 'good news',
		//paperId: 'MY-PAPER',
		copy: 'lorem ipsum lorem ipsum lorem ipsum lorem ipsum'
	});
	console.log(news.toString());
	console.log(news.toJSON());
	news.validate()
		.then(function(data) {
			console.log(JSON.stringify(data));
		}).catch(function(error) {
			throw error;
		});
	 */
	
	
}).catch(function(error) {
    throw error;
});




	