var Hapi = require('hapi'),
	Hoek = require('hoek'),
	Sinon = require('sinon'),
	Joi = require('joi'),
	Code = require('code'),
	expect = Code.expect,
	Lab = require('lab'),
	lab = exports.lab = Lab.script(),
	describe = lab.describe,
	it = lab.it,
	after = lab.after,
	before = lab.before,
	beforeEach = lab.beforeEach,
	Model,
	NewsModel,
	internals = {};

internals.executeTests = function() {
	
	it('should create', function (done) {
		var newsData = { title: 'new title', copy: 'lorem ipsum' },
			news = new NewsModel(newsData);
		
		expect(news.title).to.be.equal(newsData.title);
		expect(news.copy).to.be.equal(newsData.copy);
		done();
	});


	it('should create empty', function (done) {
		var news = new NewsModel();
		expect(news).to.not.be.null();
		done();
	});

	it('should create ignoring function properties', function (done) {
		var news = new NewsModel({
			testMe: function () {}
		});

		expect(news.testMe).to.be.undefined;
		done();
	});

	it('should create ignoring prototype properties', function (done) {
		var News = function () {};
		News.prototype.ignored = 'should be ignored';

		expect((new NewsModel(new News())).ignored).to.be.undefined;
		done();
	});

	it('should validate', function (done) {
		var news = new NewsModel({ title: 'new title', copy: 'lorem ipsum' }),
			validated = news.validate();

		expect(validated.error).to.be.null;
		
		news.invalidField = "some invalid data";
		validated = news.validate();
		expect(validated.error).to.exist;
		
		done();
	});

	it('should validate model with id', function (done) {
		var news = new NewsModel({_id: '54e3f7722db5ef830aea1fbd', title: 'new title', copy: 'lorem ipsum' }),
			validated = news.validate();		
		
		expect(validated.error).to.be.null;
		done();
	});

	it('should save model data', function (done) {
		var news = new NewsModel({ title: 'new title', copy: 'lorem ipsum' });

		news.title = 'title changed';
		news.save()
			.then(function(news) {
				expect(news.title).to.be.equal('title changed');
			});
		done();
	});

	it('should save model object', function (done) {
		var news = new NewsModel({ title: 'new title', copy: 'lorem ipsum' });

		news.title = 'title changed';
		news.save()
			.then(function() {
				return news.save();
			})
			.then(function(news) {
				expect(news.title).to.be.equal('title changed');
			})
			.onReject(function(error) {
				expect(error).to.not.exist;
			});
		
		done();
	});

	it('should reject save for invalid model', function (done) {
		var news = new NewsModel({ header: 'header is not allowed'});
		news.save()
			.then(function() {				
				done('model with invalid property has been inserted');
			}).onReject(function(error){
				expect(error).to.not.be.null;
				done();
			});
	});

	it('should handle findOne db error while saving new object', function (done) {
		var news = new NewsModel({
				title: 'Some new title' + (new Date()).getTime(),
				copy: 'lorem ipsum twipsum pitsum'
			}),
			findOneStub;

		findOneStub = Sinon.stub(require('monk').Collection.prototype, "findOne", function () {
			arguments[arguments.length - 1]("Error occurred", null);
		});

		function complete(msg) {
			findOneStub.restore();
			done(msg);
		}

		// save will findOne document 1st
		news.save()
			.then(function() {
				complete("model has been marked as saved with db error");
			}).onReject(function (error) {
				expect(error).to.not.be.null;
				complete();
			});
	});
	
	it('should handle error while saving new object', function (done) {
		var news = new NewsModel({ 
				title: 'Some new title' + (new Date()).getTime(),
				copy: 'lorem ipsum twipsum pitsum' 
			}),
			insertStub;

		insertStub = Sinon.stub(require('monk').Collection.prototype, "insert", function () {
			arguments[arguments.length - 1]("Error occurred", null);
		});		

		function complete(msg) {
			insertStub.restore();
			done(msg);
		}
		
		// save will insert new document
		news.save()
			.then(function(news) {
				complete("model has been marked as saved with db error");
			}).onReject(function (error) {
				expect(error).to.not.be.null;
				complete();
			});
	});

	it('should handle error while saving existing object', function (done) {
		var news = new NewsModel({
				title: 'Some new title' + (new Date()).getTime(),
				copy: 'lorem ipsum twipsum pitsum'
			}),
			updateStub;

		updateStub = Sinon.stub(require('monk').Collection.prototype, "update", function () {
			arguments[arguments.length - 1]("Error occurred", null);
		});

		function complete(msg) {
			updateStub.restore();
			done(msg);
		}

		// 1st save will insert new document
		news.save()
			.then(function(news) {
				debugger;
				// 2nd save will update existing document
				return news.save();
			})
			.then(function(news) {
				complete("model has been marked as saved with db error");
			}).onReject(function (error) {
				expect(error).to.not.be.null;
				complete();
			});
	});

	it('should turn to JSON', function (done) {
		var newsData = { title: 'new title', copy: 'lorem ipsum' },
			news = new NewsModel(newsData);
		
		expect(news.toJSON()).to.only.include(newsData);
		done();
	});

	it('should turn to string', function (done) {
		var newsData = { title: 'new title', copy: 'lorem ipsum' },
			news = new NewsModel(newsData);

		expect(news.toString()).to.be.equal(JSON.stringify(newsData));
		done();
	});
};

describe('model prototype methods (Model created before db connection)', function() {
	// forces to unload the News module
	delete require.cache[require.resolve('../test-mocks/news-model')];
	delete require.cache[require.resolve('../lib/app-model')];
	
	before(function (done) {
		Model.db = null;
		
		NewsModel = require('../test-mocks/news-model');
		Model = require('../lib/app-model');
		Model.connect({ url: 'mongodb://localhost:27017/test', opts: { 'safe': true } })
			.then(function () {
				done();
			});
	});

	internals.executeTests();

});

describe('model prototype methods (Model created after db connection)', function() {
	// forces to unload the News module
	delete require.cache[require.resolve('../test-mocks/news-model')];
	delete require.cache[require.resolve('../lib/app-model')];
	Model = require('../lib/app-model');
	
	before(function (done) {
		Model.connect({ url: 'mongodb://localhost:27017/test', opts: { 'safe': true } })
			.then(function () {
				NewsModel = require('../test-mocks/news-model');
				done();
			});
	});

	internals.executeTests();

});