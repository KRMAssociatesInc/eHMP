'use strict';

var nullchecker = require('./nullchecker');

describe('NullChecker', function() {
    it('tests that a valid value does not return false', function() {
        var value = 'x';
        expect(nullchecker.isNullish(value)).to.be.false();
        expect(nullchecker.isNotNullish(value)).to.be.true();
    });

    it('tests that a null returns false', function() {
        var value = null;
        expect(nullchecker.isNullish(value)).to.be.true();
        expect(nullchecker.isNotNullish(value)).to.be.false();
    });

    it('tests that an unset variable returns false', function() {
        var value;
        expect(nullchecker.isNullish(value)).to.be.true();
        expect(nullchecker.isNotNullish(value)).to.be.false();
    });

    var o = {};
    it('tests that an undefined field returns false', function() {
        expect(nullchecker.isNullish(o.fieldThatDoesNotExist)).to.be.true();
        expect(nullchecker.isNotNullish(o.fieldThatDoesNotExist)).to.be.false();
    });

    describe('with properties parameters', function() {
        var obj = {
            x: {
                y: 'test'
            }
        };

        it('tests that non-null object properties returns true', function() {
            expect(nullchecker.isNullish(obj, 'x', 'y')).to.be.false();
            expect(nullchecker.isNotNullish(obj, 'x', 'y')).to.be.true();
        });

        it('tests that invalid property returns false', function() {
            expect(nullchecker.isNullish(obj, 'a', 'y')).to.be.true();
            expect(nullchecker.isNotNullish(obj, 'a', 'y')).to.be.false();
        });

        it('tests that invalid subproperties returns false', function() {
            expect(nullchecker.isNullish(obj, 'x', 'z')).to.be.true();
            expect(nullchecker.isNotNullish(obj, 'x', 'z')).to.be.false();
        });
    });

    describe('array with properties parameters', function() {
        var ary = ['test1', 'test2', 'test3'];

        it('array access with valid string index returns false', function() {
            expect(nullchecker.isNullish(ary, '1')).to.be.false();
            expect(nullchecker.isNotNullish(ary, '1')).to.be.true();
        });

        it('array access with valid numeric index returns false', function() {
            expect(nullchecker.isNullish(ary, 1)).to.be.false();
            expect(nullchecker.isNotNullish(ary, 1)).to.be.true();
        });

        it('array access with invalid string index returns true', function() {
            expect(nullchecker.isNullish(ary, '6')).to.be.true();
            expect(nullchecker.isNotNullish(ary, '6')).to.be.false();
        });

        it('array access with invalid numeric index returns true', function() {
            expect(nullchecker.isNullish(ary, 6)).to.be.true();
            expect(nullchecker.isNotNullish(ary, 6)).to.be.false();
        });

        it('array access with invalid property returns true', function() {
            expect(nullchecker.isNullish(ary, 'a')).to.be.true();
            expect(nullchecker.isNotNullish(ary, 'a')).to.be.false();
        });
    });
});
