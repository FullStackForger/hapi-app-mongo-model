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
	Model = require('../lib/app-model'),
	NewsModel;

describe('model prototype methods', function() {

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
	
	it('should create', function (done) {
		var newsData = { title: 'new title', copy: 'lorem ipsum' },
			news = new NewsModel(newsData);
		
		expect(news.title).to.be.equal(newsData.title);
		expect(news.copy).to.be.equal(newsData.copy);
		done();
	});
	
	it('should save', function (done) {
		var news = new NewsModel({ title: 'new title', copy: 'lorem ipsum' });
		expect(news).to.be.equal(news);
		news.title = 'title changed';
		news.save()
			.then(function(news) {
				expect(news.title).to.be.equal('title changed');
			});
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
});