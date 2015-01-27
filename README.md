# Hapi App Mongo Model

Lightweight abstraction layer over native MongoDB driver for Hapi App

## THIS WORK IN PROGRESS

## Rationale

Most popular ODM for MongoDB manipulations from NodeJS is Mongoose. 
It is build on the top of MongoDB's native driver.
It is build with tone of features such us object schemas and validation.

Mongoose is however unnecesary if you would want to reuse Hapi Joi schemas for validating your objects. 

Hapi-app-mongo-model is attempt to provide lightweight abstraction on the top of MongoDB native driver.

## Core features 

 - `Model` is a namespace object exposing MongoDB collection methods returning promise:
 	+ `find()`, 
 	+ `findOne()`, 
 	+ `ObjectId`,
 	
 - `Model` is also a constructor used to create custom `ModelClass`-es
 - `ModelClass` can be created with:
	+ `new Model(collectionName, [object])` or
	+ `Model.generate(collectionName, [object])`

 - DAO helpers are exposed in custom `ModelClass`:
 	+  `find()`, 
	+ `findOne()`

 - Helper methods available on `modelObject`:
 	+ `save()`, 
 	+ `update()`, 
 	+ `remove()`, 
 	+ `validate()`

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
	UserModel = Model.generate("users", __dirname);

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
```

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
console.log(user.toJSON());
console.log('> fullname() helper output: ' + user.fullName());
```

## User Reference

### Hapi plugin `Model.plugin`
> pending

### Shared connection `Model.db`
> pending

### Schamas and indexes
> pending, todo: look at ensureIndexes in hapi-mongo-models 

### Model namespaced methods
#### Find method `Modes.find()`
> pending

#### FindOne method `Model.findOne()`
> pending

#### ObjectId via `Model.ObjectId()` and `Model.ObjectID()`
> pending

### DAO helpers

#### Createing object via `new ModelClass(collectionName, [object])`


#### Createing object via `ModelClass.create(collectionName, [object])` 
Convinience method for `new ModelClass(collectionName, [object])`

> status: implemented but no tests

#### Find `<ModelClass>.find()`
> pending

#### FindOne `<ModelClass>.findOne()`
> pending

### Model Object helpers

#### Save `<modelObject>.save()`
> pending

#### Update `<modelObject>.update()`
> pending

#### Validate `<modelObject>.validate()`
> status: implemented but no tests

Validate is async and returns a promise. Use it as shown below. 

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
	
#### Helper `<modelObject>.remove()`
> pending


