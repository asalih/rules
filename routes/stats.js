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

    app.get("/rates/:rule/:which", function (req, res) {
        switch (req.params.which) {
            case "errors":
            
                db.stats.count({ $lt: { name: req.params.rule }, $where: function(){ return this.errors.length > 0 } }, function (err, count) {
                    res.render("rule-stats", { count: count });
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

}