var MongoClient = require('mongodb').MongoClient;

var insertDocuments = function(db, callback) {
	// Get the documents collection
	var collection = db.collection('users');
	// Insert some documents
	collection.insert([
		{a : 1}, {a : 2}, {a : 3}
	], function(err, result) {
		debugger;
		callback(result);
	});
}

// Connection URL
var url = 'mongodb://localhost:27017/test_app';
// Use connect method to connect to the Server
MongoClient.connect(url, function(err, db) {
	console.log("Connected correctly to server");

	insertDocuments(db, function() {
		db.close();
	});
});