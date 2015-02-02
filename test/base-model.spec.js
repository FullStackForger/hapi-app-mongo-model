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
	after = lab.after;

describe('Base model', function () {
	var BaseModel = require('../lib/base-model'),
		model = new BaseModel(),
		data = {
			fname: "John",
			lname: "Smith"
		},
		schema = {
			fname: Joi.string().required(),
			lname: Joi.string().required()
		};

	before(function (done) {
		model = Hoek.merge(model, data);
		
		BaseModel.prototype._config = {
			schema : schema
		};
		
		done();
	});

	
	it('should instantiate', function (done) {
		expect(model).to.be.an.instanceof(BaseModel);
		done();
	});
	
	it('should convert to string', function (done) {
		expect(model.toString())
			.to.be.a.string()
			.and.only.include(JSON.stringify(data));
		done();
	});


	it('should convert to JSON', function (done) {
		expect(model.toJSON())
			.to.be.an.object()
			.and.only.include(data);
		done();
	});

	it('should conform to a valid a schema', function (done) {
		model.validate()
			.then(function(validated) {
				expect(validated).to.only.inclide(data);
			});
		done();
	});

	it('should NOT confirm to an invalid schema', function (done) {
		model.invalidProperty = "uknown field";
		
		model.validate()
			.onReject(function(error) {
				expect(error).to.only.include('invalidProperty is not allowed');
			});
		done();
	});
});
