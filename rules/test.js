if(args.count == 0){
	result.addError("count", "is zero");
}

if(args.count > 15){
 result.addWarning("count", "upper"); 
}