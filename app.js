var express = require("express");
var app = express();
var router = express.Router();
var Sequelize = require("sequelize");
var pg = require('pg');

pg.defaults.ssl = true;

var config = require(__dirname + '/config.js');

var connection = null;

app.use(express.static(__dirname + '/public'));


var PORT = process.env.PORT || config.express.port;

app.set("view engine", "pug");

const sequelize = new Sequelize(process.env.DATABASE_URL || config.data.URL);

sequelize
    .authenticate()
    .then(() => {
        console.log('[DATABASE]Connection has been established successfully.');
    })
    .catch(err => {
        console.error('[DATABASE]Unable to connect to the database:', err);
    });

const Article = sequelize.define('article', {
    author: {
        type: Sequelize.STRING
    },
    id: {
        type: Sequelize.STRING,
        primaryKey: true
    },
    title: {
        type: Sequelize.STRING
    },
    blurb: {
        type: Sequelize.STRING
    },
    content: {
        type: Sequelize.STRING
    }
});

router.use(function (req,res,next) {
    console.log("/" + req.method);
    next();
});

router.get("/", async function (req, res) {

    const featuredQuery = Article.findAll({
        where: {
            id: [config.featured.article1ID, config.featured.article2ID, config.featured.article3ID]
        }
    });

    const articlesQuery = Article.findAll({
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

// router.get("/article/*", function(req, res) {
//     var getID = /[^/]*$/.exec(req.path)[0];
//     r.table('articles').filter(r.row('id').eq(getID)).run(connection, function(err, cursor) {
//         if (err) throw err;
//         cursor.toArray(function(err, result) {
//             if (err) throw err;
//             console.log(result);
//             res.render("article", {result})
//         });
//     });
// });

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