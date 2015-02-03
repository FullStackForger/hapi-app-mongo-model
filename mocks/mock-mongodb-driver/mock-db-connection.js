var connection = {};

/**
 * todo: get rid of mocks and use spies/stubs on mongodb driver
 * @type {{collection: {insert: insert, update: update, remove: remove}}}
 */
connection.collection = function(collectionName) {
	return {
		insert : function (data, callback) {
			var response = connection.responses.getInsertData(true, data);
			callback(response.error, response.data)
		},
		update : function (query, update, options, callback) {
			var response = (update instanceof Array)
				? connection.responses.getUpdateData(true, update)
				: connection.responses.getUpdateData(true, [update]);

			callback(response.error, response.data);
		},
		remove : function (query, callback) {
			var response = connection.responses.getRemoveData(true);
			callback(response.error, response.data);
		}
	};
};
	
// todo: that has to be completed before using
// todo add eg.: getUpdateFailedData - those can be used by test stubs
connection.responses = {
	getInsertData: function(successful, data) {
		return {
			error : successful ? undefined : "some error",
			data : successful && data ? data : null
		}
	},
	getUpdateData: function(successful, data) {
		return {
			error : successful ? undefined : "some error",
			data : successful && data ? data : null
		}
	},
	getRemoveData : function(successful, data) {
		var responseData = {
			result : {
				n : 1
			}
		};
		
		return {
			error : successful ? undefined : "some error",
			data : successful && data ? data : responseData
		}
	}
};

module.exports = connection;