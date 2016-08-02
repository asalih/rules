function Result(){
    this.errors = [],
    this.addError=function (key, value) {
      this.errors.push({key: key, value: value });
    },
    this.hasErrors = function () {
        return this.errors.length > 0;
    },
    
    this.warnings=[],
    this.addWarning = function (key, value) {
        this.warnings.push({key: key, value: value });
    },
    this.hasWarnings = function () {
        return this.warnings.length > 0;
    },

    this.success=[],
    this.addSuccess = function (key, value) {
        this.success.push({key: key, value: value });
    },
    this.hasSuccesses = function () {
        return this.success.length > 0;
    }
    
}

module.exports = {
    isTrustable: function (f) {
        var r = new RegExp(/require(\(.*\)|(.*?))/gi);
        if(r.test(f)){
            throw new Error("'require' not allowed!");
        }
    },
    reval: function (file, args) {
        var result = new Result();

        this.isTrustable(file);
        
        eval(file);
        return result;
    }
} 
