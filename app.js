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


var PORT = process.env.PORT || config.express.port;;

app.set("view engine", "pug");

router.use(function (req,res,next) {
    console.log("/" + req.method);
    next();
});

router.get("/", async (req,res, next) => {
    try {
        const cursor = await r.table('articles')
            .filter(r.row('id').eq(config.featured.article1ID)
                .or(r.row('id').eq(config.featured.article2ID))
                .or(r.row('id').eq(config.featured.article3ID)))
            .run(connection);
        const featuredPosts = await cursor.toArray();
        res.render("index", {featuredPosts})
    }catch(err){
        next(err);
    }
});

router.get("/article/test", function(req, res){
    res.render("articleTest");
});

router.get("/article/*", function(req, res) {
    var getID = /[^/]*$/.exec(req.path)[0];
    r.table('articles').filter(r.row('id').eq(getID)).run(connection, function(err, cursor) {
        if (err) throw err;
        cursor.toArray(function(err, result) {
            if (err) throw err;
            console.log(result);
            res.render("article", {result})
        });
    });
});

router.get("/upload", function(req, res) {
    res.render("upload")
});

app.use("/",router);

app.use("*",function(req,res){
    res.render("404");
});

app.listen(PORT,function(){
    console.log("Listening on Port " + PORT);
});