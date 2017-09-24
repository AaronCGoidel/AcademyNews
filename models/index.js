'use strict'

var fs = require('fs');
var path = require('path');
var Sequelize = require('sequelize');
var basename = path.basename(module.filename);
var config = require('../config.js');
var db = {};


var sequelize = new Sequelize(process.env.DATABASE_URL || config.data.URL);


db["Article"] = sequelize['import'](__dirname + "/article.js");

Object.keys(db).forEach(function(modelName){
    if(db[modelName].associate){
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
module.exports = db;