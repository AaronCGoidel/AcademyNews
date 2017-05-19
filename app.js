/**
 * Created by agoidel2019 on 5/16/17.
 */
var express = require("express");
var app = express();
var router = express.Router();


app.use(express.static(__dirname + '/public'));
var path = __dirname + '/public/views/';

var PORT = 5050;

router.use(function (req,res,next) {
    console.log("/" + req.method);
    next();
});

router.get("/",function(req,res){
    res.sendFile(path + "index.html");
});

router.get("/nav",function (req,res) {
    res.sendfile(path + "nav.html")
})

app.use("/",router);

app.use("*",function(req,res){
    res.sendFile(path + "404.html");
});

app.listen(PORT,function(){
    console.log("Listening on Port " + PORT);
});