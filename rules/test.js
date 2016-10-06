module.exports = {
    execute: function (args, result) {
      var a = 1;
      if(a == 1){
       result.addError("a", "1"); 
      }

      result.send();
	}
}