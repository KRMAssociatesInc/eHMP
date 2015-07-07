'use strict';

require('../../../env-setup');

var xformUtils = require(global.VX_UTILS + 'xform-utils');

var dodCodes = [{
    code: 7090000,
    system: 'DOD_ALLERGY_IEN'
}, {
    code: 'C0037494',
    display: 'Sodium Chloride',
    system: 'UMLS'
}];

var vprCodes = [{
    code: 7090000,
    system: 'DOD_ALLERGY_IEN'
}, {
    code: 'C0037494',
    display: 'Sodium Chloride',
    system: 'urn:oid:2.16.840.1.113883.6.86'
}];

describe('xform utils', function() {
    describe('transformCodes', function() {
        it('transform dod codes to vpr codes', function() {
            var transformedCodes = xformUtils.transformCodes(dodCodes);
            expect(transformedCodes).toEqual(vprCodes);
        });
    });
});