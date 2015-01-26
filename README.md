# Hapi App Mongo Model

Lightweight abstraction layer over native MongoDB driver for Hapi App

## WORK IN PROGRESS! ##

## Rationale

Most popular ODM for MongoDB manipulations from NodeJS is Mongoose. 
It is build on the top of MongoDB's native driver.
It is build with tone of features such us object schemas and validation.

Mongoose is however unnecesary if you want to reuse Joi schemas for validating your objects. 

Hapi-app-mongo-model is attempt to provide lightweight abstraction on the top of MongoDB native driver.

## Core features 

 - `Model` class with MongoDB collection methods ( find(), findOne(), ObjectId )
 - Helper methods exposed on `model` objects (save(), update(), remove(), validate())
 - Ease of extensibility of the Helper and DAO methods ( see examples below )
 - All models share one db connection

## Disclaimer

Inspired by: 
 - [hapi-mongo-models](https://github.com/jedireza/hapi-mongo-models)
 - [hapi-mongodb](https://github.com/Marsup/hapi-mongodb)

> **Note:** Mongoose is great ODM if want abstraction layer packed with tone of features and own validation. 
> Kudos for creators for all the hard work. 

## Using Hapi App Mongo Model

This part provides simple example of how to create and use custom models
Check `example` folder for full example code or check `test` folder for test specs.

### Required files

Let's assume User model lives in folder `models/user`, then required files are:

```
models/user/
models/user/dao.js
models/user/helpers.js
models/user/index.js
models/user/schema.js
```

### Preparing model source files

#### File: *models/user/index.js*

```js
var Model = require('hapi-app-mongo-model'),
	UserModel = Model.generate("UserModel", __dirname);

module.exports = UserModel;
```

#### File: *models/user/dao.js*
```js
module.exports = {}
```

#### File: *models/user/helpers.js*
```js
module.exports = {
	fullName : function() {
		return this.fname + ' ' + this.lname;
	}
}
```

#### File: *models/user/schema.js*
```js
var Joi = require('joi'),
	userSchema;

userSchema = {
	fname: Joi.string(),
	lname: JOi.string()
}
module.exports = userSchema;
```js

### Creating new user object

#### File: *index.js*
```js
var User = require('models/user'),
	user;
	
user = new User({
	fname: 'John',
	fname: 'Smith'
});

console.log('> stringified "user" object')
console.log(JSON.stringify(user, null, 2);
console.log('> fullname() helper output: ' + user.fullName());
```

## User Reference



### example files - pending
### grunt scripts - pending
### travis ci - pending
### Model.plugin - hapi plugin - pending
### Model.db - shared connection - pending
### Model.create() - done, docs, no tests
### Modes.find() - in progress
### Model.findOne() - in progress
### Model.ObjectId - pending
### Model.ObjectID - pending

### `ModelClass.create()` and `new ModelClass()`
> status: implemented but no tests

### modelObject.save() - pending
### modelObject.update() - pending

### modelObject.validate()
> status: implemented but no tests

Validate is async and returns promise. Use it as shown below. 

```
user.validate()
	.then(function onSuccess(data) {
	    console.log('\nuser.validate() helper success output');
	    console.log(data);
	}, function onError(error) {
	    console.log('\nuser.validate() helper error output');
	    console.log(error);
	});
```
	
### modelObject.remove() - pending
