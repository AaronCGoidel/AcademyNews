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

router.get("/", function(req, res){
    console.log("test");
    res.render("404");
});

router.get('/db', function (request, response) {
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        client.query('SELECT * FROM test_table', function(err, result) {
            done();
            if (err)
            { console.error(err); response.send("Error " + err); }
            else
            { response.render('pages/db', {results: result.rows} ); }
        });
    });
});


app.use("/",router);


app.listen(PORT,function(){
    console.log("Listening on Port " + PORT);
});

