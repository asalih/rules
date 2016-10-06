# rules [![Build Status](https://travis-ci.org/asalih/rules.svg?branch=master)](https://travis-ci.org/asalih/rules)
Node js rule executer app. 

![screen shot 2016-09-26 at 14 41 57](https://cloud.githubusercontent.com/assets/4123460/18833530/c039e75e-83f9-11e6-8366-41a12fd6b69f.png)

## Usage

### Execute rules

You can post the url with json object in request body;

/exec/:rule-name

![screen shot 2016-09-26 at 22 12 00](https://cloud.githubusercontent.com/assets/4123460/18848219/18c970b0-8436-11e6-85fe-1687d86c52dd.png)

If you want to execute more than one rule at the same time with the same body then use ;

/execMany/:rule-name1,rule-name2,rule-name3

![screen shot 2016-09-26 at 22 12 00](https://cloud.githubusercontent.com/assets/4123460/18848239/235b16e6-8436-11e6-8e83-406bd80d1f67.png)

#### Rule Body

Modules must have **'execute'** function. When you want to execute a rule, application calls **'execute'** function with the parameters.

**'execute'** function has two parameters.

**'args'**: This one keeps posted json object.

**'result'**: Response object.

**important**: When the rule executed, last thing you have to do is call **result.send()**. In case, if you are making http request, then call the function when response got in.
```javascript
module.exports = {
    execute: function (args, result) {
        //logic.

        //when you finish your job, send the result.
        result.send();
    }
}
```

Example:
```javascript
//JSON body:
{ "basket": { "totalPrice": 10 }, "customer": { "customerEmail": "a@b.com" } }
```
You can use object like, "args.basket.totalPrice" in the rule body.
```javascript
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

        //don't forget the send result.
        result.send();
    }
}
```

Http request example
```javascript
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
            //do some thing

            //we call this in callback function if you wait from anything from response.
            result.send();
        });

        //if you want to fire and forget simply send result.
        //result.send();
    }
}
```


### Rule Management
Add new Rule and, write your own logic or update from ui.

![screen shot 2016-09-26 at 14 42 25](https://cloud.githubusercontent.com/assets/4123460/18833536/cdf0ed5c-83f9-11e6-98d6-d1457bfb8352.png)

### Stats
This is provides small statistics. How many times executed, error rate etc. for general and each rules.

![screen shot 2016-09-26 at 14 45 12](https://cloud.githubusercontent.com/assets/4123460/18833549/d9a2b9dc-83f9-11e6-9bc6-85c81f6166c9.png)
