var fs = require("fs");
var express = require("express");
var bParser = require("body-parser");

var Datastore = require("nedb");
db = {};
db.rules = new Datastore("ruleDb/rules.db");

var restrict = require("./restrict");

var app = express();
app.use(bParser.json());


db.rules.insert({name: "first-rule", path: "first-rule.js"});
// app.get("/", function (req, res) {
//     res.send("rule engine is on!");
// });

// app.get("/rules", function (req, res) {
//     var files = fs.readdirSync(rulesPath);

//     res.send(files);

// });

var rulesPath = __dirname + '\\rules';
app.post("/add", function(req, res){
    var file = fs.readFileSync(rulesPath + "\\"+ req.params.which, 'utf8');
});

app.post("/exec/:which", function (req, res) {
    
    db.rules.findOne({name: "first-rule"}, function(err, doc){
        var file = fs.readFileSync(rulesPath + "\\"+ doc.path, 'utf8');
        var result = restrict.reval(file, req.body, doc.name)

    });
    
    res.send(result);
});

app.listen(8100);