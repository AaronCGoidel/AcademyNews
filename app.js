var express = require("express");
var app = express();
var router = express.Router();

r = require('rethinkdb');

var config = require(__dirname + '/config.js');

var connection = null;
r.connect( config.rethinkdb, function(err, conn) {
    if (err) throw err;
    connection = conn;
});

app.use(express.static(__dirname + '/public'));
var path = __dirname + '/public/views/';

var PORT = config.express.port;

router.use(function (req,res,next) {
    console.log("/" + req.method);
    next();
});

router.get("/",function(req,res){
    res.sendFile(path + "index.html");

});

app.use("/",router);

app.use("*",function(req,res){
    res.sendFile(path + "404.html");
});

app.listen(PORT,function(){
    console.log("Listening on Port " + PORT);
});