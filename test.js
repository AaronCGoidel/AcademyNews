var express = require("express");
var app = express();
var router = express.Router();
var pg = require('pg');

var config = require(__dirname + '/config.js');

app.use(express.static(__dirname + '/public'));


var PORT = config.express.port;

router.use(function (req,res,next) {
    console.log("/" + req.method);
    next();
});



pg.defaults.ssl = true;
pg.connect(process.env.DATABASE_URL, function(err, client) {
    if (err) throw err;
    console.log('Connected to postgres! Getting schemas...');

    client
        .query('SELECT table_schema,table_name FROM information_schema.tables;')
        .on('row', function(row) {
            console.log(JSON.stringify(row));
        });
});

app.use("/",router);

app.use("*",function(req,res){
    res.render("404");
});

app.listen(PORT,function(){
    console.log("Listening on Port " + PORT);
});

