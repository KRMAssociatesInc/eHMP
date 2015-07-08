'use strict';

require('../../../env-setup');

var inspect = require(global.VX_UTILS + 'inspect');
var util = require('util');

describe('inspect.js', function() {
    describe('inspect', function() {
        it('verify results mirror util.inspect()', function() {
            var obj = {
                prop1: 'value1',
                prop2: 'value2',
                prop3: ['lval1', 'lval2', 'lval3'],
                prop4: {
                    subprop1: 'subval1',
                    subprop2: 'subval2'
                }
            };

            expect(inspect(obj)).toEqual(util.inspect(obj, {
                depth: null
            }));
        });
    });
});