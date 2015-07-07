Some Pitfalls in Node.js Javascript
===================================

##### Steven Reich (steven.reich@agilex.com)

Developers familiar with Java are likely to be surprised by some of the behaviors of Javascript. Below are some of the behaviors that you need to know if you want to avoid hours of frustrating debug sessions.

Blocks
------

Node.js only has three scopes:
* Global
* Module (i.e. source file)
* Function

In general, you will never use the global scope. In fact, if you have `'use strict'` at the top of all of your files, you will mostly be prevented from using this scope.

Each source file in Node.js is a *module* which can be imported into other files with the `require` command. It is essentially a singleton, so that any variables you declare in the file will only be declared once. Additionally, anything declared within a source file is invisible to other files unless it is explicitly exported or a property of an object that is explicitly exported. For more information about that, see the Node.js documentation on [modules](http://nodejs.org/api/modules.html).

Finally, the **only** other scope is function scope. Each function has its own scope (in fact, each function is a *closure*).

This is simple enough, but what trips up developers new to Javascript tends to be what does not have scope:


* Block from branch statements (`if`, etc.)
* Block from loop statements (`for`, `while`)

In short, curly braces *never* create a new scope *except* when they are the opening and closing braces of a function definition.

Let's look at some examples:

```
// This code is all in a file named scope.js
'use strict';

// Note that since this was not declared with "var",
// Node assumes it is global, creating it if necessary.
// It will be globally visible throughout your
// application. Don't do this. Putting 'use strict'
// at the top of your source file will prevent you
// from doing this inadvertently.
globalVar = 'global-value';

var fileLocal = 'some-value';
var exported = 'exported-value';

function foo() {
	var funcLocal = 'func-value';

	console.log(funcLocal);
}

// This outputs undefined
console.log(funcLocal);

for(var i = 0; i < 10; i++) {
	var x = i;
	// do something...
}

// This outputs 10
console.log(i);

// NOTE! This outputs 9
console.log(x);

// note that this would not be considered good practice
if(x) {
	var y = true;
}

if(y) {
	// this outputs y exists
	console.log('y exists');
}

// finally...
// Note that this block is called
// 		"Immediately Invoked Function Expression" (IIFE)
(function() {
	var z = 10;
	console.log(z);
})();

// This outputs undefined
console.log(z);

module.exports.exported = exported;
module.exports.foo = foo;
```

Now in another file:

```
// This code is all in a file named test.js in the same
// directory as scope.js
'use strict';

var scopeExported = require('./scope.js');

// This outputs undefined
console.log(fileLocal);

// This outputs 'exported-value'
console.log(scopeExported.exported);

// foo() outputs 'func-value'
scopeExported.foo();

```

The Transient Nature of `this`
------------------------------

One of the subtle gotchas in Javascript is something that I call the "transient nature of `this`". Unlike some other languages with "this" or "self" artifacts, Javascript's version is not tightly bound to a particular instance. First, let's define a fairly straightforward class called `StatusTracker`:

```
// StatusTracker.js
'use strict';

var util = require('util');
var _ = require('underscore');

function StatusTracker() {
    this.status = 'created';
    this.statusHistory = [];
}

StatusTracker.prototype.setStatus = function(status) {
    this.statusHistory.push(this.status);
    this.status = status;
};

StatusTracker.prototype.getStatus = function() {
    return this.status;
};

StatusTracker.prototype.currentStatus = function() {
    return util.format('status: %s', this.status);
};

StatusTracker.prototype.statusHistory = function() {
    var history = _.reduce(this.statusHistory, function(memo, status) {
        return memo + '\n' + status;
    }, '');

    return history;
};

module.exports = StatusTracker;
```

It should be pretty obvious what the StatusTracker class does. Now, let's try to use this class:

```
// Add this to a standalone test file in the same directory as StatusTracker.js

var StatusTracker = require('./StatusTracker');

var statusTracker = new StatusTracker();
statusTracker.setCurrentStatus('initialized');
statusTracker.setCurrentStatus('started');

console.log(statusTracker.currentStatus());
console.log();
console.log(statusTracker.statusHistory());
```

So far, everything works as expected.

Now, let's say that you have written a utility class to encapsulate the logging. In good, functional fashion, you decide to write a higher-order function to which you will pass another function which is responsible for generating the log string. This will allow you to use this function in multiple locations. Add this to the bottom of your test file:


```
function statusLogger(currentStatusFunc) {
    console.log();
    console.log(currentStatusFunc());
}
```

So far, so good. However, the problem comes when you attempt to use this function with an instance of StatusTracker. Add the following text to your test file and then run it:

```
statusLogger(statusTracker.currentStatus);
```

What happened? Instead of seeing the current status 'started' printed on the screen, you got an error message similar to: `TypeError: Cannot read property 'status' of undefined`.

The problem is that the function you passed to `statusLogger()` references `this` in its definition. However, when you passed the reference to `currentStatus()`, it was essentially "disassociated" with its instance. Instead, Javascript attempts to associate the `this` in `currentStatus()` with the value of `this` in `statusLogger()`. However, since `statusLogger()` is a standalone function, `this` is `undefined`. (It could be even worse if `statusLogger()` was a method belonging to another class. In that case, `this` would actually refer to the particular instance on which `statusLogger()` was being called--with unpredictable results).

However, Javascript gives us a solution. The Function object has a method called [bind()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind), which allows us to explicitly set the particular `this` that the function will use. Just pass the instance we want to use as `this` as the first parameter:

```
// Instead, use this
statusLogger(statusTracker.statusString.bind(statusTracker));
```

Note that you could also use a minor variation in this syntax by referring to the `statusString()` function without an instance:

```
statusLogger(StatusTracker.prototype.currentStatus.bind(statusTracker));
```

A common variation on this problem can occur when using one of the [Underscore](http://underscorejs.org/) collections functions to operate on an instance variable. For example, let's assume you've written a class to execute commands:

```
// Executor.js
'use strict';

var _ = require('underscore');

function Executor(commandString) {
    this.commandString = commandString;
}

Executor.prototype.executeList = function(paramList) {
	_.each(paramList, function(param) {
		this.execute(param);
	});
};

Executor.prototype.execute = function(param) {
	// log call as dummy substitute for command execution
	console.log(this.commandString + ' ' + param);
};

module.exports = Executor;
```

Now, enter this into your test file and run it:

```
var Executor = require('./Executor');
var exec = new Executor('command');
exec.execute('ls');
exec.executeList(['ls', 'rm']);
```

The call to `execute()` works as expected, but look at what happened when it got to `executeList()`. However, it is very simple to fix the problem (thanks to Javascript's closures). Merely assign the value of `this` to a variable outside of the anonymous function and then refer to that variable instead of the direct reference to `this`. In this case, that means refactoring the `executeList()` function to the following:

```
Executor.prototype.executeList = function(paramList) {
	var self = this;
	_.each(paramList, function(param) {
		self.execute(param);
	});
};
```

Now everything works exactly as you'd expect.


Semicolons and Linefeeds
------------------------

Javascript allows developers to omit the semicolon in many situations. However, nearly every experienced Javascript developer will tell you that this is a universally bad idea. The problem is that Javascript uses a particular set of rules to automatically insert semicolons where it thinks that they are missing. I am not going to go into the specific rules (although it is worth looking them up yourself). Instead, I just want to be sure that you understand a few of the more common problems that can arise. First, let me give you two rules that you should always follow:

* Never depend upon Javascript to insert a semicolon for you.
* Always put an opening curly-brace on the same line as the code to which it is associated.

Consider this function:

```
function foo() {
	return
	{
		user: 'jsmith'
	};
}
```

If you are new to Javascript, you might expect that `foo()` would return an object with a property named `user`. However, it will actually return `undefined`. This is because in this instance Javascript will insert a semicolon immediately after the `return`. In effect, you have written this function:

```
function foo() {
	return;
	{
		user: 'jsmith'
	};
}
```

Instead, you should format your function thus so that behaves as you would expect;

```
function foo() {
	return {
		user: 'jsmith'
	};
}
```

Here are a few more examples of automatic semicolon insertion:

```
// This returns undefined
function foo() {
    return
        'foo' + 'bar';
}

// This returns 'foobar'
function foo() {
    return 'foo' +
   		'bar';
}

// This is preferred
function foo() {
    return 'foo' + 'bar';
}

```


To Do
-----

* Function Hoisting
* Types and Type Coercion
* Immutability and Testing
* The Single-Threaded Event Loop

