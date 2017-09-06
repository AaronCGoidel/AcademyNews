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

app.set("view engine", "pug");

router.use(function (req,res,next) {
    console.log("/" + req.method);
    next();
});

router.get("/", (req,res) => {
    r.table('articles').filter(r.row('id').eq("001").or(r.row('id').eq("002"))).run(connection)
        .then(posts => res.render(path + "index.pug", {posts}))

});

router.get("/article/test", function(req, res){
    res.sendfile(path + "articleTemplate.html");
});

app.use("/",router);

app.use("*",function(req,res){
    res.sendFile(path + "404.pug");
});

app.listen(PORT,function(){
    console.log("Listening on Port " + PORT);
});