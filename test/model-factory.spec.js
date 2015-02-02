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
	ModelFactory = require('../lib/model-factory');


describe('Model Factory Connections', function () {

	it('should create database connection', function (done) {
		done(new Error("missing test"));
	});
	
	it('should create multiple database connections', function (done) {
		done(new Error("missing test"));
	});
	
	it('should close a connection a database connection', function (done) {
		done(new Error("missing test"));
	});
	
	it('should close all database connection', function  (done) {
		done(new Error("missing test"));
	});
	
});

describe('Model Factory Generator', function () {

	it('should NOT generate Custom Model with invalid config', function (done) {
		done(new Error("missing test"));
	});

	it('should NOT generate Custom Model with missing schema file', function (done) {
		done(new Error("missing test"));
	});

	it('should generate Custom Model with valid config', function (done) {
		done(new Error("missing test"));
	});

	it('should store configuration', function (done) {
		done(new Error("missing test"));
	});
	
	it('should allow to create Custom model via generate()', function (done) {
		done(new Error("missing test"));
	});
	
	it('should expose DAO methods', function (done) {
		done(new Error("missing test"));
	});

	it('should merge helpers into the prototype', function (done) {
		done(new Error("missing test"));
	});

	it('should expose connections via Model Proxy', function (done) {
		done(new Error("missing test"));
	});
	
	
});