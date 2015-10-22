'use strict';

var paramUtil = require('./param-converter');
var _ = require('underscore');

describe('paramUtil', function() {
    describe('isInt', function() {
        it('return true if number is integer (true)', function() {
            expect(paramUtil.isInt(2.0)).to.be.true();
        });

        it('return true if number is integer (false)', function() {
            expect(paramUtil.isInt(2.01)).to.be.false();
        });
    });

    describe('isFloat', function() {
        it('return true if number is float (true)', function() {
            expect(paramUtil.isFloat(2.01)).to.be.true();
        });

        it('return true if number is float (false)', function() {
            expect(paramUtil.isFloat(2.0)).to.be.false();
        });
    });

    describe('returnObject', function() {
        it('returns an appropriate return object given an array', function() {
            var arrayItems = ['a', 'b', 3];
            var expectedResult = {
                data: {
                    items: [
                        'a',
                        'b',
                        3
                    ],
                    success: true
                }
            };
            var ro = new paramUtil.returnObject(arrayItems);
            expect(JSON.stringify(ro)).to.eql(JSON.stringify(expectedResult));
        });
    });

    describe('convertArrayToRPCParameters', function() {
        it('return empty string because argument is undefined', function() {
            var parameter;
            var actualOutput = paramUtil.convertArrayToRPCParameters(parameter);
            expect(actualOutput).to.equal('');
        });

        it('return empty string because argument is not an array', function() {
            var parameter = 23;
            var actualOutput = paramUtil.convertArrayToRPCParameters(parameter);
            expect(actualOutput).to.equal('');
        });

        it('return empty string because array argument is empty', function() {
            var parameter = [];
            var actualOutput = paramUtil.convertArrayToRPCParameters(parameter);
            expect(actualOutput).to.equal('');
        });

        it('return RPC array without ^ because array argument has only one item', function() {
            var parameter = ['WT'];
            var actualOutput = paramUtil.convertArrayToRPCParameters(parameter);
            expect(actualOutput).to.equal('WT');
        });

        it('return RPC array given array argument with 3 elements', function() {
            var parameter = ['WT', 'HT', 'PO'];
            var actualOutput = paramUtil.convertArrayToRPCParameters(parameter);
            expect(actualOutput).to.equal('WT^HT^PO');
        });
    });

    describe('parseIntParam', function() {
        // test parsing
        it('returns parsed value when int is a positive number', function() {
            expect(paramUtil.parseIntParam({
                param: function() {
                    return '1';
                }
            }, 'myField')).to.equal(1);
            expect(paramUtil.parseIntParam({
                param: function() {
                    return '1';
                }
            }, 'myField', 0, 0)).to.equal(1);
        });
        it('returns parsed value when int is 0', function() {
            expect(paramUtil.parseIntParam({
                param: function() {
                    return '0';
                }
            }, 'myField')).to.equal(0);
            expect(paramUtil.parseIntParam({
                param: function() {
                    return '0';
                }
            }, 'myField', -1, -1)).to.equal(0);
        });
        it('returns parsed value when int is a negative number', function() {
            expect(paramUtil.parseIntParam({
                param: function() {
                    return '-1';
                }
            }, 'myField')).to.equal(-1);
            expect(paramUtil.parseIntParam({
                param: function() {
                    return '-1';
                }
            }, 'myField', 0, 0)).to.equal(-1);
        });

        // test default value handling
        it('returns default val when param is undefined', function() {
            expect(paramUtil.parseIntParam({
                param: function() {
                    return undefined;
                }
            }, 'myField', 7)).to.equal(7);
            expect(paramUtil.parseIntParam({
                param: function() {
                    return undefined;
                }
            }, 'myField', 7, 0)).to.equal(7);
        });
        it('returns default val when param is null', function() {
            expect(paramUtil.parseIntParam({
                param: function() {
                    return null;
                }
            }, 'myField', 7)).to.equal(7);
            expect(paramUtil.parseIntParam({
                param: function() {
                    return null;
                }
            }, 'myField', 7, 0)).to.equal(7);
        });
        it('returns NaN when param is undefined and no default val was specified', function() {
            expect(paramUtil.parseIntParam({
                param: function() {
                    return undefined;
                }
            }, 'myField')).to.be.undefined();
        });
        it('works correctly when the default val is explicitly undefined', function() {
            expect(paramUtil.parseIntParam({
                param: function() {
                    return undefined;
                }
            }, 'myField', undefined)).to.be.undefined();
        });

        // test error value handling
        it('returns error val when param is non-numeric', function() {
            expect(paramUtil.parseIntParam({
                param: function() {
                    return 'non-numeric value';
                }
            }, 'myField', 0, 7)).to.equal(7);
        });
        it('returns NaN when param is non-numeric and no error val was specified', function() {
            var actualOutput = paramUtil.parseIntParam({
                param: function() {
                    return 'non-numeric value';
                }
            }, 'myField');
            expect(_.isNaN(actualOutput)).to.be.true();
        });
        it('works correctly when the error val is explicitly undefined', function() {
            expect(paramUtil.parseIntParam({
                param: function() {
                    return 'non-numeric value';
                }
            }, 'myField', 0, undefined)).to.be.undefined();
        });
    });
});
