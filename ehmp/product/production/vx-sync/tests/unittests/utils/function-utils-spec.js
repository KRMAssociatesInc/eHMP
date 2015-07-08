'use strict';

require('../../../env-setup');

var programmed = require(global.VX_UTILS + 'function-utils').programmed;

/*
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

var quux = programmed([1, 2, 3], 'over', error);
quux(1); // returns 1
quux(5); // returns 2
quux(2); // throws Error, but increments counter
quux(7); // returns 'over'
*/
describe('function-utils.js', function() {
	describe('programmed()', function() {
		it('verify results and overrunValue', function() {
			var foo = programmed([1, 2, 3], -1);
			expect(foo()).toEqual(1);
			expect(foo()).toEqual(2);
			expect(foo()).toEqual(3);
			expect(foo()).toEqual(-1);
			expect(foo()).toEqual(-1);

			foo = programmed(10, null);
			expect(foo()).toEqual(10);
			expect(foo()).toEqual(null);
		});

		it('verify validator and overrunValue', function() {
			function valid(val) {
				return val % 2 !== 0;
			}

			var bar = programmed([1, 2, 3], 'over', valid, 'invalid');
			expect(bar(1)).toEqual(1);
			expect(bar(5)).toEqual(2);
			expect(bar(2)).toEqual('invalid');
			expect(bar(2)).toEqual('invalid');
			expect(bar(7)).toEqual('over');
		});

		it('verify validator with Error', function() {
			function error(val) {
				if (val % 2 === 0) {
					throw new Error('even number');
				}

				return true;
			}

			var quux = programmed([1, 2, 3], 'over', error, 'invalid');
			expect(quux(1)).toEqual(1);
			expect(quux(5)).toEqual(2);
			expect(quux.bind(null, 2)).toThrow();
			expect(quux(7)).toEqual('over');
		});
	});
});