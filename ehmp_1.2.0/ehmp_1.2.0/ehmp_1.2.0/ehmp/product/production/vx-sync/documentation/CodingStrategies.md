Javascript Coding Strategies
============================

##### Steven Reich (steven.reich@agilex.com)

Looping
-------

Almost every situation where you would use a for-loop can be rewritten to use one of the iterator functions from the [Underscore](http://underscorejs.org/) or [Lodash](https://lodash.com/) libraries. There are two significant advantages in using an iterator function:

* Unlike a for-loop, the function used in an iterator function has its own scope.
* Iterator functions are self-documenting as to their purpose.

Let's examine this with a few examples. First, consider this for-loop:

```
var itemList = [1, 3, 6, 234, 3454, 3, 8, 648, 6459, 32, 26];
var resultList = [];
for(var i = 0; i < itemList.length; i++) {
  var computedResult = itemList[i] + Date.now();
  if(computedResult % 2 === 0) {
    resultList.push(itemList[i]);
  }
}
```

That is a fairly straighforward example--it shouldn't take too long to figure out what it does. Note that in addition to everything else, the `i`, and `computedResult` variables will continue to exist past the for-loop since a for-loop does not provide a scope.

Now we can rewrite this using the `_.each()` function:

```
var _ = require('underscore');

var itemList = [1, 3, 6, 234, 3454, 3, 8, 648, 6459, 32, 26];
var resultList = [];
_.each(itemList, function(item) {
  var computedResult = item + Date.now();
  if(computedResult % 2 === 0) {
    resultList.push(item);
  }
});
```

That should be a little clearer. In addition, it has the advantage that once the `_.each()` function has completed, the `item` and `computedResult` variables will go out of scope and can be reclaimed by garbage collection. However, this technique still have the disadvantage that the general purpose of the operation is not immediately clear. However, one more rewrite makes it much more clear.

```
var _ = require('underscore');

var itemList = [1, 3, 6, 234, 3454, 3, 8, 648, 6459, 32, 26];
var resultList = _.filter(itemList, function(item) {
  return (item + Date.now()) % 2 === 0;
});
```

Someone familiar with [Underscore](http://underscorejs.org/) will immediately recognize that by using `_.filter()`, we are selecting a subset of the original collection according to some criteria.


Partial Application
-------------------

This concept is somewhat advanced, but common to functional programming. By using the `bind()` function from the `Function.prototype` object, we can perform *partial application*. Here are a few contrived examples, and then I'll give you an example where I combine it an iterator function to save a few lines of programming.

The `bind()` function allows use to do two things. First, it allows us to bind a function to a particular object. Consider this function:

```
function dumpX() {
  console.log(this.x);
}
```

If you run this, as-is, it will print out 'undefined' as `this.x` is not defined. However, if you create and object with a member, `x`, you can bind to that object:

```
var obj = {
  x: 'test value'
};

var objDumpX = dumpX.bind(obj);
```

Now, if you run `objDumpX()`, it will print the value of `x` in `obj`.

Strictly speaking, `bind()` is a higher-order function that returns another function. In our example, we assigned the function returned by `bind()` to the variable `objDumpX`.

Now that we've looked at the first use of `bind()`, let's look at the other use: *partial application*. Any parameters passed to `bind()` after the first one are "pre-applied" to the on which it was called. This is best illustrated through two examples:

```
// our base function - it should be obvious what this does.
function add(x, y) {
  return x + y;
}

var add1 = add.bind(null, 1);
var add2 = add.bind(null, 2);

// This returns 4
add1(3);

// This returns 6
add2(4);
```

In the examples bind() returned functions that applied set values to the first parameter. Note that we passes `null` as the first parameter because we didn't need to bind to a particular object.

We could bind to more than one parameter, such as in this silly example:
```
var make11 = add.bind(null, 1, 10);

// returns 11
make11();
```

Now let's see what we can do with this in combination with the `_.map()` function. We'll do it in stages from a for-loop to a single-line call to `_.map()` to give an idea of how powerful it is.
```
var _ = require('underscore');

function computeWithTip(tip, amount) {
  return amount * (1 + tip);
}

var billList = [10.17, 25.47, 43.19, 12.95, 43.19];
var computedList;

// It works okay as-is. You could combine the statements
// inside of the for-loop, although it's a little less
// comprehensible, in my opinion.
computedList = [];
for(var i = 0; i < billList.length; i++) {
  var amountWithTip = computeWithTip(0.20, billList[i]);
  computedList.push(amountWithTip);
}

// now, with _.map()
computedList = _.map(billList, function(bill) {
  return computeWithTip(0.20, bill);
});

// now, with bind() and _.map() in one line
computedList = _.map(billList, computeWithTip.bind(null, 0.20));
```

While this example is somewhat contrived, it shows how powerful `bind()` can be. Just be careful, as it is easy to overdo it and make things even less comprehensible.


Variadic Functions
------------------

Functions that can take a variable number of arguments are known as *Variadic Functions*. If you come from the Java world, you can think of them as the Javascript way to do overloaded functions and/or variable length parameter lists. Perhaps the simplest use-case for a variadic function is to provide a way to allow developers to use a function that can take a variable number of parameters without requiring them to put the parameters in an array. Consider an averaging function written to take a list of numbers to average and then rewritten as a variadic function:
```
// Note that we use _.reduce() - which you might want to look up.
function averageOfArray(list) {
  var total = _.reduce(list, function(memo, num) {
    return memo + num;
  });

  return total / list.length;
}

// this will be pretty much the same except that we use the
// arguments object
function averageOfParams() {
  var total = _.reduce(arguments, function(memo, num) {
    return memo + num;
  });

  return total / arguments.length;
}

// these two calls will return the same result:
averageOfArray([2, 4, 6, 8, 10]);
averageOfParams(2, 4, 6, 8, 10);
```

Now to give you an idea of what you can do with a variadic function, here is a semi-contrived example that allows a couple different options for parameters but with the aim of eliminating the need to pass a `null` or `undefined` in for an optional parameter as a placeholder:
```
// This function accepts 4 different combinations of parameters. It's sort of like
// having 4 overloaded versions of a function in Java.
// Assume that fetch() is a function that makes an asynchronous call and makes a
// callback when it is done. It doesn't matter what it does, just that it takes
// two parameters so that it would be called like so: fetch(config, callback)

// Our function is called fetchFromSite; there are four ways it can be called:
// fetchFromSite(logger, config, responseInJson, callback)
// fetchFromSite(logger, config, callback)
// fetchFromSite(logger, responseInJson, callback)
// fetchFromSite(logger, callback)
//
// This implementation will not do all of the error checking, but it will be enough
// to give you an idea of what we need to consider.
var _ = require('underscore');

function fetchFromSite(logger, config, responseInJson, callback) {
  var defaultConfig = {
    host: 'localhost',
    port: 8080,
    path: '/'
  };

  if(arguments.length === 3) {
    callback = arguments[2];
    if(_.isBoolean(arguments[1])) {
      responseInJson = arguments[1];
      config = defaultConfig;
    } else {
      responseInJson = false;
    }
  }

  logger.debug('Calling fetch() json? %s', responseInJson);
  logger.debug(config);

  fetch(config, function(error, result) {
    if(error) {
      logger.error(error);
      return callback(error);
    }

    var response;
    if(responseInJson) {
      logger.debug('parsing response from JSON');
      try {
        response = JSON.parse(responseInJson);
      } catch (error) {
        logger.error('failed to parse response');
        return callback(error, result);
      }
    }

    callback(null, response);
  });
}
```

Putting It All Together with Async
----------------------------------

As a sort of extra-credit section, I will show how we can use everything I've described in conjunction with the [Async](https://github.com/caolan/async) library. The library itself is too involved to get into here now, beyond saying that it is a way to tie together asynchronous calls (such as our `fetchFromSite()` function) in an elegant way. For our example, we will use `parallel()`, which makes asynchronous calls in parallel and collects the results in an object.

In our example, we will take a list of configurations (i.e. URLs) and collect the results so that we can search or manipulate them. If you're running this to try it out, you'll need to copy and paste the `fetchFromSite()` function in from the previous example
```
var _ = require('underscore');
var async = require('async');
var util = require('util');

var logger = require('bunyan').createLogger({
    name: 'logger'
});

// dummy implementation to fake a network call
function fetch(config, callback) {
    var url = config.protocol + '://' + config.host + ':' + config.port + config.path;
    var delay = config.timeout || 300;

    // this is so that you can simulate an error
    if(config.error) {
      return setTimeout(callback, delay, config.error);
    }

    setTimeout(callback, delay, null, url);
}

var sites = [{
    name: 'Subject1',
    config: {
        protocol: 'http',
        host: 'hostone',
        port: 8080,
        path: '/somepage/10'
    }
}, {
    name: 'Subject2',
    config: {
        protocol: 'http',
        host: 'hosttwo',
        port: 9080,
        path: '/page/25',
    }
}, {
    name: 'Subject3',
    config: {
        protocol: 'http',
        host: 'hostthree',
        port: 8888,
        path: '/section/5',
    }
}];

var fetchMap = _.reduce(sites, function(memo, site) {
    memo[site.name] = fetchFromSite.bind(null, logger, site.config, true);
    return memo;
}, {});


async.parallel(fetchMap, function(error, results) {
    // Now I've got all of the results, or an error if any one
    // of them failed.
    if (error) {
        logger.error('fetch failed');
        logger.error(error);
        return;
    }

    // Do what I need with all of the results.
    logger.info(util.inspect(results, { depth: null }));
});
```

Using `bind()` to Test Instance Methods
---------------------------------------

Since instance methods can modify the state of the associated object and call other instance methods, it can be difficult to test individual instance methods in isolation. However, using `bind()` allows us to tightly control exactly what code is tested. Consider this class:

```
function MessageDispatcher(config) {
  this.config = config;
  this.mvi = new MviClient(config.mvi.host, config.mvi.port, config.mvi.path);
  this.beanstalkClient = new BeanstalkClient(config.beanstalk.host,
      config.beanstalk.port, config.beanstalk.path);
}

MessageDispatcher.prototype.send = function(job, callback) {
  this.mvi.lookup(job.patientIdentifier, function(error, result) {
    if(error) {
      return callback(error);
    }

    job.idList = result;

    this.beanstalkClient.put(job, function(error, result) {
      callback(error, result);
    })
  });
};
```
Assuming that the `BeanstalkClient()` constructor function opens a socket connection to beanstalk, it might appear that there is not simple way to write a unit test for `send()`. However, using `bind()`, you can "detach" `send()` from `MessageDispatcher` and attach it to another object. For example, you might want to verify the behavior when a call to `MviClient.lookup()` or `BeanstalkClient.put()` returns an error in the callback. Here are two objects to do that.

```
var mviErrorObj = {
  mvi: {
    lookup: function(job, callback) {
      callback('mvi error');
    }
  },
  beanstalkClient: function(job, callback) {
    callback(null, 'success');
  }
};

var beanstalkErrorObj = {
  mvi: {
    lookup: function(job, callback) {
      callback(null, [{type: 'pid', value: '9E7A;3'}, {type: 'pid', value: 'C877;3'}, {type: 'icn': value: '10110V004877'}]);
    }
  },
  beanstalkClient: function(job, callback) {
    callback('beanstalk error');
  }
};
```
Now you have two objects with mock MviClient and mock BeanstalkClient instances. The first will always return an error on the call to MVI, the second will always return an error on the call the Beanstalk. In your test code, you can bind to them to get expected behavior:
```
// To test MviClient error behavior use this:
var mviErrorSend = MessageDispatcher.prototype.send.bind(mviErrorObj);

// Now, calling this function will return an error in the MviClient callback:
mviErrorSend({jobId: 1}, function(error, result) {
  if(error) {
    // this will always run with the value 'mvi error' in the "error" parameter
  }
}

// To test BeanstalkClient error behavior use this:
var beanstalkErrorSend({jobId: 1}, function(error, result) {
  if(error) {
    // this will always run with the value 'beanstalk error' in the "error" parameter
  }
})
```
This will allow you to unit test the functionality of the `MessageDispatcher.prototype.send()` function without any external servers running--you can implement the specific behavior of each server. This allows to write comprehensive tests for all of the possible behaviors of the calls to the external servers.

To Do
-----

* Asynchronous Polling with Recursion



