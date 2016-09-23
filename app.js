
var express = require("express");
var bParser = require("body-parser");

var jade = require("jade");

var Datastore = require("nedb");
db = {};
db.rules = new Datastore("ruleDb/rules.db");
db.stats = new Datastore("ruleDb/stats.db");
db.rules.loadDatabase();
db.stats.loadDatabase();
db.rules.persistence.setAutocompactionInterval(15000);

var app = express();


app.use(bParser.json());
app.set('views', './view');
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));

require("./routes/manager.js")(app);
require("./routes/stats.js")(app);
require("./routes/rules-api.js")(app);


app.listen(8100);