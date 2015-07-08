'use strict';

//-----------------------------------------------------------------
// This will test the namecase-utils.js functions.
//-----------------------------------------------------------------

require('../../../env-setup');

var ncUtil = require(global.VX_UTILS + 'namecase-utils');

describe('namecase-utils.js', function() {
    describe('namecase() with no digits in the tokens', function() {
        it('verify null', function() {
            var text = ncUtil.namecase(null);
            expect(text).toBeNull();
        });
        it('verify undefined', function() {
            var text = ncUtil.namecase(undefined);
            expect(text).toBeNull();
        });
        it('verify empty string', function() {
            var text = ncUtil.namecase('');
            expect(text).toEqual('');
        });
        it('verify single token', function() {
            var text = ncUtil.namecase('one');
            expect(text).toEqual('One');
        });
        it('verify single token - starts with space', function() {
            var text = ncUtil.namecase(' one');
            // Note: nc will collapse first set of preceeding spaces to none.
            //----------------------------------------------------------------
            expect(text).toEqual('One');
        });
        it('verify two tokens with no spaces', function() {
            var text = ncUtil.namecase('one,two');
            expect(text).toEqual('One,Two');
        });
        it('verify two tokens with one space', function() {
            var text = ncUtil.namecase('one, two');
            expect(text).toEqual('One, Two');
        });
        it('verify 5 tokens with no spaces', function() {
            var text = ncUtil.namecase('one,two,three,four,five');
            expect(text).toEqual('One,Two,Three,Four,Five');
        });
        it('verify 5 tokens with spaces', function() {
            var text = ncUtil.namecase('one, two,  three,   four,    five');
            // Note: nc will collapse multiple preceeding token spaces to one.
            //----------------------------------------------------------------
            expect(text).toEqual('One, Two, Three, Four, Five');
        });
    });
    describe('namecase() with digits in the tokens', function() {
        it('verify single token', function() {
            var text = ncUtil.namecase('o9e');
            expect(text).toEqual('O9E');
        });
        it('verify single token - starts with space', function() {
            var text = ncUtil.namecase(' on9');
            // Note: nc will collapse first set of preceeding spaces to none.
            //----------------------------------------------------------------
            expect(text).toEqual('ON9');
        });
        it('verify two tokens with no spaces', function() {
            //console.log('*** Before failing test...');
            var text = ncUtil.namecase('7ne,two');
            expect(text).toEqual('7NE,Two');
            //console.log('*** After failing test...');
        });
        it('verify two tokens with one space', function() {
            var text = ncUtil.namecase('one, tw6');
            expect(text).toEqual('One, TW6');
        });
        it('verify 5 tokens with no spaces', function() {
            var text = ncUtil.namecase('o5e,two,th3ee,four,fiv2');
            expect(text).toEqual('O5E,Two,TH3EE,Four,FIV2');
        });
        it('verify 5 tokens with spaces', function() {
            var text = ncUtil.namecase('on2, tw3,  three   4our,    5ive');
            // Note: nc will collapse multiple preceeding token spaces to one.
            //----------------------------------------------------------------
            expect(text).toEqual('ON2, TW3, Three 4OUR, 5IVE');
        });
    });
});

