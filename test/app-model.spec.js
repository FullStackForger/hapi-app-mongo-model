var Path = require('path'),
	Hapi = require('hapi'),
	Hoek = require('hoek'),
	Joi = require('joi'),
	Code = require('code'),
	expect = Code.expect,
	Lab = require('lab'),
	lab = exports.lab = Lab.script(),
	describe = lab.describe,
	it = lab.it,
	before = lab.before,
	after = lab.after,
	
	Model = require('../lib/app-model'),
	NewsModel;


describe('Model Factory Connections', function () {

	it('should establish database connection', function (done) {
		Model
			.connect({ url: 'mongodb://localhost:27017/test', opts: { 'safe': true } })
			.then(function() {
				done();
			}, function (error) {
				done(error);
			});
	});

	it('should establish default database connection', function (done) {
		Model
			.connect()
			.then(function() {
				done();
			}, function (error) {
				done(error);
			});
	});

	it('should NOT allow shorthand monk url', function (done) {
		Model
			.connect({ url: 'localhost/test', opts: { 'safe': true } })
			.then(function() {
				done("monk style url shouldn\'t be allowed with this plugin");
			}, function () {
				done();
			});
	});
	
	it('should close a connection a database connection', function (done) {
		Model
			.connect({ url: 'mongodb://localhost:27017/test', opts: { 'safe': true } })
			.then(function(connection) {
				connection.db.close(function (error) {
					expect(error).to.be.null;
					done();
				});
			}, function (error) {
				done(error);
			});
	});
	
});

describe('Model Factory Generator', function () {

	var newsConfig = {
		collection: 'news',
		path: Path.resolve(__dirname, "../test-mocks/news-model")
	};
	
	before(function (done) {
		Model.connect({ url: 'mongodb://localhost:27017/test', opts: { 'safe': true } })
			.then(function () {
				NewsModel = require('../test-mocks/news-model');
				done();
			});
	});

	it('should NOT generate Custom Model with invalid config', function (done) {
		var errorCount = 0;

		try {
			Model.register();
		} catch (e) {
			errorCount++;
		}
		try {
			Model.register({ path: __dirname + "../test-mocks/news-model" });
		} catch (e) {
			errorCount++;
		}
		try {
			Model.register({ collection: "news" });
		} catch (e) {
			errorCount++;
		}
		try {
			Model.register({ collection: "news", path: __dirname + "../test-mocks/news-model", invalid: '' });
		}
		catch (e) {
			errorCount++;
		}

		expect(errorCount).to.be.equal(4);
		done();

	});

	it('should NOT generate Custom Model with missing schema file', function (done) {
		try {
			Model.register({
				collection: 'news',
				path: Path.resolve(__dirname, "../test-mocks/news-model-no-schema")
			});
			done("Model has been registered without schema file");
		} catch (error) {
			expect(error.message).to.include("schema.js not found.");
			done();
		}
	});
	
	it('should register Custom Model with valid config', function (done) {
		NewsModel = Model.register(newsConfig);
		expect(NewsModel).to.not.be.null();
		done();
	});

	it('should register Model with schema only (without dao or helpers)', function (done) {
		NewsModel = Model.register({
			collection: 'news',
			path: Path.resolve(__dirname, "../test-mocks/news-model-only-schema")
		});
		expect(NewsModel).to.not.be.null();
		done();
	});

	it('should store configuration', function (done) {
		NewsModel = Model.register(newsConfig);
		expect(NewsModel.config).to.include(newsConfig);
		done();
	});
	
	it('should expose local DAO methods', function (done) {
		NewsModel = Model.register(newsConfig);
		expect(NewsModel.customQuery).to.be.a.function;
		done();
	});

	it('should merge local helpers into the prototype', function (done) {
		NewsModel = Model.register(newsConfig);
		expect(NewsModel.prototype.header).to.be.a.function;
		done();
	});

	it('should expose db connection', function (done) {
		NewsModel = Model.register(newsConfig);
		expect(Model.db).to.not.be.null;
		expect(Model.db).to.be.object;
		expect(NewsModel.db).to.be.object;
		expect(NewsModel.prototype._db).to.be.object;
		done();
	});
	
	
});