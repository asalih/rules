var restrict = require("./../restrict");
var Promise = require("promise");

module.exports = function (app) {
    app.post("/exec/:which", function (req, res) {
        db.rules.findOne({ name: req.params.which }, function (err, doc) {
            if (doc == null) {
                res.send({ msg: 'rule not found!' });
                return;
            }
            if (doc.state) {
                var result = restrict.evaluate(doc, req.body, res);
            }
            else {
                res.send({ msg: 'rule is disabled!' });
            }
        });
    });

    app.post("/execMany/:which", function (req, res) {
        var rls = req.params.which.split(',');

        db.rules.find({ name: { $in: rls } }, function (err, docs) {
            mResult = [];
            if (docs != null && docs.length > 0) {
                var map = docs.map(function (doc) {
                    if (doc.state) {
                        var result = restrict.evaluate(doc, req.body, res, true);
                        mResult.push(result);
                    }
                    else {
                        mResult.push({ done: true, msg: doc.name + " rule is disabled!" });
                    }
                    return true;
                });

                Promise.all(map).then(values => {
                    var ival = setInterval(function () {
                        if(mResult.filter(function(i){return i.done}).length == mResult.length){
                            clearInterval(ival);
                            res.send(mResult);
                        }
                    }, 3);
                });
            }
            else {
                mResult.push({ done: true, msg: "invalid rule name." });
                res.send(mResult);
            }
        });
    });
}