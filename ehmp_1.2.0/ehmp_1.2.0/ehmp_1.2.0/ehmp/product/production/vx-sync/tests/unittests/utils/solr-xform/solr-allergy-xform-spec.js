'use strict';

//-----------------------------------------------------------------
// This will test the solr-allergy-xform.js functions.
//
// Author: Les Westberg
//-----------------------------------------------------------------

require('../../../../env-setup');

var _ = require('underscore');
var xformer = require(global.VX_UTILS + 'solr-xform/solr-allergy-xform');
var log = require(global.VX_UTILS + '/dummy-logger');
// NOTE: be sure next line is commented out before pushing
// log = require('bunyan').createLogger({
//     name: 'record-enrichment-allergy-xformer-spec',
//     level: 'debug'
// });

describe('solr-allergy-xform.js', function() {
    describe('Transformer', function() {
        it('Happy Path', function() {
            var vprRecord = {
                'codes': [
                    {
                        'code': 'C0008299',
                        'display': 'Chocolate',
                        'system': 'urn:oid:2.16.840.1.113883.6.86'
                    }
                ],
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
                'products': [
                    {
                        'name': 'CHOCOLATE',
                        'summary': 'AllergyProduct{uid=\'\'}',
                        'vuid': 'urn:va:vuid:4636681'
                    }
                ],
                'reactions': [
                    {
                        'name': 'DIARRHEA',
                        'summary': 'AllergyReaction{uid=\'\'}',
                        'vuid': 'urn:va:vuid:4637011'
                    }
                ],
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
            var solrRecord = xformer(vprRecord, log);

            // Verify Common Fields
            //---------------------
            expect(solrRecord.uid).toBe(vprRecord.uid);
            expect(solrRecord.pid).toBe(vprRecord.pid);
            expect(solrRecord.facility_code).toBe(vprRecord.facilityCode);
            expect(solrRecord.facility_name).toBe(vprRecord.facilityName);
            expect(solrRecord.kind).toBe(vprRecord.kind);
            expect(solrRecord.summary).toBe(vprRecord.summary);
            expect(solrRecord.codes_code).toEqual([vprRecord.codes[0].code]);
            expect(solrRecord.codes_system).toEqual([vprRecord.codes[0].system]);
            expect(solrRecord.codes_display).toEqual([vprRecord.codes[0].display]);
            expect(solrRecord.entered).toBe(vprRecord.entered);
            expect(solrRecord.verified).toBe(vprRecord.verified);

            // Verify Allergy Specific Fields
            //-------------------------------
            expect(solrRecord.domain).toBe('allergy');
            expect(solrRecord.datetime).toBe(vprRecord.entered);
            expect(solrRecord.originator_name).toEqual([vprRecord.originatorName]);
            expect(solrRecord.verifier_name).toEqual([vprRecord.verifierName]);
            expect(solrRecord.mechanism).toEqual([vprRecord.mechanism]);
            expect(solrRecord.type_name).toEqual([vprRecord.typeName]);
            expect(solrRecord.allergy_severity).toBe(vprRecord.severityName);
            expect(solrRecord.entered_by_uid).toBe(vprRecord.enteredByUid);
            expect(solrRecord.verified_by_uid).toBe(vprRecord.verifiedByUid);
            expect(solrRecord.severity_name).toBe(vprRecord.severityName);
            expect(solrRecord.allergy_product).toEqual([vprRecord.products[0].name]);
            expect(solrRecord.allergy_reaction).toEqual([vprRecord.reactions[0].name]);
            expect(solrRecord.drug_class).toEqual([vprRecord.drugClasses[0].name]);
            expect(solrRecord.comment).toEqual([vprRecord.comments[0].comment]);
            expect(solrRecord.observation).toEqual([vprRecord.observations[0].severity]);
        });
    });
});