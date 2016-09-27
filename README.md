# rules [![Build Status](https://travis-ci.org/asalih/rules.svg?branch=master)](https://travis-ci.org/asalih/rules)
Node js rule executer. 

![screen shot 2016-09-26 at 14 41 57](https://cloud.githubusercontent.com/assets/4123460/18833530/c039e75e-83f9-11e6-8366-41a12fd6b69f.png)

## Usage

### Execute rules

You can post the url with json object in request body;

/exec/:rule-name

![screen shot 2016-09-26 at 22 12 00](https://cloud.githubusercontent.com/assets/4123460/18848219/18c970b0-8436-11e6-85fe-1687d86c52dd.png)

If you want to execute more than one rule at the same time use;

/execMany/:rule-name1,rule-name2,rule-name3

![screen shot 2016-09-26 at 22 12 00](https://cloud.githubusercontent.com/assets/4123460/18848239/235b16e6-8436-11e6-8e83-406bd80d1f67.png)

#### Rule Body
In the rule body, we have 'args' object. It keeps posted json object. For example if you post;

```javascript
{ "basket": { "totalPrice": 10 }, "customer": { "customerEmail": "a@b.com" } }

//You can use object like, "args.basket.totalPrice" in the rule body.

if(args.basket.totalPrice <= 0){
  result.addError("price", "price cannot be zero");
}
else if(args.basket.totalPrice > 500){
  result.addWarning("price", "big price check");
}
```



### Rule Management
Add new Rule and, write your own logic or update from ui.

![screen shot 2016-09-26 at 14 42 25](https://cloud.githubusercontent.com/assets/4123460/18833536/cdf0ed5c-83f9-11e6-98d6-d1457bfb8352.png)

### Stats
This is provides small statistics. How many times executed, error rate etc. for general and each rules.

![screen shot 2016-09-26 at 14 45 12](https://cloud.githubusercontent.com/assets/4123460/18833549/d9a2b9dc-83f9-11e6-9bc6-85c81f6166c9.png)
