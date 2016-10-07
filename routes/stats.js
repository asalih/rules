module.exports = function (app) {
    app.get("/counts/:which", function (req, res) {
        var date = Date.now() - (1000 * 60 * 60);
        switch (req.params.which) {
            case "active":
                db.rules.count({ state: true }, function (err, count) {
                    res.send({ result: count });
                });
                break;
            case "passive":
                db.rules.count({ state: false }, function (err, count) {
                    res.send({ result: count });
                });
                break;
            case "times":
                db.stats.count({ "start": { $gte: date } }, function (err, count) {
                    res.send({ result: count });
                });
                break;
            case "elapsed":
                db.stats.find({ $where: function () { return this.start >= date } }, function (err, docs) {
                    var elapsed = 0;
                    for (var i = 0; i < docs.length; i++) {
                        elapsed += docs[i].elapsed;
                    }
                    var result = elapsed / docs.length;
                     
                    
                    result = Math.round(result * 100);
                    result /= 100;

                    

                    res.send({ result: result ? result : 0 });
                });
                break;

            default:
                res.send({ result   : 0 });
                break;
        }
    });

    app.get("/rates/:rule", function (req, res) {
        var r = req.params.rule;
        var date = Date.now() - (1000 * 60 * 60);
        var results = [];

        db.stats.count({ $where: function () { return this.start >= date && this.rule.name == r } }, function (err, timesExecuted) {
            results[0] = timesExecuted ? timesExecuted : 0;
        });

        db.stats.count({ $where: function () { return this.start >= date && this.rule.name == r && this.errors.length > 0 } }, function (err, errCount) {
            results[1] = errCount ? errCount : 0;
        });

        db.stats.count({ $where: function () { return this.start >= date && this.rule.name == r && this.warning.length > 0 } }, function (err, warningCount) {
            results[2] = warningCount ? warningCount : 0;
        });

        db.stats.find({ $where: function () { return this.start >= date && this.rule.name == r} }, function (err, docs) {
            var elapsed = 0;
            for (var i = 0; i < docs.length; i++) {
                elapsed += docs[i].elapsed;
            }
            var result = elapsed / docs.length;
            result = Math.round(result * 100);
            result /= 100;

            results[3] = result ? result : 0;
        });


        var ival = setInterval(function () {

            if (results.length > 3) {
                res.render("rule-stats", { name: r, res: results });
                clearInterval(ival);
            }

        }, 10);




    });

}