# Hapi App Mongo Model

Lightweight abstraction layer over native MongoDB driver for Hapi App

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

> *note* Mongoose is great ODM if want abstraction layer packed with tone of features and own validation. 
> Kudos for creators for all the hard work. 


## Todo

 - Model.plugin - hapi plugin - pending
 - Model.db - shared connection - pending
 - Model.create() - done, no tests
 - new Model() - done, no tests
 - Modes.find() - in progress
 - Model.findOne() - in progress
 - Model.ObjectId - pending
 - Model.ObjectID - pending
 - modelObject.save() - pending
 - modelObject.update() - pending
 - modelObject.validate() - pending
 - modelObject.remove() - pending
