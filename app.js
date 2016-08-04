var fs = require("fs");

var async = require("async");
var express = require("express");
var bParser = require("body-parser");

var Datastore = require("nedb");
db = {};
db.rules = new Datastore("ruleDb/rules.db");
db.stats = new Datastore("ruleDb/stats.db");
db.rules.loadDatabase();
db.stats.loadDatabase();
db.rules.persistence.setAutocompactionInterval(15000);

var restrict = require("./restrict");

var app = express();
app.use(bParser.json());


app.get("/", function (req, res) {
    res.send("rule engine is on!");
});

app.get("/rules", function (req, res) {
     db.rules.find({}, function(err, docs){
         res.send(docs);
     });

});

var rulesPath = __dirname + '\\rules';
app.post("/add", function(req, res){
    db.rules.findOne({name: req.body.name}, function(err, doc){
        if(doc == null){
            fs.writeFileSync(rulesPath + "\\" + req.body.name + ".js", req.body.body);

            db.rules.insert({name: req.body.name, ctime: Date.now(), utime: Date.now()});
            res.send("rule added!");
        }
        else{
            res.send("allready has rule with name " + req.body.name);
        }
    });
});


app.post("/update", function(req, res){
    db.rules.findOne({name: req.body.name}, function(err, doc){
        if(doc == null){
            res.send("can not find the rule with name " + req.body.name);
        }
        else{
            fs.writeFileSync(rulesPath + "\\" + req.body.name + ".js", req.body.body);
            db.rules.update(doc, {$set: {utime: Date.now()}});
            res.send("rule updated!");
        }
    });
});

app.post("/delete", function(req, res){
    db.rules.remove({name: req.body.name}, function(err, num){
        if(num>0){
            res.send("rule deleted!")
        }
        else{
            res.send("can not find the rule with name " + req.body.name);
        }
    });
});

app.post("/exec/:which", function (req, res) {
    db.rules.findOne({name: req.params.which}, function(err, doc){
        var file = fs.readFileSync(rulesPath + "\\"+ doc.name + ".js", 'utf8');
        var result = restrict.evaluate(file, req.body, doc.name);
        result.rule = doc;
        
        db.stats.insert(result);
        res.send(result);
    });
});
 
app.post("/execMany/:which",function(req, res){
    var rls = req.params.which.split(',');
    var mResult = [];

    for(var i in rls){
        
            db.rules.findOne({name: rls[i]}, function(err, doc){
                if(doc != null){
                    
                        var file = fs.readFileSync(rulesPath + "\\"+ doc.name + ".js", 'utf8');
                        var result = restrict.evaluate(file, req.body, doc.name);
                        result.rule = doc;
                        db.stats.insert(result);

                        mResult.push(result);
                }
                else{
                    mResult.push({msg: "invalid rule name."})
                }
        });
        
            
    }
 
    var ival = setInterval(function(){
        if(mResult.length >= rls.length){
            clearInterval(ival);
            res.send(mResult);
        }
    }, 100);

    

});

app.listen(8100);