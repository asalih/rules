module.exports = function (app) {
    app.get("/counts/:which", function (req, res) {
        switch (req.params.which) {
            case "active":
                db.rules.count({ state: true }, function (err, count) {
                    res.send({ count: count });
                });
                break;
            case "passive":
                db.rules.count({ state: false }, function (err, count) {
                    res.send({ count: count });
                });
                break;
            case "times":
                db.stats.count({}, function (err, count) {
                    res.send({ count: count });
                });
                break;

            default:
                res.send({ count: 0 });
                break;
        }
    });

    app.get("/rates/:rule", function (req, res) {
        var r = req.params.rule;
        var results = [];
        db.stats.count({ $where: function () { return this.rule.name == r && this.errors.length > 0 } }, function (err, errCount) {
            results.push(errCount);
        });

        db.stats.count({ $where: function () { return this.rule.name == r } }, function (err, timesExecuted) {
            results.push(timesExecuted);
        });

        var ival = setInterval(function () {

            if(results.length > 1){
                res.render("rule-stats", results);
                clearInterval(ival);
            }

        }, 10);
    
        


    });

}