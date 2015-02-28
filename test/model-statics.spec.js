var Hapi = require('hapi'),
	Hoek = require('hoek'),
	Joi = require('joi'),
	Code = require('code'),
	Sinon = require('sinon'),
	expect = Code.expect,
	Lab = require('lab'),
	lab = exports.lab = Lab.script(),
	describe = lab.describe,
	it = lab.it,
	before = lab.before,
	beforeEach = lab.beforeEach,
	Model = require('../lib/app-model'),
	NewsModel = require('../test-mocks/news-model');
	

describe('model static methods', function() {
	
	before(function (done) {
		Model.connect({ url: 'mongodb://localhost:27017/test', opts: { 'safe': true } })
			.then(function () {
				done();
			}).onReject(function (error) {
				done(error);
			});
	});

	beforeEach(function (done) {
		Model.db.get('news').remove({}, function(error, result) {
			if (error) return done(error);
			done();			
		});
	});
	
	it('should successfully validate object', function (done) {
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

	it('should successfully validate object with _id', function (done) {
		var newsData = {
			_id: '54e3f7722db5ef830aea1fbd', 
			title: "new title", 
			copy: "lorem ipsum mixum twiksum" 
		};
		
		NewsModel
			.validate(newsData)
			.then(function (validated) {
				expect(validated[0]).to.include(newsData);
				done();
			}).onReject(function (error) {
				done(error);
			});
	});

	it('should successfully validate array', function (done) {
		var newsData = { title: "new title", copy: "lorem ipsum mixum twiksum" };
		NewsModel
			.validate([newsData, newsData])
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

	it('should insert and parse multiple', function (done) {
		var newsData = [
			{ title: "new title 1", copy: "lorem ipsum mixum twiksum" },
			{ title: "new title 2", copy: "lorem ipsum mixum twiksum" }
		];
		NewsModel
			.insertAndParse(newsData)
			.then(function (newsObject) {
				expect(newsObject).to.be.array().and.have.length(2);
				expect(newsObject[0]).to.deep.include(newsData[0]);
				expect(newsObject[1]).to.deep.include(newsData[1]);
				done();
			}).onReject(function (error) {
				done(error);
			});
	});

	it('should NOT insert and parse invalid data', function (done) {
		var newsData = { illegal_property: "" };
		NewsModel
			.insertAndParse(newsData)
			.then(function () {
				done(new Error('bad data document inserted'));
			}).onReject(function (error) {
				expect(error).to.not.be.null;
				done();
			})
	});

	it('should reject insert and parse upon db error', function (done) {
		var collectionInsertStub = Sinon.stub(require('monk').Collection.prototype, "insert", function () {
			arguments[arguments.length - 1]("Error occurred", null);
		});

		function complete(msg) {
			collectionInsertStub.restore();
			done(msg);
		}
		
		NewsModel
			.insertAndParse({title: "some news"})
			.then(function(news) {
				complete("model has been marked as inserted in spite of database error");
			})
			.onReject(function (error) {
				expect(error.toString()).to.include('Error occurred');
				complete();
			});	
	});
	
	it('should find and parse', function (done) {
		var newsData = { title: "new title", copy: "lorem ipsum mixum twiksum" },
			query = { title: "new title" },
			insertData = [ Hoek.merge({}, newsData), Hoek.merge({}, newsData), Hoek.merge({}, newsData) ];

		NewsModel.insert(insertData, function(error, result) {
			if (error) return done(new Error(error));

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

	it('should find and parse with options', function (done) {
		var newsData = { title: "new title", copy: "lorem ipsum mixum twiksum" },
			query = { title: "new title" },
			insertData = [ Hoek.merge({}, newsData), Hoek.merge({}, newsData), Hoek.merge({}, newsData) ];

		NewsModel.insert(insertData, function(error, result) {
			if (error) return done(new Error(error));

			NewsModel.findAndParse(query, {})
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

	it('should reject find and parse with invalid query', function (done) {
		var query = { $title: "new title" };

		NewsModel.findAndParse(query)
			.then(function () {
				done('Find and Parse allowed INVALID query');
			}).onReject(function (error) {
				expect(error).to.not.be.empty;
				done();
			});

	});
	
	it('should find one and parse', function (done) {
		var newsData = { title: "new title", copy: "lorem ipsum mixum twiksum" },
			query = { title: "new title" },
			insertData = [ Hoek.merge({}, newsData), Hoek.merge({}, newsData) ];

		NewsModel.insert(insertData, function(error, result) {
			if (error) return done(error);

			NewsModel.findOneAndParse(query)
				.then(function (news) {
					expect(news).to.include(newsData);
					done();
				}).onReject(function (error) {
					done(error);
				});
		});
		
	});

	it('should find one and parse passing options', function (done) {
		var newsData = { title: "new title", copy: "lorem ipsum mixum twiksum" },
			query = { title: "new title" },
			insertData = [ Hoek.merge({}, newsData), Hoek.merge({}, newsData) ];

		NewsModel.insert(insertData, function(error, result) {
			if (error) return done(error);

			NewsModel.findOneAndParse(query, {})
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

	it('should throw error for force find empty document', function (done) {
		var document = {};
		NewsModel.forceFind(document)
			.then(function (doc) {
				done('was NOT rejected')
			}).onReject(function (error) {
				expect(error.toString()).to.include('\'$setOnInsert\' is empty');
				done();
			});
	});

	it('should reject when force find invalid document', function (done) {
		var document = { invalid: "yes yes" };
		NewsModel.forceFind(document)
			.then(function (doc) {
				done('was NOT rejected')
			}).onReject(function (error) {
				expect(error).to.not.be.empty;
				done();
			});
	});
});