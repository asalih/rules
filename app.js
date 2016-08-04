var fs = require("fs");
var express = require("express");
var bParser = require("body-parser");

var restrict = require("./restrict");

var app = express();
app.use(bParser.json());

var rulesPath = __dirname + '\\rules';

app.get("/", function (req, res) {
    res.send("rule engine is on!");
});

app.get("/rules", function (req, res) {
    var files = fs.readdirSync(rulesPath);

    res.send(files);

});

app.post("/exec/:which", function (req, res) {
    var file = fs.readFileSync(rulesPath + "\\"+ req.params.which, 'utf8');
    
    var result = restrict.reval(file, req.body, req.params.which)
    res.send(result);
});

app.listen(8100);