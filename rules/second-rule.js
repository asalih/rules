module.exports = {
    execute: function (args, result) {
        if (args.customer.customerEmail == "") {
            result.addError("email", "customer email is empty!");
        }

        if (args.basket.totalPrice > 1000) {
            result.addError("payment", "price is too damn high!");
        }

        this.sendToApi();
    },
    sendToApi: function () {
        http.get({
            hostname: '192.168.1.1',//some api url
            port: 80,
            path: '/',
            agent: false
        }, (res) => {
            console.log(res.statusCode);
        });
    }
}