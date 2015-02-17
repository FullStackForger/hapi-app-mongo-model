var Hoek = require('hoek'),
	AppModelPlugin = require('./lib/app-model-plugin'),
	AppModel = require('./lib/app-model');

module.exports = Hoek.merge(AppModel, { plugin: AppModelPlugin });