'use strict';

//-----------------------------------------------------------------
// This will test the solr-med-xform.js functions.
//
// Author: Les Westberg
//-----------------------------------------------------------------

require('../../../../env-setup');

var _ = require('underscore');
var xformer = require(global.VX_UTILS + 'solr-xform/solr-med-xform');
var log = require(global.VX_UTILS + '/dummy-logger');
// NOTE: be sure next line is commented out before pushing
// log = require('bunyan').createLogger({
//     name: 'record-enrichment-med-xformer-spec',
//     level: 'debug'
// });

describe('solr-med-xform.js', function() {
    describe('Transformer', function() {
        it('Happy Path', function() {
            var vprRecord = {
                'IMO': false,
                'codes': [{
                    'code': '866514',
                    'display': 'Metoprolol Tartrate 50 MG Oral Tablet',
                    'system': 'urn:oid:2.16.840.1.113883.6.88'
                }],
                'dosages': [{
                    'amount': '1',
                    'dose': '50',
                    'instructions': '50MG',
                    'noun': 'TABLET',
                    'relativeStart': 0,
                    'relativeStop': 420480,
                    'routeName': 'PO',
                    'scheduleFreq': 720,
                    'scheduleName': 'BID',
                    'scheduleType': 'CONTINUOUS',
                    'start': '20070411',
                    'stop': '20080128',
                    'summary': 'MedicationDose{uid=\'\'}',
                    'units': 'MG'
                }],
                'facilityCode': '500',
                'facilityName': 'CAMP MASTER',
                'fills': [{
                    'daysSupplyDispensed': 90,
                    'dispenseDate': '20070411',
                    'quantityDispensed': '180',
                    'releaseDate': '20070411',
                    'routing': 'M',
                    'summary': 'MedicationFill{uid=\'\'}'
                }],
                'kind': 'Medication, Outpatient',
                'lastAdmin': '20070411',
                'lastFilled': '20070411',
                'lastUpdateTime': '20080411000000',
                'localId': '403230;O',
                'medStatus': 'urn:sct:73425007',
                'medStatusName': 'not active',
                'medType': 'urn:sct:73639000',
                'name': 'METOPROLOL TARTRATE TAB',
                'orders': [{
                    'daysSupply': 90,
                    'fillCost': '2.466',
                    'fillsAllowed': 3,
                    'fillsRemaining': 3,
                    'locationName': 'GENERAL MEDICINE',
                    'locationUid': 'urn:va:location:9E7A:23',
                    'orderUid': 'urn:va:order:9E7A:3:18067',
                    'ordered': '200704111627',
                    'pharmacistName': 'PHARMACIST,ONE',
                    'pharmacistUid': 'urn:va:user:9E7A:10000000056',
                    'prescriptionId': 500513,
                    'providerName': 'VEHU,ONEHUNDRED',
                    'providerUid': 'urn:va:user:9E7A:10000000031',
                    'quantityOrdered': '180',
                    'successor': 'urn:va:med:9E7A:3:21173',
                    'summary': 'MedicationOrder{uid=\'\'}',
                    'vaRouting': 'M'
                }],
                'overallStart': '20070411',
                'overallStop': '20080128',
                'patientInstruction': 'SomeInstruction',
                'pid': '9E7A;3',
                'productFormName': 'TAB',
                'products': [{
                    'drugClassCode': 'urn:vadc:CV100',
                    'drugClassName': 'BETA BLOCKERS/RELATED',
                    'ingredientCode': 'urn:va:vuid:4019836',
                    'ingredientCodeName': 'METOPROLOL',
                    'ingredientName': 'METOPROLOL TARTRATE TAB',
                    'ingredientRXNCode': 'urn:rxnorm:6918',
                    'ingredientRole': 'urn:sct:410942007',
                    'strength': '50 MG',
                    'summary': 'MedicationProduct{uid=\'\'}',
                    'suppliedCode': 'urn:va:vuid:4004608',
                    'suppliedName': 'METOPROLOL TARTRATE 50MG TAB'
                }],
                'qualifiedName': 'METOPROLOL TARTRATE TAB',
                'rxncodes': [
                    'urn:vandf:4019836',
                    'urn:ndfrt:N0000010595',
                    'urn:ndfrt:N0000000001',
                    'urn:ndfrt:N0000010582',
                    'urn:rxnorm:6918',
                    'urn:ndfrt:N0000007508'
                ],
                'sig': 'TAKE ONE TABLET BY MOUTH TWICE A DAY',
                'stampTime': '20080411000000',
                'stopped': '20080128',
                'summary': 'METOPROLOL TARTRATE 50MG TAB (DISCONTINUED)\n TAKE ONE TABLET BY MOUTH TWICE A DAY',
                'supply': false,
                'type': 'Prescription',
                'uid': 'urn:va:med:9E7A:3:18067',
                'units': 'MG',
                'vaStatus': 'DISCONTINUED',
                'vaType': 'O',
                'administrations': [{
                    'prnReason' : 'SomePrnReason',
                    'comments': [{
                        'text': 'Comment1Text1'
                    }, {
                        'text': 'Comment1Text2'
                    }]
                }, {
                    'comments': [{
                        'text': 'Comment2Text1'
                    }, {
                        'text': 'Comment2Text2'
                    }]
                }],
                'indications': [{
                    'code': 'TheCode',
                    'narrative': 'TheNarrative'
                }]
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
            expect(solrRecord.overall_start).toBe(vprRecord.overallStart);
            expect(solrRecord.overall_stop).toBe(vprRecord.overallStop);

            // Verify Med Specific Fields
            //-------------------------------
            expect(solrRecord.domain).toBe('med');
            expect(solrRecord.med_sig).toBe(vprRecord.sig);
            expect(solrRecord.med_pt_instruct).toBe(vprRecord.patientInstruction);
            expect(solrRecord.va_type).toBe(vprRecord.vaType);
            expect(solrRecord.type).toBe(vprRecord.type);
            expect(solrRecord.name).toBe(vprRecord.name);
            expect(solrRecord.med_ingredient_code).toEqual([vprRecord.products[0].ingredientCode]);
            expect(solrRecord.med_ingredient_code_name).toEqual([vprRecord.products[0].ingredientCodeName]);
            expect(solrRecord.med_ingredient_name).toEqual([vprRecord.products[0].ingredientName]);
            expect(solrRecord.med_ingredient_rxn_code).toEqual([vprRecord.products[0].ingredientRXNCode]);
            expect(solrRecord.med_drug_class_code).toEqual([vprRecord.products[0].drugClassCode]);
            expect(solrRecord.med_drug_class_name).toEqual([vprRecord.products[0].drugClassName]);
            expect(solrRecord.med_supplied_code).toEqual([vprRecord.products[0].suppliedCode]);
            expect(solrRecord.med_supplied_name).toEqual([vprRecord.products[0].suppliedName]);
            expect(solrRecord.med_provider).toEqual([vprRecord.orders[0].providerName]);
            expect(solrRecord.last_filled).toBe(vprRecord.lastFilled);
            expect(solrRecord.last_admin).toBe(vprRecord.lastAdmin);
            expect(_.isArray(solrRecord.administration_comment)).toBe(true);
            expect(solrRecord.administration_comment.length).toBe(4);
            if ((_.isArray(solrRecord.administration_comment)) && (solrRecord.administration_comment.length === 4)) {
                expect(solrRecord.administration_comment).toContain(vprRecord.administrations[0].comments[0].text);
                expect(solrRecord.administration_comment).toContain(vprRecord.administrations[0].comments[1].text);
                expect(solrRecord.administration_comment).toContain(vprRecord.administrations[1].comments[0].text);
                expect(solrRecord.administration_comment).toContain(vprRecord.administrations[1].comments[1].text);
            }
            expect(solrRecord.prn_reason).toEqual([vprRecord.administrations[0].prnReason]);
            expect(solrRecord.med_indication_code).toEqual([vprRecord.indications[0].code]);
            expect(solrRecord.med_indication_narrative).toEqual([vprRecord.indications[0].narrative]);
            expect(solrRecord.qualified_name).toBe(vprRecord.qualifiedName);
            expect(solrRecord.supply).toBe(String(vprRecord.supply));
            expect(solrRecord.rxncodes).toEqual(vprRecord.rxncodes);
            expect(solrRecord.units).toBe(vprRecord.units);
        });
    });
});