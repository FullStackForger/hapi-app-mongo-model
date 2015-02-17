var Hoek = require('hoek'),
	AppModel = module.exports = require('./lib/app-model'),
	AppModelPlugin;

AppModel.plugin = require('./lib/app-model-plugin');