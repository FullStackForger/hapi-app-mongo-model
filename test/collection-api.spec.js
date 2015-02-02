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
	after = lab.after,
	CollectionApi = require('../lib/collection-api');
	


describe('Collection API namespace object', function () {

	it('should NOT generate if Model Proxy is not passed', function (done) {
		try {
			CollectionApi.generate();
			done(new Error("Namespace object has been generated without Model Proxy passed in"));
		} catch (e) {
			expect(e.message).to.only.include("Model Proxy param is missing, model proxy with db connections.");
		}
		done();
	});

	it('should NOT generate if Model Proxy doesn\t contain \'db\' or \'dbs\' properties', function (done) {
		var mockModelProxy = { db : null, dbs : null };

		try {
			CollectionApi.generate(mockModelProxy);
			done(new Error("Namespace object has been generated without Model Proxy \'db\' connection property"));
		} catch (e) {
			expect(e.message).to.only.include("ValidationError: db must be an object");				
		}

		mockModelProxy.db = {};

		try {
			CollectionApi.generate(mockModelProxy);
			done(new Error("Namespace object has been generated without Model Proxy \'dbs\' connection array"));
		} catch (e) {
			expect(e.message).to.only.include("ValidationError: single value of dbs fails because value must be an object");
		}

		mockModelProxy.dbs = [];
		
		try {
			CollectionApi.generate(mockModelProxy);
			done(new Error("Namespace object has been generated with empty Model Proxy \'dbs\' connection array"));
		} catch (e) {
			expect(e.message).to.only.include("ValidationError: dbs must contain at least 1 items");
		}
		
		done();
	});

	it('should generate OK with Model Proxy object', function (done) {
		var mockModelProxy = { db : {}, dbs : [{}]},
			collectionApi;

		collectionApi = CollectionApi.generate(mockModelProxy);
		expect(collectionApi).to.be.an.object();

		done();
	});
	
	it('should expose API methods', function (done) {
		var mockModelProxy = { db : {}, dbs : [{}]},
			apiSchema, collectionApi;

		apiSchema = Joi.object().keys({
			insert: Joi.func().required(),
			update: Joi.func().required(),
			remove: Joi.func().required(),
			validate: Joi.func().required()
		});
		
		collectionApi = CollectionApi.generate(mockModelProxy);
		
		apiSchema.validate(collectionApi, function (error) {
			if (error) {				
				done(error);
			}
		});
		done();

	});
	
});

describe('Collection API', function () {

	it('should conform to valid schema', function (done) {
		done(new Error("missing test"));
	});

	it('should NOT conform to invalid schema', function (done) {
		done(new Error("missing test"));
	});

	it('should insert one document', function (done) {
		done(new Error("missing test"));
	});

	it('should insert multiple documents', function (done) {
		done(new Error("missing test"));
	});

	it('should remove one document', function (done) {
		done(new Error("missing test"));
	});

	it('should remove multiple documents', function (done) {
		done(new Error("missing test"));
	});

	it('should update one document', function (done) {
		done(new Error("missing test"));
	});

	it('should update multiple documents', function (done) {
		done(new Error("missing test"));
	});

	it('should return one found object', function (done) {
		done(new Error("missing test"));
	});

	it('should return multiple found objects', function (done) {
		done(new Error("missing test"));
	});
	
});