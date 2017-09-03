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

router.get("/article/*",function(req, res){
    res.sendfile(path + "test.html");
    var getID = /[^/]*$/.exec(req.path)[0];
    console.log(getID);
    r.table('articles').filter(r.row('id').eq(getID)).run(connection, function(err, cursor) {
        if (err) throw err;
        cursor.toArray(function(err, result) {
            if (err) throw err;
            console.log(JSON.stringify(result, null, 2));
        });
    });
});

app.use("/",router);

app.use("*",function(req,res){
    res.sendFile(path + "404.html");
});

app.listen(PORT,function(){
    console.log("Listening on Port " + PORT);
});