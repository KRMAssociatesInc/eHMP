'use strict';

require('../../../env-setup');

var _ = require('underscore');

var solrXform = require(global.VX_UTILS + 'solr-xform');
var log = require(global.VX_UTILS + '/dummy-logger');
// NOTE: be sure next line is commented out before pushing
// log = require('bunyan').createLogger({
//     name: 'solr-xform-spec',
//     level: 'debug'
// });


describe('solr-xform.js', function() {
    it('Can locate and find a transform and use it to transform a record.', function() {
        var vprAllergyRecord = {
            'codes': [{
                'code': 'C0008299',
                'display': 'Chocolate',
                'system': 'urn:oid:2.16.840.1.113883.6.86'
            }],
            'drugClasses': [{
                'code': 'CHOCO100',
                'name': 'CHOCOLATE'
            }],
            'entered': '200712171515',
            'enteredByUid': 'urn:va:user:9E7A:100',
            'verifiedByUid': 'urn:va:user:9E7A:101',
            'facilityCode': '500',
            'facilityName': 'CAMP MASTER',
            'historical': true,
            'kind': 'Allergy/Adverse Reaction',
            'lastUpdateTime': '20071217151553',
            'localId': '876',
            'mechanism': 'ALLERGY',
            'originatorName': 'PROVIDER,ONE',
            'pid': '9E7A;8',
            'products': [{
                'name': 'CHOCOLATE',
                'summary': 'AllergyProduct{uid=\'\'}',
                'vuid': 'urn:va:vuid:4636681'
            }],
            'reactions': [{
                'name': 'DIARRHEA',
                'summary': 'AllergyReaction{uid=\'\'}',
                'vuid': 'urn:va:vuid:4637011'
            }],
            'reference': '3;GMRD(120.82,',
            'stampTime': '20071217151553',
            'summary': 'CHOCOLATE',
            'typeName': 'DRUG, FOOD',
            'uid': 'urn:va:allergy:9E7A:8:876',
            'verified': '20071217151553',
            'verifierName': '<auto-verified>',
            'comments': [{
                'entered': 200503172009,
                'comment': 'The allergy comment.'
            }],
            'observations': [{
                'date': 200503172009,
                'severity': 'bad'
            }],
            'severityName': 'SEVERE'

        };
        var solrRecord = solrXform(vprAllergyRecord, log);
        expect(_.isObject(solrRecord)).toBe(true);
        expect(solrRecord.uid).toBe(vprAllergyRecord.uid);
    });
});