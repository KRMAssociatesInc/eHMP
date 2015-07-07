'use strict';

require('../../../env-setup');

var isNullish = require(global.VX_UTILS + 'null-utils').isNullish;


describe('null-utils', function() {
    describe('isNullish()', function() {
        var ary = ['test1', 'test2', 'test3'];
        var ary2 = ['test1', 'test2', {
            test3: 'test'
        }];

        var obj = {
            x: {
                y: 'test'
            }
        };

        var obj2 = {
            x: {
                y: 'test'
            },
            a: ary
        };

        var obj3 = {
            x: undefined,
            a: ary
        };

        var obj4 = {
            x: null,
            a: ary
        };

        it('verify null and undefined object', function() {
            expect(isNullish()).toBe(true);
            expect(isNullish(null)).toBe(true);
        });

        it('verify {}, primitive object, and empty or null array', function() {
            expect(isNullish({})).toBe(false);
            expect(isNullish(0)).toBe(false);
            expect(isNullish('test')).toBe(false);
            expect(isNullish(obj)).toBe(false);
            expect(isNullish(obj, null)).toBe(true);
        });

        it('verify properties', function() {
            expect(isNullish(obj, 'x', 'y')).toBe(false);
            expect(isNullish(obj, 'x', 'a')).toBe(true);
            expect(isNullish(obj, 'a', 'y')).toBe(true);
            expect(isNullish(obj3, 'x')).toBe(true);
            expect(isNullish(obj4, 'x')).toBe(true);
        });

        it('verify array object', function() {
            expect(isNullish(ary, '1')).toBe(false);
            expect(isNullish(ary, 1)).toBe(false);
            expect(isNullish(ary, '6')).toBe(true);
            expect(isNullish(ary, 6)).toBe(true);
            expect(isNullish(ary, 'a')).toBe(true);
        });

        it('verify object in array', function() {
            expect(isNullish(ary2, 1)).toBe(false);
            expect(isNullish(ary2, 2)).toBe(false);
            expect(isNullish(ary2, 2, 'test3')).toBe(false);
            expect(isNullish(ary2, 2, 'test2')).toBe(true);
        });

        it('verify array in object', function() {
            expect(isNullish(obj2, 'x')).toBe(false);
            expect(isNullish(obj2, 'a')).toBe(false);
            expect(isNullish(obj2, 'a', 2)).toBe(false);
            expect(isNullish(obj2, 'a', 5)).toBe(true);
        });

        it('verify array in object', function() {
            expect(isNullish(obj2, 'x')).toBe(false);
            expect(isNullish(obj2, 'a')).toBe(false);
            expect(isNullish(obj2, 'a', 2)).toBe(false);
            expect(isNullish(obj2, 'a', 5)).toBe(true);
        });
    });
});



// var obj = {
//     x: {
//         y: 'test'
//     }
// };

// isNullish(obj, 'x', 'y'); // => true
// isNullish(obj, 'x', 'z'); // => false
// isNullish(obj, 'a', 'y'); // => false

// passed as properties will be treated as subscripts:

// var ary = ['test1', 'test2', 'test3'];

// console.log(isNullish(ary, '1')); // => false
// console.log(isNullish(ary, 1)); // => false
// console.log(isNullish(ary, '6')); // => true
// console.log(isNullish(ary, 6)); // => true
// console.log(isNullish(ary, 'a')); // => true