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
		done(new Error("missing test"));
	});

	it('should generate OK with Model Proxy object', function (done) {
		done(new Error("missing test"));
	});
	
	it('should expose API methods', function (done) {
		// insert, validate, update, remove, find, findOne
		done(new Error("missing test"));
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