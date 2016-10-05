function Result() {
    this.errors = [],
        this.addError = function (key, value) {
            this.errors.push({ key: key, value: value });
        },
        this.hasErrors = function () {
            return this.errors.length > 0;
        },

        this.warnings = [],
        this.addWarning = function (key, value) {
            this.warnings.push({ key: key, value: value });
        },
        this.hasWarnings = function () {
            return this.warnings.length > 0;
        },

        this.success = [],
        this.addSuccess = function (key, value) {
            this.success.push({ key: key, value: value });
        },
        this.hasSuccesses = function () {
            return this.success.length > 0;
        },
        this.sys = [],
        this.start = 0,
        this.setStart = function () { this.start = Date.now() },
        this.end = 0,
        this.setEnd = function () { this.end = Date.now(); this.elapsed = this.end - this.start },
        this.elapsed = 0,
        this.rule = {};


}

module.exports = {
    funcs: [],
    addToFuncs: function (name, file) {
        if (!this.isTrustable(file)) {
            return { msg: "'require' not allowed directly!" };
        }
        var func = new Function(["args", "result"], file);
        this.funcs[name] = { func: func, timestamp: Date.now() }
    },
    hasFunc: function (name) {
        if (this.funcs[name]) {
            return true;
        }
        return false;
    },
    removeFunc: function (name) {
        if (this.hasFunc(name)) {
            delete this.funcs[name];
        }

    },
    isTrustable: function (f) {
        var r = new RegExp(/require(\(.*\)|(.*?))/gi);
        if (r.test(f)) {
            return false;
        }
        return true;
    },
    evaluate: function (name, args) {
        var result = new Result();
        result.setStart();

        try {
            var func = this.funcs[name].func;
            func(args, result);
        }
        catch (e) {
            result.sys.push(e.message);
        }
        result.setEnd();

        return result;
    }
} 
