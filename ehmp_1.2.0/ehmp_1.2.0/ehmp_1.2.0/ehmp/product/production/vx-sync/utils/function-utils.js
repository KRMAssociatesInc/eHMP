'use strict';

var _ = require('underscore');

/*
Variadic Function:
programmed(results, overrunValue, validator, errorValue)
programmed(results, overrunValue, validator)
programmed(results, overrunValue)
programmed(results)

Returns a function that will return each of the results
in the order that they are passed in the results parameter
(which should be an array).

results: An array of programmed values to be returned with
each of a series of successive calls to the programmed function.
If this parameter is not an array, it will be treated as a
single-item array with the values of 'results' as the item
in the array.

overrunValue: Once the number of calls to the function has
exceeded the length of the 'results' array, then this value
will be returned on every following call. If this parameter
is not included, then the value used will be 'undefined'.

validator: If this parameter is include and it is a function,
then it will be called with whatever parameters are passed to
the programmed function when the programmed function is called.
If this function returns 'false', then the call counter will
be incremented but the value in 'errorValue' will be returned
(or 'undefined') if no value is given for 'errorValue'. Note
that the validator is run before the overrun is tested.

errorValue: The value to be returned if the 'validator' returns
false.

If you need an asynchronous version of this function, you
should wrap the 'programmed' function with either call() or
apply() from async-utils.js

Examples:

var foo = programmed([1, 2, 3], -1);
foo(); // returns 1
foo(); // returns 2
foo(); // returns 3
foo(); // returns -1
foo(); // returns -1

------------------------------------------------------

var valid = function(val) {
	return val % 2 !== 0;
}

var bar = programmed([1, 2, 3], 'over', valid, 'invalid');
bar(1); // returns 1
bar(5); // returns 2
bar(2); // returns 'invalid'
bar(2); // returns 'invalid' - '2' fails validation before it can overrun
bar(7); // returns 'over'

------------------------------------------------------

var error = function(val) {
	if(val % 2 === 0) {
		throw new Error('even number');
	}
}

var quux = programmed([1, 2, 3], 'over', error, 'invalid');
quux(1); // returns 1
quux(5); // returns 2
quux(2); // throws Error, but increments counter
quux(7); // returns 'over'
*/
function programmed(results, overrunValue, validator, errorValue) {
	results = _.isArray(results) ? results : [results];
	var count = 0;
	return function() {
		if (_.isFunction(validator)) {
			try {
				var valid = validator.apply(null, arguments);
				if (!valid) {
					count++;
					return errorValue;
				}
			} catch (error) {
				count++;
				throw error;
			}
		}

		if (count + 1 > results.length) {
			return overrunValue;
		}

		return results[count++];
	};
}

module.exports.programmed = programmed;