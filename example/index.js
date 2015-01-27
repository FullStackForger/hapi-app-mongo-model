var User = require('./models/user'),
	Task = require('./models/task'),
	user, task;

user = new User({
	fname: 'John',
	lname: 'Smith',
	comment: 'field not defined in schema'
});

task = new Task({ name: 'My first example task' });


console.log('\nstringified "user" object: ');
console.log(user.toString());

console.log('\njson-ized "user" object: ');
console.log(user.toJSON());

console.log('\nuser.fullname() helper output: ' + user.fullName());

console.log('\nstringified "task" object: ');
console.log(task.toString());

console.log('\njson-ized "task" object: ');
console.log(task.toJSON());

console.log('\task.taskName() helper output: ' + task.taskName());

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
	}, function onError(error) {
		console.log('\nuser.validate() helper error output');
		console.log(error);
	});