if(args.basket.totalPrice < 0.1){
    result.errors.push("price cannot be zero or negative!");
    result.hasError = true;
}


if(args.customer.customerEmail == "xyz@abc.com" || args.customer.customerEmail == "xyza@abc.com"){
    result.errors.push("unexpected email!")
    result.hasError = true;
}

if(args.basket.totalPrice > 1000){
    result.errors.push("risk!");
    result.hasError = true;
}
 