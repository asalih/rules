var fs = require("fs");

module.exports = function(app){
var rulesPath = __dirname + '\\..\\rules';
   app.get("/", function (req, res) {
    db.rules.find({}, function (err, docs) {
        res.render("index", { rules: docs });
    });
});

app.post("/stop", function (req, res) {
    db.rules.findOne({ name: req.body.name }, function (err, doc) {
        if (doc == null) {
            res.send({status: 404});
        }
        else {
            db.rules.update(doc, { $set: { state: false } });
            res.send(true);
        }
    });
});

app.post("/start", function (req, res) {
    db.rules.findOne({ name: req.body.name }, function (err, doc) {
        if (doc == null) {
            res.send({status: 404});
        }
        else {
            db.rules.update(doc, { $set: { state: true } });
            res.send(true);
        }
    });
});

app.get("/rule-body", function (req, res) {
    db.rules.findOne({ name: req.query.name }, function (err, doc) {
        if (doc == null) {
            res.send({status: 404});
        }
        else {
            var file = fs.readFileSync(rulesPath + "\\" + doc.name + ".js", 'utf8');
            res.send(file);
        }
    });

});

app.get("/get-row", function (req, res) {
    db.rules.findOne({ name: req.query.name }, function (err, doc) {
        if (doc == null) {
            res.send({status: 404});
        }
        else {
            res.render("tablerow", { fl: doc });
        }
    });

});


app.post("/add", function (req, res) {
    db.rules.findOne({ name: req.body.name }, function (err, doc) {
        if (doc == null) {
            fs.writeFileSync(rulesPath + "\\" + req.body.name + ".js", req.body.body);

            db.rules.insert({ name: req.body.name, ctime: Date.now(), utime: Date.now(), state: true });
            res.send({ success: true, msg: "rule added!" });
        }
        else {
            res.send({ success: false, msg: "allready has rule with name " + req.body.name });
        }
    });
});


app.post("/update", function (req, res) {
    db.rules.findOne({ name: req.body.name }, function (err, doc) {
        if (doc == null) {
            res.send({ success: false, msg: "can not find the rule with name " + req.body.name });
        }
        else {
            fs.writeFileSync(rulesPath + "\\" + req.body.name + ".js", req.body.body);
            db.rules.update(doc, { $set: { utime: Date.now() } });
            res.send({ success: true, msg: "rule updated!" });
        }
    });
});

app.post("/delete", function (req, res) {
    db.rules.remove({ name: req.body.name }, function (err, num) {

        if (num > 0) {
            fs.renameSync(rulesPath + "\\" + req.body.name + ".js", rulesPath + "\\" + req.body.name + "_del.bak");
            res.send({ success: true, msg: "rule deleted!" })
        }
        else {
            res.send({ success: true, msg: "can not find the rule with name " + req.body.name });
        }
    });
});
}