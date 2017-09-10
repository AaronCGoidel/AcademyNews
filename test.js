var express = require("express");
var app = express();
var router = express.Router();
var Sequelize = require("sequelize");

var config = require(__dirname + '/config.js');

app.use(express.static(__dirname + '/public'));


var PORT = process.env.PORT || config.express.port;

app.set("view engine", "pug");

router.use(function (req,res,next) {
    console.log("/" + req.method);
    next();
});

router.get("/", function(req, res){
    console.log("test");
    res.render("404");
});

const sequelize = new Sequelize(process.env.DATABASE_URL || config.data.URL);

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

app.use("/",router);


app.listen(PORT,function(){
    console.log("Listening on Port " + PORT);
});

