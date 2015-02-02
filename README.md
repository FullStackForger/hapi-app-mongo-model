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
 - Easy connection management
 	+ Default settings for single connection
 	+ Models can share one connection
 	+ Models can use different connections to same or different databases
 	+ Easy connection indexing 	

 - Package can be used standalone or as a Hapi plugin

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
	UserModel = Model.generate({
		collection: "users",
		path: __dirname
	});

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
## Connecting to databse

Below examples illustrate connecting to database if you run package outside of Hapi application. For using it as hapi plugin scroll to **Using Model as plugin with hapi**

### Example 1: default connection `Model.connect()`

In below example `Model.connect()` is called without any parameters.
Model witll attempt to Connect to default mongo db url: 
`mongodb://localhost:27017`.

```
var Model = require('hapi-app-mongo-model'),
	connectionConfig = {};

Model
	.connect()
	.then(function (db) {
		// ... CRUD 		
	}, function (error) {
		throw new Error(error);		
	});
```

### Example 2: custom connection `Model.connect(config)`

Config object takes three parameters:
 - **url** - mongodb url, fefault value will be used if it is undefined
 - **connectionId** - identifier is required when there is more than one connection
 - **settings** - setting object passed to native `connect` method 

```
var Model = require('hapi-app-mongo-model'),
	connConfig;

connConfig = {
	url: 'mongodb://localhost:27017',	
	connectionID: 'my-awesome-mongo-connection',
	settings: {
		 "db": {
            "native_parser": false
        }
	}
}

Model
	.connect(connConfig)
	.then(function (db) {
		// ... CRUD 		
	}, function (error) {
		throw new Error(error);		
	});
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

### Using Model as plugin with hapi `Model.plugin`
> done, there are no tests yet

```
var Hapi = require('hapi'),
	server = new Hapi.Server();

server.connection({ port: 3000 });
server.register({
	"url": "mongodb://localhost:27017/test",
	"settings": {
		"db": {
			"native_parser": false
		}
	}
}, function (error) {
	//...
	server.start();
});
```

### Shared connections `Model.dbs`
> done, there are no tests yet

Array of all open db connections.

`Model.connect(settings)` takes one configuration at the time. However, it can be called multiple times with different configuration settings to open multiple and keep alive multple connections. 


Array of db connection objets is made of:
```
{ 
	db: null, 			// connection
	settings: null, 	// settings used to start connection
	error: null 		// error log if failed to connect
}
```

### Schamas

Models are required to have `schema.js` file which exports model object schema ready for validation with `Joi.validate()`.

Simply follow [Joi docs][hapijs-joi-url] to create one.
Check example code to see it in action.

### Indexes
> pending, todo: look at ensureIndexes in hapi-mongo-models 

### Custom Model namespaced methods

Methods exposed on the level of Custom Model are equivalent to collection methods, and so for example call to below method `update()`:
```
var Model = require('hapi-app-mongo-model');
Model.dbs[{connection-id}].collection[{collection-name}].update( ... )
```

can be conviniently simplified to:
```
var UserModel = require('/path/to/user-model');
UserModel.update( ... )
```

#### Creating Model Classes `Model.generate()`

Method used to generate Custom Model Class takes config object with three parameters:
 - **collection** - name of mongoDB collection 
 - **connectionId** - optional if there is just one established connection,  identifier is required when there is more than one connection
 - **path** - path to Custom Model directory directory with schema, dao and helpers files.
 
Example Model Class generation:

```
var Model = require('hapi-app-mongo-model')
	modelTaskConfig;

modelTaskConfig = {
    collection: "tasks",
    connectionId: "my-connection",
    path: __dirname
}

module.exports = Model.generate(modelTaskConfig);
```

#### Find method `Model.find()`
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

### Custom DAO helpers
> pending
> todo: <ModelClass> should conform to prototypal inheritance with parent class method exposed via \_super
> that will allow to override them in models/model/dao.js

### Model Object helpers

#### Save `<modelObject>.save()`
> pending

#### Update `<modelObject>.update()`
> pending

#### Validate `<modelObject>.validate()`
> status: implemented but no tests

`validate()` is async method and returns a [promise][git-mpromise-url].
It can be handled in one of two ways as shown below.

Method 1: `promise.then(onSuccess, onError)`
```
user.validate()
	.then(function onSuccess(data) {	    
	    //.. do something with data 
	}, function onError(error) {
	    //.. do something with error 
	});
```

Method 2: `promise.onFulfill(onSuccess).onReject(onError)`
```
user.validate()
	.then(function onSuccess(data) {	    
	    //.. do something with data 
	}, function onError(error) {
	    //.. do something with error 
	});
```

#### Helper `<modelObject>.remove()`
> pending

## Resources
 
> BIG **THANK YOU** TO ALL THE AUTHORS FOR DEVELOPING THOSE GREAT PACKAGES, FOR MAKING CODING EASIER, FASTER AND MORE FUN! 
> 
> **CHEEERIO!!!**


#### Used HapiJs package

 - [Hapi][hapijs-url] - A rich framework for building applications and services
 - [Hoek][hapijs-hoek-url] - Utility methods for the hapi ecosystem
 - [Good][hapijs-good-url] - Hapi process monitoring
 - [Boom][[hapijs-boom-url] - HTTP-friendly error objects
 - [Joi][hapijs-joi-url] - Object schema description language and validator for JavaScript objects.

### Used packages
 

- [aheckmann/mpromise][git-mpromise-url] - A promises/A+ conformant implementation
- [hapi-mongo-models][hapi-mongo-models-url]
- [hapi-mongodb][hapi-mongodb-url] 

[hapijs]: https://github.com/hapijs/good
[hapijs-url]: http://hapijs.com
[hapijs-hoek-url]: https://github.com/hapijs/hoek
[hapijs-joi-url]: https://github.com/hapijs/joi
[hapijs-boom-url]: https://github.com/hapijs/boom

[git-mpromise-url]: https://github.com/aheckmann/mpromise
[hapi-mongo-models-url]: https://github.com/jedireza/hapi-mongo-models
[hapi-mongodb-url]: https://github.com/Marsup/hapi-mongodb