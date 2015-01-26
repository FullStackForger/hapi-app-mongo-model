var User = require('./models/user'),
	user;

user = new User({
	fname: 'John',
	lname: 'Smith',
	comment: 'field not defined in schema'
});

console.log('\nstringified "user" object: ');
console.log(user.toString());

console.log('\njson-ized "user" object: ');
console.log(user.toJSON());

console.log('\nuser.fullname() helper output: ' + user.fullName());

user.validate()
	.then(null, function onError(error) {
		console.log('\nuser.validate() helper error output');
		console.log(error);
	});

delete user.comment;
user.validate()
	.then(function onSuccess(data) {
		console.log('\nuser.validate() helper success output');
		console.log(data);
	}, null);