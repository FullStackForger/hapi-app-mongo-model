var Hapi = require('hapi'),
	Hoek = require('hoek'),
	Joi = require('joi'),
	Code = require('code'),
	expect = Code.expect,
	Lab = require('lab'),
	lab = exports.lab = Lab.script(),
	describe = lab.describe,
	it = lab.it,
	before = lab.before,
	beforeEach = lab.beforeEach,
	Model = require('../lib/app-model');
	

describe('model static methods', function() {
	var NewsModel;
	
	before(function (done) {
		Model.connect({ url: 'mongodb://localhost:27017/test', opts: { 'safe': true } })
			.then(function() {
				NewsModel = require('../test-mocks/news-model');
				done();
			});
	});

	beforeEach(function (done) {
		Model.db.get('news').remove({}, function() {
			done();
		});
	});
	
	it('should successfully validate', function (done) {
		var newsData = { title: "new title", copy: "lorem ipsum mixum twiksum" };
		NewsModel
			.validate(newsData)
			.then(function (validated) {
				expect(validated[0]).to.include(newsData);
				done();
			}).onReject(function (error) {
				done(error);
			});
	});

	it('should fail validation', function (done) {
		var newsData = { title: "new title", not_valid_property: ""};
		NewsModel
			.validate(newsData)
			.then(function () {
				done(new Error('bad data document has been validated ok'));
			}).onReject(function (error) {
				expect(error).to.not.be.null;
				done();
			});
	});	
	
	it('should insert and parse', function (done) {
		var newsData = { title: "new title", copy: "lorem ipsum mixum twiksum" };
		NewsModel
			.insertAndParse(newsData)
			.then(function (newsObject) {
				expect(newsObject).to.deep.include(newsData);
				done();
			}).onReject(function (error) {
				done(error);
			});
	});

	it('should NOT insert invalid data', function (done) {
		var newsData = { illigal_property: "" };
		NewsModel
			.insertAndParse(newsData)
			.then(function () {
				done(new Error('bad data document inserted'));
			}).onReject(function (error) {
				expect(error).to.not.be.null;
				done();
			})
	});

	it('should find and parse', function (done) {
		var newsData = { title: "new title", copy: "lorem ipsum mixum twiksum" },
			query = { title: "new title" },
			insertData = [ Hoek.merge({}, newsData), Hoek.merge({}, newsData), Hoek.merge({}, newsData) ];

		NewsModel.insert(insertData, function(error, result) {
			if (error) done(new Error(error));

			NewsModel.findAndParse(query)
				.then(function (news) {
					expect(news).to.be.an.array().length(3);
					expect(news[0]).to.include(newsData);
					expect(news[1]).to.include(newsData);
					done();
				}).onReject(function (error){
					done(error);
				});
		});
		
	});

	it('should find one and parse', function (done) {
		var newsData = { title: "new title", copy: "lorem ipsum mixum twiksum" },
			query = { title: "new title" },
			insertData = [ Hoek.merge({}, newsData), Hoek.merge({}, newsData) ];

		NewsModel.insert(insertData, function(error, result) {
			if (error) done(error);

			NewsModel.findOneAndParse(query)
				.then(function (news) {
					expect(news).to.include(newsData);
					done();
				}).onReject(function (error) {
					done(error);
				});
		});
		
	});

	it('should find but NOT parse empty document', function (done) {
		var query = { title: "new title" };
		NewsModel.findOneAndParse(query)
			.then(function (news) {
				expect(news).to.be.null;
				done();
			}).onReject(function (error) {
				done(error);
			});
	});

	it('should reject if find and parse one query is invalid', function (done) {
		var query = { $title: "new title" };
		NewsModel.findOneAndParse(query)
			.then(function (news) {
				done('invalid query has been parsed');
			}).onReject(function (error) {
				done();
			});
	});


	it('should force find (create) document', function (done) {
		var document = { title: "new title" };
		NewsModel.forceFind(document)
			.then(function (doc) {
				expect(doc.title).to.be.equal(document.title);
				done()
			}).onReject(function (error) {
				done(error);
			});
	});

});