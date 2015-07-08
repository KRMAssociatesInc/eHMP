'use strict';

//-----------------------------------------------------------------
// This will test the solr-allergy-xform.js functions.
//
// Author: J. Vega
//-----------------------------------------------------------------

require('../../../../env-setup');

var _ = require('underscore');
var xformer = require(global.VX_UTILS + 'solr-xform/solr-document-xform');
var log = require(global.VX_UTILS + '/dummy-logger');
// NOTE: be sure next line is commented out before pushing
// log = require('bunyan').createLogger({
//     name: 'record-enrichment-allergy-xformer-spec',
//     level: 'debug'
// });

describe('solr-document-xform.js', function() {
    describe('transformRecord', function() {
        it('Normal Path', function() {
            var vprRecord = {
                'attending': 'PROGRAMMER,TWENTY',
                'attendingDisplayName': 'Programmer,Twenty',
                'attendingUid': 'urn:va:user:9E7A:755',
                'author': 'PROVIDER,ONE',
                'authorDisplayName': 'Provider,One',
                'authorUid': 'urn:va:user:9E7A:983',
                'clinicians': [
                    {
                        'displayName': 'Provider,One',
                        'name': 'PROVIDER,ONE',
                        'role': 'AU',
                        'summary': 'DocumentClinician{uid=\'urn:va:user:9E7A:983\'}',
                        'uid': 'urn:va:user:9E7A:983'
                    },
                    {
                        'displayName': 'Provider,One',
                        'name': 'PROVIDER,ONE',
                        'role': 'S',
                        'signature': 'ONE PROVIDER',
                        'signedDateTime': '19940311',
                        'summary': 'DocumentClinician{uid=\'urn:va:user:9E7A:983\'}',
                        'uid': 'urn:va:user:9E7A:983'
                    },
                    {
                        'displayName': 'Programmer,Twenty',
                        'name': 'PROGRAMMER,TWENTY',
                        'role': 'C',
                        'signature': 'TOM O\'CONNELL XXXXXXXXXX XXXXXXXXXX XXXXXXXXXX XXXXX',
                        'signedDateTime': '19940311',
                        'summary': 'DocumentClinician{uid=\'urn:va:user:9E7A:755\'}',
                        'uid': 'urn:va:user:9E7A:755'
                    },
                    {
                        'displayName': 'Programmer,Twenty',
                        'name': 'PROGRAMMER,TWENTY',
                        'role': 'EC',
                        'summary': 'DocumentClinician{uid=\'urn:va:user:9E7A:755\'}',
                        'uid': 'urn:va:user:9E7A:755'
                    },
                    {
                        'displayName': 'Bjm',
                        'name': 'BJM',
                        'role': 'E',
                        'summary': 'DocumentClinician{uid=\'urn:va:user:9E7A:11278\'}',
                        'uid': 'urn:va:user:9E7A:11278'
                    },
                    {
                        'displayName': 'Programmer,Twenty',
                        'name': 'PROGRAMMER,TWENTY',
                        'role': 'ATT',
                        'summary': 'DocumentClinician{uid=\'urn:va:user:9E7A:755\'}',
                        'uid': 'urn:va:user:9E7A:755'
                    }
                ],
                'cosignedDateTime': '19940311',
                'cosigner': 'PROGRAMMER,TWENTY',
                'cosignerDisplayName': 'Programmer,Twenty',
                'cosignerUid': 'urn:va:user:9E7A:755',
                'documentClass': 'DISCHARGE SUMMARY',
                'documentDefUid': 'urn:va:doc-def:9E7A:1',
                'documentDefUidVuid': 'urn:va:vuid:4693715',
                'interdisciplinaryType': 'test',
                'documentTypeCode': 'DS',
                'documentTypeName': 'Discharge Summary',
                'encounterName': 'INACTIVE(2 NHCU) Jul 16, 1993',
                'encounterUid': 'urn:va:visit:9E7A:3:985',
                'entered': '19940308',
                'facilityCode': '998',
                'facilityName': 'ABILENE (CAA)',
                'isInterdisciplinary': 'false',
                'kind': 'Discharge Summary',
                'lastUpdateTime': '19940311000000',
                'localId': '308',
                'localTitle': 'Discharge Summary',
                'nationalTitle': {
                    'name': 'DISCHARGE SUMMARY',
                    'vuid': 'urn:va:vuid:4693715'
                },
                'pid': '9E7A;3',
                'referenceDateTime': '19930719',
                'signedDateTime': '19940311',
                'signer': 'PROVIDER,ONE',
                'signerDisplayName': 'Provider,One',
                'signerUid': 'urn:va:user:9E7A:983',
                'stampTime': '19940311000000',
                'status': 'RETRACTED',
                'statusDisplayName': 'Retracted',
                'summary': 'Discharge Summary',
                'text': [
                    {
                        'attending': 'PROGRAMMER,TWENTY',
                        'attendingDisplayName': 'Programmer,Twenty',
                        'attendingUid': 'urn:va:user:9E7A:755',
                        'author': 'PROVIDER,ONE',
                        'authorDisplayName': 'Provider,One',
                        'authorUid': 'urn:va:user:9E7A:983',
                        'clinicians': [
                            {
                                'displayName': 'Provider,One',
                                'name': 'PROVIDER,ONE',
                                'role': 'AU',
                                'summary': 'DocumentClinician{uid=\'urn:va:user:9E7A:983\'}',
                                'uid': 'urn:va:user:9E7A:983'
                            },
                            {
                                'displayName': 'Provider,One',
                                'name': 'PROVIDER,ONE',
                                'role': 'S',
                                'signature': 'ONE PROVIDER',
                                'signedDateTime': '19940311',
                                'summary': 'DocumentClinician{uid=\'urn:va:user:9E7A:983\'}',
                                'uid': 'urn:va:user:9E7A:983'
                            },
                            {
                                'displayName': 'Programmer,Twenty',
                                'name': 'PROGRAMMER,TWENTY',
                                'role': 'C',
                                'signature': 'TOM O\'CONNELL XXXXXXXXXX XXXXXXXXXX XXXXXXXXXX XXXXX',
                                'signedDateTime': '19940311',
                                'summary': 'DocumentClinician{uid=\'urn:va:user:9E7A:755\'}',
                                'uid': 'urn:va:user:9E7A:755'
                            },
                            {
                                'displayName': 'Programmer,Twenty',
                                'name': 'PROGRAMMER,TWENTY',
                                'role': 'EC',
                                'summary': 'DocumentClinician{uid=\'urn:va:user:9E7A:755\'}',
                                'uid': 'urn:va:user:9E7A:755'
                            },
                            {
                                'displayName': 'Bjm',
                                'name': 'BJM',
                                'role': 'E',
                                'summary': 'DocumentClinician{uid=\'urn:va:user:9E7A:11278\'}',
                                'uid': 'urn:va:user:9E7A:11278'
                            },
                            {
                                'displayName': 'Programmer,Twenty',
                                'name': 'PROGRAMMER,TWENTY',
                                'role': 'ATT',
                                'summary': 'DocumentClinician{uid=\'urn:va:user:9E7A:755\'}',
                                'uid': 'urn:va:user:9E7A:755'
                            }
                        ],
                        'content':'TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST',
                        'cosigner': 'PROGRAMMER,TWENTY',
                        'cosignerDisplayName': 'Programmer,Twenty',
                        'cosignerUid': 'urn:va:user:9E7A:755',
                        'dateTime': '19930719',
                        'signer': 'PROVIDER,ONE',
                        'signerDisplayName': 'Provider,One',
                        'signerUid': 'urn:va:user:9E7A:983',
                        'status': 'RETRACTED',
                        'summary': 'DocumentText{uid=\'urn:va:document:9E7A:3:308\'}',
                        'uid': 'urn:va:document:9E7A:3:308'
                    }
                ],
                'uid': 'urn:va:document:9E7A:3:308',
                'urgency': 'routine'
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
            // expect(solrRecord.codes_code).toEqual([vprRecord.codes[0].code]);
            // expect(solrRecord.codes_system).toEqual([vprRecord.codes[0].system]);
            // expect(solrRecord.codes_display).toEqual([vprRecord.codes[0].display]);
            //expect(solrRecord.entered).toBe(vprRecord.entered);
            expect(solrRecord.verified).toBe(vprRecord.verified);

            // Verify Document Specific Fields
            //-------------------------------
            expect(solrRecord.domain).toBe('document');
            expect(solrRecord.document_def_uid_vuid).toEqual([vprRecord.documentDefUidVuid]);
            expect(solrRecord.is_interdisciplinary).toBe(vprRecord.isInterdisciplinary);
            expect(solrRecord.interdisciplinary_type).toBe(vprRecord.interdisciplinaryType);
            expect(solrRecord.body).toEqual([vprRecord.text[0].content]);
            expect(solrRecord.author_uid).toBe(vprRecord.authorUid);
            expect(solrRecord.author_display_name).toBe(vprRecord.authorDisplayName);
            expect(solrRecord.signer_uid).toBe(vprRecord.signerUid);
            expect(solrRecord.signer_display_name).toBe(vprRecord.signerDisplayName);
            expect(solrRecord.signed_date_time).toBe(vprRecord.signedDateTime);
            expect(solrRecord.cosigner_uid).toBe(vprRecord.cosignerUid);
            expect(solrRecord.cosigner_display_name).toBe(vprRecord.cosignerDisplayName);
            expect(solrRecord.attending_uid).toBe(vprRecord.attendingUid);
            expect(solrRecord.attending_display_name).toBe(vprRecord.attendingDisplayName);

            expect(solrRecord.document_type).toBe(vprRecord.documentTypeName);
            expect(solrRecord.document_type_code).toEqual([vprRecord.documentTypeCode]);
            expect(solrRecord.document_type_name).toEqual([vprRecord.documentTypeName]);
            expect(solrRecord.document_class).toBe(vprRecord.documentClass);
            expect(solrRecord.document_status).toBe(vprRecord.status);
            expect(solrRecord.document_entered).toBe(vprRecord.entered);
            expect(solrRecord.local_title).toBe(vprRecord.localTitle);
            expect(solrRecord.urgency).toEqual([vprRecord.urgency]);
            expect(solrRecord.subject).toBe(vprRecord.subject);
            expect(solrRecord.document_def_uid).toBe(vprRecord.documentDefUid);
        });
    });
});