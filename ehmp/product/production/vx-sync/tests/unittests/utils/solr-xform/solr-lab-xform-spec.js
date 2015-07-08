'use strict';

//-----------------------------------------------------------------
// This will test the solr-lab-xform.js functions.
//
// Author: Les Westberg
//-----------------------------------------------------------------

require('../../../../env-setup');

var _ = require('underscore');
var xformer = require(global.VX_UTILS + 'solr-xform/solr-lab-xform');
var log = require(global.VX_UTILS + '/dummy-logger');
// NOTE: be sure next line is commented out before pushing
// log = require('bunyan').createLogger({
//     name: 'record-enrichment-lab-xformer-spec',
//     level: 'debug'
// });

describe('solr-lab-xform.js', function() {
    describe('Transformer', function() {
        it('Happy Path', function() {
            var vprRecord = {
                'abnormal': true,
                'categoryCode': 'urn:va:lab-category:CH',
                'categoryName': 'Laboratory',
                'comment': 'Ordering Provider: Seventeen Labtech Report Released Date/Time: Mar 16, 2010@09:57\r\n Performing Lab: ALBANY VA MEDICAL CENTER\r\n                VA MEDICAL CENTER 1 3RD sT. ALBANY, NY 12180-0097\r\n ',
                'displayName': 'A1C',
                'displayOrder': 998.0000462,
                'facilityCode': '500',
                'facilityName': 'CAMP MASTER',
                'groupName': 'CH 0316 407',
                'groupUid': 'urn:va:accession:9E7A:3:CH;6899693.9',
                'high': '6',
                'interpretationCode': 'urn:hl7:observation-interpretation:H',
                'interpretationName': 'High',
                'kind': 'Laboratory',
                'lastUpdateTime': '20100316095700',
                'lnccodes': [
                    'urn:va:ien:60:97:70'
                ],
                'localId': 'CH;6899693.9;462',
                'low': '3.5',
                'micro': false,
                'observed': '201003051000',
                'pid': '9E7A;3',
                'qualifiedName': 'HEMOGLOBIN A1C (BLOOD)',
                'result': '6.2',
                'resultNumber': 6.2,
                'resulted': '201003160957',
                'sample': 'BLOOD  ',
                'specimen': 'BLOOD',
                'stampTime': '20100316095700',
                'statusCode': 'urn:va:lab-status:completed',
                'statusName': 'completed',
                'summary': 'HEMOGLOBIN A1C (BLOOD) 6.2<em>H</em> % ',
                'typeCode': 'urn:va:ien:60:97:70',
                'typeId': 97,
                'typeName': 'HEMOGLOBIN A1C',
                'uid': 'urn:va:lab:9E7A:3:CH;6899693.9;462',
                'units': '% ',
                'codes': [{
                    'code': 'SomeCode',
                    'system': 'SomeSystem',
                    'display': 'SomeDisplay'
                }],
                'method': 'SomeMethod',
                'bodySite': 'SomeBodySite',
                'resultStatusCode': 'urn:va:lab-status:completed',
                'resultStatusName': 'completed',
                'orderId': 'SomeOrderId',
                'labOrderId': 'SomeLabOrderId',
                'encounterUid': 'SomeEncounterUid'
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
            expect(solrRecord.resulted).toBe(vprRecord.resulted);
            expect(solrRecord.observed).toBe(vprRecord.observed);

            // Verify Lab Specific Fields
            //-------------------------------
            expect(solrRecord.domain).toBe('result');
            expect(solrRecord.group_name).toBe(vprRecord.groupName);
            expect(solrRecord.group_uid).toBe(vprRecord.groupUid);
            expect(solrRecord.specimen).toBe(vprRecord.specimen);
            expect(solrRecord.comment).toEqual([vprRecord.comment]);
            expect(solrRecord.type_code).toBe(vprRecord.typeCode);
            expect(solrRecord.display_name).toBe(vprRecord.displayName);
            expect(solrRecord.result).toBe(vprRecord.result);
            expect(solrRecord.result_number).toEqual([String(vprRecord.resultNumber)]);
            expect(solrRecord.units).toBe(vprRecord.units);
            expect(solrRecord.interpretation_code).toEqual([vprRecord.interpretationCode]);
            expect(solrRecord.interpretation).toEqual([vprRecord.interpretationName]);
            expect(solrRecord.low).toBe(vprRecord.low);
            expect(solrRecord.high).toBe(vprRecord.high);
            expect(solrRecord.method).toBe(vprRecord.method);
            expect(solrRecord.body_site).toBe(vprRecord.bodySite);
            expect(solrRecord.micro).toEqual([String(vprRecord.micro)]);
            expect(solrRecord.qualified_name).toBe(vprRecord.qualifiedName);
            expect(solrRecord.lab_result_type).toBe(vprRecord.typeName);
            expect(solrRecord.qualified_name_units).toBe(vprRecord.qualifiedName + ' ' + vprRecord.units);
            expect(solrRecord.lnccodes).toEqual(vprRecord.lnccodes);
            expect(solrRecord.status_name).toBe(vprRecord.statusName);
            expect(solrRecord.status_code).toBe(vprRecord.statusCode);
            expect(solrRecord.result_status_name).toBe(vprRecord.resultStatusName);
            expect(solrRecord.result_status_code).toBe(vprRecord.resultStatusCode);
            expect(solrRecord.category_code).toBe(vprRecord.categoryCode);
            expect(solrRecord.category_name).toBe(vprRecord.categoryName);
            expect(solrRecord.order_id).toBe(vprRecord.orderId);
            expect(solrRecord.lab_order_id).toBe(vprRecord.labOrderId);
            expect(solrRecord.encounter_uid).toBe(vprRecord.encounterUid);
        });
    });
});