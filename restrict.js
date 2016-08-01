module.exports = {
    isTrustable: function (f) {
        var r = new RegExp(/require(\(.*\)|(.*?))/gi);
        if(r.test(f)){
            throw new Error("'require' not allowed!");
        }
    },
    reval: function (file, args) {
        var result = { errors: [], hasError: false };
        this.isTrustable(file);
        
        eval(file);
        return result;
    }
    

} 
