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
	Model = require('../lib/app-model'),
	NewsModel = require('./mocks/news-model');

describe('model prototype methods', function() {

	before(function (done) {

		Model.connect({

			url: 'mongodb://localhost:27017/test',
			opts: {
				"safe": true,
				"db": {
					"native_parser": false
				}
			}

		}).then(function() {
			Model.db.get('news').remove({}, function() {
				done();
			});
		});

		//users = db.get('users-' + Date.now());
		//indexes = db.get('indexes-' + Date.now());
	});
	
	it('should create', function (done) {
		done(new Error('missing'));
	});
	
	it('should save', function (done) {
		done(new Error('missing'));
	});

	it('should validate', function (done) {
		done(new Error('missing'));
	});

	it('should turn to JSON', function (done) {
		done(new Error('missing'));
	});

	it('should turn to string', function (done) {
		done(new Error('missing'));
	});
});