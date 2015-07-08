'use strict';

//------------------------------------------------------------------------------------
// This file contains unit tests for map-utils.js.
//
// Author: Les Westberg
//------------------------------------------------------------------------------------

require('../../../env-setup');

var mapUtil = require(global.VX_UTILS + 'map-utils');


describe('map-utils', function() {
    describe('filteredMap()', function() {
        it('HappyPath', function() {
            var testArray = [{
                test: 1
            }, {
                test: 2
            }, undefined, null, {
                test: 3
            }];
            var theResult = mapUtil.filteredMap(testArray, function(item) {
                if (item) {
                    return {
                        test: item.test * 10
                    };
                }

                return item;
            }, [null, undefined]);
            expect(theResult).toBeTruthy();
            expect(theResult.length).toEqual(3);
            expect(theResult).toContain(jasmine.objectContaining({
                test: 10
            }));
        });
        it('removing undefined items - test 1', function() {
            var testArray = [{
                test: 1
            }, {
                test: 2
            }, undefined, null, {
                test: 3
            }];
            var theResult = mapUtil.filteredMap(testArray, function(item) {
                if (item) {
                    return {
                        test: item.test * 10
                    };
                }

                return item;
            });
            expect(theResult).toBeTruthy();
            expect(theResult.length).toEqual(4);
            expect(theResult).toContain(jasmine.objectContaining({
                test: 10
            }));
            expect(theResult).toContain(null);
        });
        it('removing undefined items - test 2', function() {
            var testArray = [{
                test: 1
            }, {
                test: 2
            }, undefined, null, {
                test: 3
            }];
            var theResult = mapUtil.filteredMap(testArray, function(item) {
                if (item) {
                    return {
                        test: item.test * 10
                    };
                }

                return item;
            }, undefined);
            expect(theResult).toBeTruthy();
            expect(theResult.length).toEqual(4);
            expect(theResult).toContain(jasmine.objectContaining({
                test: 10
            }));
            expect(theResult).toContain(null);
        });
        it('removing null items', function() {
            var testArray = [{
                test: 1
            }, {
                test: 2
            }, undefined, null, {
                test: 3
            }];
            var theResult = mapUtil.filteredMap(testArray, function(item) {
                if (item) {
                    return {
                        test: item.test * 10
                    };
                }

                return item;
            }, null);
            expect(theResult).toBeTruthy();
            expect(theResult.length).toEqual(4);
            expect(theResult).toContain(jasmine.objectContaining({
                test: 10
            }));
            expect(theResult).toContain(undefined);
        });
    });

    describe('counts()', function() {
        it('verify null, undefined, non-array, empty array and empty object returns empty object', function() {
            var iterator = function(value) {
                return value;
            };

            expect(mapUtil.counts(undefined, iterator)).toEqual({});
            expect(mapUtil.counts(null, iterator)).toEqual({});
            expect(mapUtil.counts(9, iterator)).toEqual({});
            expect(mapUtil.counts([], iterator)).toEqual({});
            expect(mapUtil.counts({}, iterator)).toEqual({});
        });
        it('verify array works correctly', function() {
            var iterator = function(value) {
                return String(value);
            };

            expect(mapUtil.counts([1, 2, '3', 4], iterator)).toEqual({
                '1': 1,
                '2': 1,
                '3': 1,
                '4': 1
            });
            expect(mapUtil.counts([1, 2, '3', 4, 3, 1, 1, 0], iterator)).toEqual({
                '0': 1,
                '1': 3,
                '2': 1,
                '3': 2,
                '4': 1
            });

            var toUpper = function(value) {
                return String(value).toUpperCase();
            };
            expect(mapUtil.counts(['test', 'test', 'Test', 'TEST'], toUpper)).toEqual({
                TEST: 4
            });

            expect(mapUtil.counts(['test', 'test', 'Test', 'TEST'])).toEqual({
                test: 2,
                Test: 1,
                TEST: 1
            });
        });

        it('verify object works correctly', function() {
            expect(mapUtil.counts({
                a: 'x',
                b: 'x',
                c: 'z'
            })).toEqual({
                x: 2,
                z: 1
            });

            var result = {};
            result[{}.toString()] = 2;
            result.z = 1;
            expect(mapUtil.counts({
                a: {},
                b: {},
                c: 'z'
            })).toEqual(result);
        });
    });
});