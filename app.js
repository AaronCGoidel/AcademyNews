var express = require("express");
var app = express();
var router = express.Router();
var pg = require('pg');
var bodyParser = require('body-parser');
var md = require('marked');
var moment = require('moment');
var cookieParser = require('cookie-parser');
var crypto = require('crypto');
const db = require('./models');

var AUTH_TOKEN = "HZMhR6YCtsgesm47T5uRMDqam9SDbuXElFdj1oMXhZk="; // I'm just gonna store the hash right here


pg.defaults.ssl = true;

var config = require(__dirname + '/config.js');

// static files
app.use(express.static(__dirname + '/public'));


var PORT = process.env.PORT || config.express.port;

app.set("view engine", "pug");

// test database connection
db.sequelize
    .authenticate()
    .then(() =>{
        console.log('[DATABASE]Connection has been established successfully.');
    })
    .catch(err =>{
        console.error('[DATABASE]Unable to connect to the database:', err);
    });

router.use(function(req, res, next){
    console.log("/" + req.method);
    next();
});

router.use(bodyParser.urlencoded({extended: false}));
router.use(cookieParser());

// ==================USER PAGES==================
// homepage
router.get("/", async function(req, res){

    // query for featured articles
    const featuredQuery = db.Article.findAll({
        where: {
            id: [config.featured.article1ID, config.featured.article2ID, config.featured.article3ID]
        }
    });

    // query for the latest 5, non featured articles
    const articlesQuery = db.Article.findAll({
        limit: 5,
        where: {
            id: {$notIn: [config.featured.article1ID, config.featured.article2ID, config.featured.article3ID]}
        },
        order: [['createdAt', 'DESC']]
    });

    const featuredPosts = await featuredQuery;
    const articles = await articlesQuery;

    // render homepage with articles
    res.render("index", {moment, featuredPosts, articles});
});

// route for displaying a article page
router.get("/article/*", function(req, res){
    // get article id from url
    var getID = /[^/]*$/.exec(req.path)[0];

    // query database for article with id from url
    db.Article.findOne({
        where: {
            id: getID
        }
    }).then(currentArticle => res.render("article", {md, moment, currentArticle}));
});

// serve articles based on a tag
router.get("/category/:tag", function(req, res){
    if(req.params.tag === "all"){
        db.Article.findAll({
            order: [['createdAt', 'DESC']]
        }).then(posts => res.render("category", {moment, posts}));
    } else{
        db.Article.findAll({
            where: {
                tags: {$contains: [req.params.tag]}
            },
            order: [['createdAt', 'DESC']]
        }).then(posts => res.render("category", {moment, posts}));
    }
});

// used for links that do not have an implemented destination
router.get("/coming_soon", function(req, res){
    res.render("comingSoon")
});

// ==================ADMIN PAGES==================
// middleware for authenticating admin
function authMiddleware(req, res, next){
    if(req.cookies.token === AUTH_TOKEN){
        next();
    } else{
        res.status(401).redirect("/admin/login").end();
    }
}

// login for admin users
router.get("/admin/login", function(req, res){
    res.render("admin/login")
});

// cookie auth token
router.post("/auth", function(req, res){
    if(crypto.createHash('sha256').update(req.body.pw).digest('base64') === AUTH_TOKEN){
        res.cookie("token", AUTH_TOKEN);
        res.redirect("/admin/upload")
    } else{
        res.status(401).redirect("/admin/login").end();
    }
});

// authenticated route to access upload page
router.get("/admin/upload", authMiddleware, function(req, res){
    res.render("admin/upload")
});

// post article with content from form
router.post("/upload", authMiddleware, function(req, res){
    var tags = req.body.tag.split(",");
    var id = req.body.title
        .toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-');

    const {author, title, blurb, content, imageURL, photoCred} = req.body;
    db.Article.create({author, id, title, blurb, content, imageURL, photoCred, tags});
    res.redirect(`/article/${id}`);
});

// authenticated route to delete an article by id
router.get("/admin/delete", authMiddleware, function(req, res){
    res.render("admin/delete")
});

// run deletion based on post from delete page
router.post("/delete", authMiddleware, function(req, res){
    db.Article.destroy({where: {id: req.body.id}});
    res.redirect("/")
});

// ==================BASIC ROUTING==================
app.use("/", router);

// 404 page: render and throw
app.use("*", function(req, res){
    res.status(404).render("404");
});

app.listen(PORT, function(){
    console.log("Listening on Port " + PORT);
});
