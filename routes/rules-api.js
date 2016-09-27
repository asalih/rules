var fs = require("fs");
var restrict = require("./../restrict");

module.exports = function(app){
var rulesPath = __dirname + '\\..\\rules';
   app.post("/exec/:which", function (req, res) {
    db.rules.findOne({ name: req.params.which }, function (err, doc) {
        var file = fs.readFileSync(rulesPath + "\\" + doc.name + ".js", 'utf8');
        if (doc.state) {

            var result = restrict.evaluate(file, req.body, doc.name);
            result.rule = doc;

            db.stats.insert(result);
            res.send(result);
        }
        else {
            res.send({msg: 'rule is disabled!'});
        }
    });
});

app.post("/execMany/:which", function (req, res) {
    var rls = req.params.which.split(',');
    var mResult = [];

    for (var i in rls) {

        db.rules.findOne({ name: rls[i] }, function (err, doc) {
            if (doc != null) {
                if (doc.state) {
                    var file = fs.readFileSync(rulesPath + "\\" + doc.name + ".js", 'utf8');
                    var result = restrict.evaluate(file, req.body, doc.name);
                    result.rule = doc;
                    db.stats.insert(result);

                    mResult.push(result);
                }
                else {
                    mResult.push({ msg: "rule is disabled!" });
                }
            }
            else {

                mResult.push({ msg: "invalid rule name." });
            }
        });


    }

    var ival = setInterval(function () {
        if (mResult.length >= rls.length) {
            clearInterval(ival);
            res.send(mResult);
        }
    }, 5);



});
}