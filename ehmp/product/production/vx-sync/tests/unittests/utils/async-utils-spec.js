'use strict';


require('../../../env-setup');

var _ = require('underscore');
var asyncUtil = require(global.VX_UTILS + 'async-utils');

function Pair(one, two) {
    this.one = one;
    this.two = two;
}

Pair.prototype.getOne = function() {
    return this.one;
};

Pair.prototype.getTwo = function() {
    return this.two;
};

var getString = function() {
    var str = '(' +
        /* jshint ignore:start */
        this.one +
        ', ' +
        this.two +
        /* jshint ignore:end */
        ')';
    return str;
};

describe('async-utils.js', function() {
    var called;
    var calledError;
    var calledResult;

    function callback(error, result) {
        called = true;
        calledError = error;
        calledResult = result;
    }

    function argTest() {
        if (arguments[0] === 'error') {
            throw new Error(arguments[0]);
        }

        return _.toArray(arguments);
    }

    beforeEach(function() {
        called = false;
        calledError = undefined;
        calledResult = undefined;
    });

    describe('call()', function() {
        it('verify no arguments', function() {
            asyncUtil.call(null, argTest, callback);

            waitsFor(function() {
                return called;
            }, 'should be called', 100);

            runs(function() {
                expect(calledError).toBeNull();
                expect(calledResult).toEqual([]);
            });
        });

        it('verify one argument', function() {
            asyncUtil.call(null, argTest, 'arg1', callback);

            waitsFor(function() {
                return called;
            }, 'should be called', 100);

            runs(function() {
                expect(calledError).toBeNull();
                expect(calledResult).toEqual(['arg1']);
            });
        });

        it('verify multiple arguments', function() {
            asyncUtil.call(null, argTest, 'arg1', 'arg2', 'arg3', callback);

            waitsFor(function() {
                return called;
            }, 'should be called', 100);

            runs(function() {
                expect(calledError).toBeNull();
                expect(calledResult).toEqual(['arg1', 'arg2', 'arg3']);
            });
        });

        it('verify error handling', function() {
            asyncUtil.call(null, argTest, 'error', callback);

            waitsFor(function() {
                return called;
            }, 'should be called', 100);

            runs(function() {
                expect(calledError).toEqual(new Error('error'));
                expect(calledResult).toBeUndefined();
            });
        });

        it('verify no thisArg', function() {
            var pair = new Pair(1, 2);
            expect(pair.getOne()).toEqual(1);
            expect(pair.getTwo()).toEqual(2);
            expect(getString.call(pair)).toEqual('(1, 2)');

            asyncUtil.call(pair, getString, callback);

            waitsFor(function() {
                return called;
            }, 'should be called', 100);

            runs(function() {
                expect(calledError).toBeNull();
                expect(calledResult).toEqual('(1, 2)');
            });
        });
    });

    describe('apply()', function() {
        it('verify no arguments', function() {
            asyncUtil.apply(null, argTest, callback);

            waitsFor(function() {
                return called;
            }, 'should be called', 100);

            runs(function() {
                expect(calledError).toBeNull();
                expect(calledResult).toEqual([]);
            });
        });

        it('verify empty arguments', function() {
            asyncUtil.apply(null, argTest, [], callback);

            waitsFor(function() {
                return called;
            }, 'should be called', 100);

            runs(function() {
                expect(calledError).toBeNull();
                expect(calledResult).toEqual([]);
            });
        });

        it('verify non-array argument', function() {
            asyncUtil.apply(null, argTest, 'arg1', callback);

            waitsFor(function() {
                return called;
            }, 'should be called', 100);

            runs(function() {
                expect(calledError).toBeNull();
                expect(calledResult).toEqual(['arg1']);
            });
        });

        it('verify one argument', function() {
            asyncUtil.apply(null, argTest, ['arg1'], callback);

            waitsFor(function() {
                return called;
            }, 'should be called', 100);

            runs(function() {
                expect(calledError).toBeNull();
                expect(calledResult).toEqual(['arg1']);
            });
        });

        it('verify multiple arguments', function() {
            asyncUtil.apply(null, argTest, ['arg1', 'arg2', 'arg3'], callback);

            waitsFor(function() {
                return called;
            }, 'should be called', 100);

            runs(function() {
                expect(calledError).toBeNull();
                expect(calledResult).toEqual(['arg1', 'arg2', 'arg3']);
            });
        });

        it('verify error handling', function() {
            asyncUtil.apply(argTest, 'error', callback);

            waitsFor(function() {
                return called;
            }, 'should be called', 100);

            runs(function() {
                expect(calledError).toEqual(new Error('error'));
                expect(calledResult).toBeUndefined();
            });

            asyncUtil.apply(argTest, ['error'], callback);

            waitsFor(function() {
                return called;
            }, 'should be called', 100);

            runs(function() {
                expect(calledError).toEqual(new Error('error'));
                expect(calledResult).toBeUndefined();
            });
        });
    });
});