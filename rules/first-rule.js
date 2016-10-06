module.exports = {
    execute: function (args, result) {
        if (args.basket.totalPrice < 0.1) {
            result.addError("price", "price cannot be zero or negative!");
        }

        if (args.customer.customerEmail == "xyz@abc.com" || args.customer.customerEmail == "xyza@abc.com") {
            result.addError("email", "unexpected email!");
        }

        if (args.basket.totalPrice > 1000) {
            result.addError("payment", "risk be careful!");
        }
        else if (args.basket.totalPrice > 500) {
            result.addWarning("payment", "risky!");
        }

        result.send();
    }
}