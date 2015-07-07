/*jslint node: true */
'use strict';

var nullchecker = require('../utils/nullchecker/nullchecker');

describe('NullChecker', function() {
    it('tests that a valid value does not return false', function() {
        var value = 'x';
        expect(nullchecker.isNullish(value)).toBe(false);
    });

    it('tests that a null returns false', function() {
        var value = null;
        expect(nullchecker.isNullish(value)).toBe(true);
    });

    it('tests that an unset variable returns false', function() {
        var value;
        expect(nullchecker.isNullish(value)).toBe(true);
    });

    var o = {};
    it('tests that an undefined field returns false', function() {
        expect(nullchecker.isNullish(o.fieldThatDoesNotExist)).toBe(true);
    });
});
