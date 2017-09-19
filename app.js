var express = require("express");
var app = express();
var router = express.Router();
var pg = require('pg');
db = require('./models');

pg.defaults.ssl = true;

var config = require(__dirname + '/config.js');

app.use(express.static(__dirname + '/public'));


var PORT = process.env.PORT || config.express.port;

app.set("view engine", "pug");

db.sequelize
    .authenticate()
    .then(() => {
        console.log('[DATABASE]Connection has been established successfully.');
    })
    .catch(err => {
        console.error('[DATABASE]Unable to connect to the database:', err);
    });

router.use(function (req,res,next) {
    console.log("/" + req.method);
    next();
});

router.get("/", async function (req, res) {

    const featuredQuery = db.Article.findAll({
        where: {
            id: [config.featured.article1ID, config.featured.article2ID, config.featured.article3ID]
        }
    });

    const articlesQuery = db.Article.findAll({
        where: {
            id: {$notIn: [config.featured.article1ID, config.featured.article2ID, config.featured.article3ID]}
        }
    });

    const featuredPosts = await featuredQuery;
    const articles = await articlesQuery;

    res.render("index", {featuredPosts, articles});
});

router.get("/article/test", function(req, res){
    res.render("articleTest");
});

router.get("/article/*", function(req, res) {
    var getID = /[^/]*$/.exec(req.path)[0];
    db.Article.findOne({
        where: {
            id: getID
        }
    }).then(currentArticle => res.render("article", {currentArticle}))
});

router.get("/coming_soon", function(req, res) {
    res.render("comingSoon")
});

app.use("/",router);

app.use("*",function(req,res){
    res.render("404");
});

app.listen(PORT,function(){
    console.log("Listening on Port " + PORT);
});