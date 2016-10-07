module.exports = {
    execute: function (args, result) {
        if (args.customer.customerEmail == "") {
            result.addError("email", "customer email is empty!");
        }

        if (args.basket.totalPrice > 1000) {
            result.addError("payment", "price is too damn high!");
        }

        this.sendToApi(result);
    },
    sendToApi: function (result) {
        /*https*/http.get({
            hostname: 'www.example.net',//some api url
            port: 80,
            path: '/',
            agent: false
        }, (res) => {
            var code = res.statusCode;
            var key = res.socket._host;
            switch (code) {
                case 200:
                    result.addSuccess(key, code);
                    break;
                case 404:
                    result.addError(key, code);
                    break;
              default:
                result.addWarning(key, code);
            }

            result.send();
        });
    }
}