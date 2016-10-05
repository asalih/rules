if(args.customer.customerEmail == ""){  
    result.addError("email", "customer email is empty");      
}

if(args.basket.totalPrice > 1000){
    result.addError("payment", "price too damn high!");
}