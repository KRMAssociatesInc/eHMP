'use strict';

require('../../../env-setup');

var o = require(global.VX_UTILS + 'object-utils');

describe('object-utils.js', function() {
    describe('getProperty()', function() {
        var ary = ['a', 'b', {
                c: 3
            },
            ['x', 'y', 'z']
        ];

        var obj = {
            x: 1,
            y: 2,
            z: {
                a: 10,
                b: 20
            }
        };

        it('test null/undefined scenarios with object', function() {
            expect(o.getProperty()).toBeUndefined();
            expect(o.getProperty(obj)).toBe(obj);
            expect(o.getProperty(obj, null)).toBe(obj);
            expect(o.getProperty(obj, '')).toBe(obj);
            expect(o.getProperty(obj, [])).toBe(obj);
        });

        it('test array scenarios with object', function() {
            expect(o.getProperty(obj, ['x'])).toEqual(1);
            expect(o.getProperty(obj, ['z', 'a'])).toEqual(10);
            expect(o.getProperty(obj, ['z', 'a', 'm'])).toBeUndefined();
        });

        it('test parameters scenarios with object', function() {
            expect(o.getProperty(obj, 'x')).toEqual(1);
            expect(o.getProperty(obj, 'z', 'a')).toEqual(10);
            expect(o.getProperty(obj, 'z', 'a', 'm')).toBeUndefined();
        });

        it('test null/undefined scenarios with array', function() {
            expect(o.getProperty()).toBeUndefined();
            expect(o.getProperty(ary)).toBe(ary);
            expect(o.getProperty(ary, null)).toBe(ary);
            expect(o.getProperty(ary, '')).toBe(ary);
            expect(o.getProperty(ary, [])).toBe(ary);
        });

        it('test scenarios scenarios with array', function() {
            expect(o.getProperty(ary, [1])).toEqual('b');
            expect(o.getProperty(ary, [2, 'c'])).toEqual(3);
            expect(o.getProperty(ary, ['0'])).toEqual('a');
            expect(o.getProperty(ary, [3, 0])).toEqual('x');
            expect(o.getProperty(ary, [3, 0, 0], 'n/a')).toEqual('x');
            expect(o.getProperty(ary, [3, 0, 3])).toBeUndefined();
        });

        it('test parameters scenarios with array', function() {
            expect(o.getProperty(ary, 1)).toEqual('b');
            expect(o.getProperty(ary, 2, 'c')).toEqual(3);
            expect(o.getProperty(ary, '0')).toEqual('a');
            expect(o.getProperty(ary, 3, 0)).toEqual('x');
            expect(o.getProperty(ary, 3, 0, 0)).toEqual('x');
            expect(o.getProperty(ary, 3, 0, 3)).toBeUndefined();
        });

        it('test object notation scenarios with undefined/null', function() {
            expect(o().getProperty()).toBeUndefined();
            expect(o(obj).getProperty()).toBe(obj);
            expect(o(obj).getProperty(null)).toBe(obj);
            expect(o(obj).getProperty('')).toBe(obj);
            expect(o(obj).getProperty([])).toBe(obj);
        });

        it('test object notation scenarios with object', function() {
            expect(o(obj).getProperty(['x'])).toEqual(1);
            expect(o(obj).getProperty(['z', 'a'])).toEqual(10);
            expect(o(obj).getProperty(['z', 'a', 'm'])).toBeUndefined();
        });

        it('test object notation scenarios with array', function() {
            expect(o(obj).getProperty('x')).toEqual(1);
            expect(o(obj).getProperty('z', 'a')).toEqual(10);
            expect(o(obj).getProperty('z', 'a', 'm')).toBeUndefined();
        });
    });
});