'use strict';

require('../../../env-setup');

var termSystem = require(global.VX_UTILS + 'JLVTerminologySystem');

describe('JLVTerminologySystem', function(){
    it('get term system uri from name', function(){
        var uri = termSystem.getTermSystemOidOrUrn('LOINC');
        expect(uri).toEqual('http://loinc.org');
    });
    it('get term system oid from name', function(){
        var uri = termSystem.getTermSystemOidOrUrn('UMLS');
        expect(uri).toEqual('urn:oid:2.16.840.1.113883.6.86');
    });
    it('get null from invalid system name', function(){
        var uri = termSystem.getTermSystemOidOrUrn('invalid system');
        expect(uri).toBeNull();
    });
});