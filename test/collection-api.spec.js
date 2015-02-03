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
	afterEach = lab.afterEach,
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

	// we are not testing mock-model yet, just schema is needed
	var mockSchema = require('../mocks/mock-model/schema'),
		mockValidData = require('../mocks/mock-model-data/valid-mock-data'),
		mockInvalidData = require('../mocks/mock-model-data/invalid-mock-data'),
		mockDbConnection = require('../mocks/mock-mongodb-driver/mock-db-connection'),
		mockModelProxy = {},
		collectionApi,
		MockModel, 
		property;



	before(function emulateModelClass(done) {
		
		var collectionName = "mocks";
		
		// symulate valid model Proxy
		mockModelProxy.db = mockDbConnection;
		mockModelProxy.dbs = {};
		mockModelProxy.dbs[collectionName] = mockDbConnection;
				
		// generate collection API
		collectionApi = CollectionApi.generate(mockModelProxy);
	
		// mockModel constructor
		MockModel = function () {};

		// store schema for validation
		MockModel.config = {
			collection: collectionName,
			path: 'NO_VALUE_NEEDED_HERE',
			schema: mockSchema
		};

		// collection API exposed on model
		for (property in collectionApi) {
			if (typeof collectionApi[property] === 'function') {
				MockModel[property] = collectionApi[property];
			}
		}
		done();
	});
	
	it('should conform to valid schema', function (done) {
		MockModel
			.validate(mockValidData)
			.then(function(data) {
				expect(data[0]).to.only.contain(mockValidData);
				done();
			}, function(error) {
				done(new Error(error));
			});
	});

	it('should NOT conform to invalid schema', function (done) {
		MockModel
			.validate(mockInvalidData)
			.then(function(data) {
				done(new Error("Validation shouldn\' pass with invalidate schema"));
			}, function(error) {
				expect(error).to.only.contain("fullName length must be at least 6 characters long");
				done();
			});
	});

	it('should insert one valid document', function (done) {
		MockModel
			.insert(mockValidData)
			.then(function(data) {
				expect(data).to.be.an.array().and.to.have.length(1);
				done();
			}, function (error) {
				done(new Error(error));
			});
	});

	it('should NOT insert one invalid document', function (done) {
		MockModel
			.insert(mockInvalidData)
			.then(function(data) {
				done(new Error("Document not conforming to schema has been insrerted"));
			}, function (error) {
				expect(error).to.only.contain("fullName length must be at least 6 characters long");
				done();
			});
	});
	
	it('should insert multiple valid documents', function (done) {
		MockModel
			.insert([mockValidData, mockValidData, mockValidData])
			.then(function(data) {
				expect(data).to.be.an.array().and.to.have.length(3);
				done();
			}, function (error) {
				done(new Error(error));
			});
	});

	it('should NOT insert multiple invalid documents', function (done) {
		MockModel
			.insert([mockValidData, mockValidData, mockInvalidData])
			.then(function(data) {
				done(new Error("Document not conforming to schema has been insrerted"));
			}, function (error) {
				expect(error).to.only.contain("fullName length must be at least 6 characters long");
				done();
			});
	});


	it('should remove one document', function (done) {
		MockModel
			.remove(mockValidData)
			.then(function(data) {
				// todo: that should be stubbed to simulate result
				expect(data.result.n).to.be.equal(1);
				done();
			}, function (error) {
				done(new Error(error));
			});
	});

	it('should remove multiple documents', function (done) {
		MockModel
			.remove([mockValidData, mockValidData])
			.then(function(data) {
				// todo: that should be stubbed to simulate result
				expect(data.result.n).to.be.equal(1);
				done();
			}, function (error) {
				done(new Error(error));
			});
	});

	it('should update one document', function (done) {
		MockModel
			.update(mockValidData, mockValidData)
			.then(function(data) {
				expect(data[0]).to.only.contain(mockValidData);
				done();
			}, function (error) {
				done(new Error(error));
			});
	});

	it('should update multiple documents', function (done) {
		MockModel
			.update(mockValidData, [mockValidData, mockValidData])
			.then(function(data) {
				expect(data[1]).to.only.contain(mockValidData);
				done();
			}, function (error) {
				done(new Error(error));
			});
	});

	it('should return one found document', function (done) {
		done(new Error("missing test"));
	});

	it('should return multiple found documents', function (done) {
		done(new Error("missing test"));
	});
	
});