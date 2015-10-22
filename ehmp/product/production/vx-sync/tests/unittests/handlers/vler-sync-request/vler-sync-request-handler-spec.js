'use strict';

var handler = require(global.VX_HANDLERS + 'vler-to-vpr-xform/vler-to-vpr-xform-handler');
var log = require(global.VX_UTILS + 'dummy-logger');

describe('vler-to-vpr-xform-handler.js', function() {

    it('Test compress required getFullHtml()', function() {
        var done = false;
        var error;
        var test = {
            callback: function(err, result) {
                expect(result).toBe('XQAAAQADAAAAAAAAAAAzG8pMNEjf//XEQAA=');
                done = true;
                error = err;
            }
        };

        handler._getFullHtml(log, true, 'foo', test.callback);
        waitsFor(function() {
            return done;
        }, '"done" should be true', 1000);
        runs(function() {
            expect(error).toBeNull();
        })
    });

    it('Test compress not required getFullHtml()', function() {
        var done = false;
        var error;
        var test = {
            callback: function(err, result) {
                expect(result).toBe('foo');
                done = true;
                error = err;
            }
        };

        handler._getFullHtml(log, false, 'foo', test.callback);
        waitsFor(function() {
            return done;
        }, '"done" should be true', 1000);
        runs(function() {
            expect(error).toBeNull();
        })
    });

});
