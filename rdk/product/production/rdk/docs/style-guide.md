::: page-description
Style Guide
===========
:::

Adhere to all the guidelines described below.

## Tools
Enforcement of some code conventions and style is helped by:
 * [EditorConfig](http://editorconfig.org/) (.editorconfig)
 * [JSHint](http://jshint.com/) (.jshintrc)
 * [JS Beautifier](https://github.com/beautify-web/js-beautify) / [JsFormat](https://github.com/jdc0589/JsFormat)

These tools are not optional. Please run your code through these tools with the corresponding configuration files in the production directory before contributing.

## RDK-Specific Guidelines
 * Single-quoted strings
 * Indent with 4 spaces
 * Use one var statement per variable
 * JSDoc is encouraged when a function's use or purpose is not obvious by reading its signature.
    * Always keep JSDoc up-to-date. Delete or update any outdated JSDoc on sight.
    * See the [JSDoc Guidelines](#JSDoc-Guidelines) below for more detail.
 * References to the rdk module should be stateless utility functions, while references to the app or req objects should be stateful.
 * Directly `require` anything installed as an npm package.  
   For rdk-wide relative `require`s, only require rdk/rdk and make module variables from it.  
   For example:
   ```JavaScript
   var rdk = require('../../rdk/rdk');        // good, main rdk require
   var httpUtil = rdk.utils.http;             // good, no extra relative requires
   var httpUtil = require('../../util/http'); // bad, unnecessary relative require
   var _ = require('underscore');             // good
   var _s = require('underscore.string');     // good
   ```
 * Use the drilldown utility for accessing deep object properties.
   ```JavaScript
   var dd = rdk.utils.dd;
   var response1 = {data: {error: 'Something went wrong'}};
   var response2 = {data: {items: [{foo: 1},{foo: 2}]}};

   var items = response1.data.items;  // TypeError, crashes the resource server
   var items = dd(response1)('data')('items').val;
   // because response1.data.items does not exist, items is undefined

   var items = dd(response2)('data')('items').val;
   // because response2.data.items exists, items is [{foo: 1},{foo: 2}]
   ```
 * The following documents have additional development guidelines:
    * [Resources](resources.md)
    * [Subsystems](subsystems.md)
    * [Middleware](middleware.md)
    * [Logging](logging.md)

## Javascript Guidelines
 * The first line of every JS file should be `'use strict';`
 * Use `===` and `!==` instead of `==` or `!=`
 * Never assign the `undefined` value to a variable. Use `null` instead.
 * No `eval()`s
 * The only acceptable place for a try-catch block is around `JSON.parse()`.
    * All `JSON.parse()` calls should be surrounded by try-catch.
 * Return `Error`s instead of throwing `Error`s
 * The first argument of a callback must be an error, which is null or undefined if no error happened.
 * Use semicolons to end each statement
 * Always `return` immediately when a callback is called
 * **Opening curly braces never get their own line**
    * Exception: object literals inside arrays
 * Use the **async library for asynchronous tasks**
 * Use the appropriate lodash function instead of a plain for loop.
    * **Learn what lodash provides** or you will wind up reinventing the wheel.
 * Follow the JS variable naming convention:  
   **camelCase for regular variables and PascalCase for constructor names**.
    * The JS community does not observe variable naming conventions as strictly as other languages like Python, Ruby, or Java, so you might find camelCase, PascalCase, snake_case, and bunchedcase variables where they shouldn't be, but stick to the convention for RDK.

## General Programming Guidelines
 * Always use braces for `if`, `while`, and `for` blocks
 * Function names should be verbs/actions
 * Bail early; `return` at the top of a function if an error occurs instead of using long if-else blocks.
    * This reduces levels of indentation and makes identifying bugs easier.
 * Words in variable names must be fully spelled out unless an acronym or shorthand is very common
 * It doesn't matter how long variable names are.
    * A programmer should know what a variable does by looking at its name without needing to look at context.
 * Do not use temporary variable names.
    * You will forget to change them to a better name when you're done and you will forget what the variable is for in the future. Spend extra time to think of a variable name if you need to.
    * The one exception: iterator variables in short loops only. It's still preferable to use a real variable name, though.

### Optional Guidelines
These are ideal and recommended, but not always easily doable.
 * **Each function should do only one thing**. As you write code, sometimes functions increase in complexity, so if you notice a part of your function doing something you can describe in one phrase, extract that part to a new function of its own.
 * **Comments should explain why, not what, not how**. The code should explain what and how. Good variable names are always preferable to comments.
 * **Name variables from most significant word to least significant word.** This allows IDEs to provide better autocompletion and makes remembering functions easier.
 * Try to **break long lines into lines less than 80 characters wide.** This allows you to look at multiple files side-by-side. This is made easier by bailing early (see above)
 

## Good patterns and idioms to know about
 * Dispatch tables
 * Truthy and falsy JS values
 * Create variables with default values by using `||`. For example:
    ```JavaScript
    function printMessage(message) {
        // If message is not defined, its value will
        // be defaulted to the string after ||.
        message = message || 'default message';
        console.log(message);
    }
    printMessage('custom message');
    printMessage();
    ```
    The above code will print "custom message" then "default message".

## JS pitfalls and gotchas
 * **Functions are the only thing that create scope.** For example:
    ```JavaScript
    function tryForLoop() {
        for(var i = 0; i < 10; i++) {
            /* do stuff with i */
        }
        console.log(i);
    }
    ```
    The above code will print `11`, which is the value of `i` when the for loop exits.
 * **"Hoisting"**
    * **Variable declarations** (`var x;`) are processed before any code is executed.  
      **Variable assignments** (`x = 1;`) are processed as the line is executed.  
      When a variable is declared and defined at the same time (`var x = 1;`), its declaration is hoisted and its assignment is not.
    * **Function definitions** are hoisted (`function foo() {}`).  
      **Function assignments** are variable assignments, so they follow the same rules as variable assignments.
 * **The `this` keyword** is different compared to other languages. `this` refers to the scope outside of the current scope.
   Avoid using `this` unless necessary.

## JSDoc Guidelines
JSDoc is similar to Javadoc and Doxygen. JSDoc is used to document functions in source code.
 * JSDoc should be used to complement existing function signatures.
    * Avoid redundancy.
    * Provide complete parameter information if any is provided.
 * Read the JSDoc documentation on [how to annotate types](http://usejsdoc.org/tags-type.html).


For example:
```JavaScript
// Good: The JSDoc provides information that the function signature and
//       variable names don't have
/**
 * Reverse engineered RelativeDateTimeFormat.parse()
 *
 * @see RelativeDateTimeFormat.java:31
 * @param {string} teeMinus "T-{number}{h|d|m|y}" (hour, day, month, year)
 * @returns {string} "YYYYMMDD"
 */
function emulatedHmpGetRelativeDate(teeMinus) {
  // ...
}

// Good: The JSDoc does not repeat obvious information contained in the
//       function signature
/**
 * Applies business logic to incoming filters
 * Adds filter or error to req.interceptorResults.jdsFilter
 * Modifies req.query.filter
 */
function jdsFilterInterceptor(req, res, next) {
  // ...
}

// Good: The JSDoc specifies the type of all function parameters
/**
 * @param {Object} filter
 * @returns {Array}
 */
function processFilters(filter) {
  // ...
}

// Bad: The JSDoc repeats what is obvious from the function signature multiple
//      times and does not properly specify return types
/**
 * Returns a VPR formated date/time string given a FileMan date/time string
 *
 * @param fmDate FileMan date/time string
 * @return The VPR formatted date/time corresponding to fmDate
 */
function getVprDateTime(fmDate) {
  // ...
}
```

<br />
---
Next: [Resources](resources.md)
