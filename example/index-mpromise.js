var Promise = require('promise');

function makeMeAPromise(i) {
	var p = new Promise;
	p.fulfill(i);
	return p;
}

var returnPromise = initialPromise = new Promise;
for (i=0; i<10; ++i)
	returnPromise = returnPromise.chain(makeMeAPromise(i)());

initialPromise.fulfill();

initialPromise.onFulfill(function(data) {
	console.log(data);
});