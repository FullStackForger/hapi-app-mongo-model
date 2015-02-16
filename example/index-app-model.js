var AppModel = require('../lib/app-model'),
	Hoek = require('hoek');

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
	
	/* todo: move to tests */
	News.insert({
		name: "super monko oki donko"
	}).then(function(result) {
		console.log(result);
	});

	
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
	// equivalent to previous one
	var news = {
		title: 'good news',
		copy: 'lorem ipsum lorem ipsum lorem ipsum lorem ipsum '
	};
	News.forceFind(news).then(function(result) {
		console.log(result.toJSON());
	}).onReject(function(error){
		throw error;
	});
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
	
	/* todo: move to tests 
	var news = [{
		    title: 'good lorem news',
		    copy: 'lorem to ipsum lorem to ipsum lorem to ipsum'
		}, {
			title: 'o babe'
		}];

	News.insertAndParse(news)
		.then(function(news) {
			// returns array of model objects
			console.log(news[0].toJSON());
			console.log(news[1].toJSON());
		});

	News.insertAndParse(news[0])
		.then(function(news) {
			// returns model object
			console.log(news.toJSON());
		});
	 */
	
	/* todo: move to tests
	var newsData = { title: 'good lorem news' },
		insertData = [
			Hoek.merge({}, newsData),
			Hoek.merge({}, newsData),
			Hoek.merge({}, newsData)
		];
	
	News.insert(insertData, function(error, result) {
		if (error) throw new Error(error);

		News.findAndParse(newsData)
			.then(function(news) {
				for (var i = 0; i < news.length; i++) {
					console.log(news[i].toJSON());
				}
			});
	});
	*/

	/* todo: move to tests */
	var newsData = { title: 'good lorem news' },
		insertData = [
			Hoek.merge({}, newsData),
			Hoek.merge({}, newsData)
		];
	
	News.insert(insertData, function(error, result) {
		if (error) throw new Error(error);
		
		News.findOneAndParse(newsData)
			.then(function(news) {
				console.log(news.toJSON());
			});
	});
	


	/* todo: move to tests
	var news = {
		title: 'good lorem news',
		copy: 'lorem to ipsum lorem to ipsum lorem to ipsum'
	};

	News.insertAndParse(news)
		.then(function(news) {
			console.log(news);
			news.title = 'new title';
			return news.save();
		}).then(function(news) {
			console.log(news);
		});
	*/

	/* todo: move to tests
	// saves docs without id
	var news = new News({
			_id: News.id('54e24ad628bebe94601b6e42'),
			title: 'good lorem news',
			copy: 'lorem to ipsum lorem to ipsum lorem to ipsum'
		});
	
	news.save()
		.then(function(news) {
			console.log(news.toJSON());
		});
	*/

	
}).catch(function(error) {
    throw error;
});




	