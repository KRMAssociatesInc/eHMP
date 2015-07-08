'use strict';

require('../../../env-setup');

var stringUtil = require(global.VX_UTILS + 'string-utils');

describe('string-utils.js', function() {
    describe('leftPad()', function() {
        it('verify correct structure', function() {
            expect(stringUtil.leftPad('', 5, '0')).toEqual('00000');
            expect(stringUtil.leftPad('15', 5, '0')).toEqual('00015');
            expect(stringUtil.leftPad(100, 5, '0')).toEqual('00100');
            expect(stringUtil.leftPad(10099, 5, '0')).toEqual('10099');
            expect(stringUtil.leftPad(1009999, 5, '0')).toEqual('1009999');
        });
    });
    describe('nullSafeSliceAndParseInt()', function() {
        it('verify correct structure', function() {
            expect(stringUtil.nullSafeSliceAndParseInt('20011001092350', 0, 4)).toBe(2001);
            expect(stringUtil.nullSafeSliceAndParseInt('20011001092350', 4, 6)).toBe(10);
            expect(stringUtil.nullSafeSliceAndParseInt('20011001092350', 6, 8)).toBe(1);
            expect(stringUtil.nullSafeSliceAndParseInt('20011001092350', 20, 22)).toBeNull();
            expect(stringUtil.nullSafeSliceAndParseInt(null, 20, 22)).toBeNull();
            expect(stringUtil.nullSafeSliceAndParseInt(undefined, 20, 22)).toBeNull();
            expect(stringUtil.nullSafeSliceAndParseInt('', 20, 22)).toBeNull();
        });
    });
});