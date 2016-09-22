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
    },
    this.sys=[],
    this.start=0,
    this.setStart = function () {this.start = Date.now()},
    this.end=0,
    this.setEnd = function () {this.end = Date.now(); this.elapsed = this.end - this.start},
    this.elapsed =0,
    this.rule = {};
    
    
}

module.exports = {
    isTrustable: function (f) {
        var r = new RegExp(/require(\(.*\)|(.*?))/gi);
        if(r.test(f)){
            return false;
        }
        return true;
    },
    evaluate: function (file, args, which) {
        var result = new Result();

        if(!this.isTrustable(file)){
            result.sys.push("'require' not allowed directly!");
            return result;
        }
        
        result.setStart();
        
        try{
            var fnc = new Function(["args", "result"], file.replace(/\\n/gi, ""));
            fnc(args, result);
        }
        catch(e){
            result.sys.push(e.message);
        }
        result.setEnd();        

        return result;
    }
} 
