# Hapi App Mongo Model 
[![build status](https://travis-ci.org/indieforger/hapi-app-mongo-model.svg)](https://travis-ci.org/indieforger/hapi-app-mongo-model)
[![dependencies](https://david-dm.org/indieforger/hapi-app-mongo-model.svg)](https://david-dm.org/indieforger/hapi-app-mongo-model#info=dependencies&view=table)
[![dev dependencies](https://david-dm.org/indieforger/hapi-app-mongo-model/dev-status.svg)](https://david-dm.org/indieforger/hapi-app-mongo-model#info=devDependencies&view=table)

Lightweight abstraction layer wrapping Monk api (MongoDB library)

> This package is not actively maintained. You should probably check out  [hapi-mongo-models](https://github.com/jedireza/hapi-mongo-models)


## Rationale

Most popular ODM for MongoDB manipulations from NodeJS is Mongoose. 
It is build on the top of MongoDB's native driver.
It is build with tone of features such us object schemas and validation.

Mongoose is however unnecesary if you would want to reuse Hapi Joi schemas for validation of your model objects or need lower level apis without package overhead.

Hapi-app-mongo-model is provides lightweight abstraction on the top of Monk,
which is abstraction over MongoDB native driver.

## Core features 

 - It can be used stand-alone or registered as Hapi plugin with `AppModel.plugin` extension
 - It allows to register custom `ModelClass`-es
 - It exposes mongo collection (monk) methods on custom `ModelClasses`, such us: 
 `find()`, `findOne()`, `insert()`, etc.
 - It allows to create Models before connection is established (no monk drawbacks)
 - It exposes sugar methods (returning promises) on `Model Classes`
 	+ `validate()`, 
 	+ `findAndParse()`, 
	+ `findOneAndParse()`
	+ `insertAndParse()`
	+ `forceFind()`
 - Helper methods available on `modelObject`:
 	+ `save()`,  
 	+ `validate()`
 	+ `toJSON()`
 	+ `toString()`
 - Ease of extensibility of the Helper and DAO methods ( see examples below )

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
	UserModel = Model.register({
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
Model will attempt to Connect to default mongo db url: 
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
 - **opts** - setting object passed to native `connect` method 

```
var Model = require('hapi-app-mongo-model'),
	connConfig;

connConfig = {
	url: 'mongodb://localhost:27017',	
	connectionID: 'my-awesome-mongo-connection',
	opts: {
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

// call build-in helper
console.log(user.toJSON());

// call local helper
console.log(user.fullName());
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
	"opts": {
		"db": {
			"native_parser": false
		}
	}
}, function (error) {
	//...
	server.start();
});
```

### Shared connection `Model.db`

`Model.connect(settings)` creates connection that can be accessed via:
 - `Model.db`
 - `YourModel.db`
 - `yourObject.db`


### Schamas

Models are required to have `schema.js` file which exports model object schema ready for validation with `Joi.validate()`.

Simply follow [Joi docs][hapijs-joi-url] to create one.
Check example code to see it in action.

### Indexes

Uses monk indexing exposed on collection.

### Custom Model namespaced methods

Methods exposed on the level of Custom Model are equivalent to collection methods, and so for example call to below method `update()`:
```
var Model = require('hapi-app-mongo-model');
Model.db.collection[{collection-name}].update( ... )
```

can be conviniently simplified to:
```
var UserModel = require('/path/to/user-model');
UserModel.update( ... )
```

#### Creating Model Classes `Model.register()`

Method used to generate Custom Model Class takes config object with three parameters:
 - **collection** - name of mongoDB collection 
 - **path** - path to Custom Model directory directory with schema, dao and helpers files.
 
Example Model Class generation:

```
var Model = require('hapi-app-mongo-model')
	modelTaskConfig;

modelTaskConfig = {
    collection: "tasks",
    path: __dirname
}

module.exports = Model.generate(modelTaskConfig);
```

#### Find method `Model.find()`

Convenience method

#### FindOne method `Model.findOne()`

Convenience method

#### ObjectId via `Model.ObjectId()` and `Model.ObjectID()`

Convenience method

### DAO helpers

#### Createing object via `new ModelClass(collectionName, [object])`


#### Createing object via `ModelClass.create(collectionName, [object])` 
Convenience method for `new ModelClass(collectionName, [object])`

> status: implemented but no tests

#### Find `<ModelClass>.find()`

Convenience method

#### FindOne `<ModelClass>.findOne()`

Convenience method

### Custom DAO helpers

> todo: missing test <ModelClass> to confirm prototypical inheritance with parent class method exposed via \_super
> that will allow to override them in models/model/dao.js

### Model Object helpers

#### Save `<modelObject>.save()`

Convenience method returns promise

#### Validate `<modelObject>.validate()`

Convenience method returns promise

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

#### Used HapiJs package

 - [Hapi][hapijs-url] - A rich framework for building applications and services
 - [Hoek][hapijs-hoek-url] - Utility methods for the hapi ecosystem
 - [Good][hapijs-good-url] - Hapi process monitoring
 - [Boom][hapijs-boom-url] - HTTP-friendly error objects
 - [Joi][hapijs-joi-url] - Object schema description language and validator for JavaScript objects.

### Used packages
 

- [aheckmann/mpromise][git-mpromise-url] - A promises/A+ conformant implementation
- [hapi-mongo-models][hapi-mongo-models-url]
- [hapi-mongodb][hapi-mongodb-url] 

[hapijs]: https://github.com/hapijs/good
[hapijs-url]: http://hapijs.com
[hapijs-hoek-url]: https://github.com/hapijs/hoek
[hapijs-good-url]: https://github.com/hapijs/good
[hapijs-joi-url]: https://github.com/hapijs/joi
[hapijs-boom-url]: https://github.com/hapijs/boom

[git-mpromise-url]: https://github.com/aheckmann/mpromise
[hapi-mongo-models-url]: https://github.com/jedireza/hapi-mongo-models
[hapi-mongodb-url]: https://github.com/Marsup/hapi-mongodb