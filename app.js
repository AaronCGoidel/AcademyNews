var express = require("express");
var app = express();
var router = express.Router();
var Sequelize = require("sequelize");

console.log("USED")

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


var data = {};
router.get("/", function (req, res) {
    Article.findAll({
        where: {
            id: [config.featured.article1ID, config.featured.article2ID, config.featured.article3ID]
        }
    }).then(featured => data['featuredPosts'] = featured);
    Article.findAll({
        where: {
            id: {$notIn: [config.featured.article1ID, config.featured.article2ID, config.featured.article3ID]}
        },
        order: [Article, 'createdAt', 'DESC'],
        limit: 5
    }).then(posts => data['articles'] = posts);
    //res.render("index", {data})
    console.log("[DATA]"+data);
});

// router.get("/", async (req,res, next) => {
//     try {
//         const cursor = await r.table('articles')
//             .filter(r.row('id').eq(config.featured.article1ID)
//                 .or(r.row('id').eq(config.featured.article2ID))
//                 .or(r.row('id').eq(config.featured.article3ID)))
//             .run(connection);
//         const featuredPosts = await cursor.toArray();
//         res.render("index", {featuredPosts})
//     }catch(err){
//         next(err);
//     }
// });

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