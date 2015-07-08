'use strict';

//-----------------------------------------------------------------
// This will test the solr-vlerdocument-xform.js functions.
//
// Author: Les Westberg
//-----------------------------------------------------------------

require('../../../../env-setup');

var _ = require('underscore');
var xformer = require(global.VX_UTILS + 'solr-xform/solr-vlerdocument-xform');
var log = require(global.VX_UTILS + '/dummy-logger');
// NOTE: be sure next line is commented out before pushing
// log = require('bunyan').createLogger({
//     name: 'record-enrichment-vlerdocument-xformer-spec',
//     level: 'debug'
// });

describe('solr-vlerdocument-xform.js', function() {
    describe('Transformer', function() {
        it('Happy Path', function() {
            var vprRecord = {
                'authorList': [{
                    'institution': 'Conemaugh Health System',
                    'name': '7.9^Epic - Version 7.9^^^^^^^&1.2.840.114350.1.1&ISO'
                }],
                'creationTime': '20140617014116',
                'doucmentUniqueId': '29deea5f-efa3-4d1c-a43d-d64ea4f4de30',
                'homeCommunityId': 'urn:oid:1.3.6.1.4.1.26580.10',
                'kind': 'C32 Document',
                'mimeType': null,
                'name': 'Continuity of Care Document',
                'pid': 'VLER;10108V420871',
                'repositoryUniqueId': '1.2.840.114350.1.13.48.3.7.2.688879',
                'sections': [{
                    'code': {
                        'code': '48765-2',
                        'display': null,
                        'system': '2.16.840.1.113883.6.1',
                        'systemName': null
                    },
                    'templateIds': [{
                        'root': '2.16.840.1.113883.3.88.11.83.102'
                    }, {
                        'root': '1.3.6.1.4.1.19376.1.5.3.1.3.13'
                    }, {
                        'root': '2.16.840.1.113883.10.20.1.2'
                    }],
                    'text': 'First line of text.',
                    'title': 'Allergies and Adverse Reactions'
                }, {
                    'code': {
                        'code': '11450-4',
                        'display': null,
                        'system': '2.16.840.1.113883.6.1',
                        'systemName': null
                    },
                    'templateIds': [{
                        'root': '2.16.840.1.113883.3.88.11.83.103'
                    }, {
                        'root': '1.3.6.1.4.1.19376.1.5.3.1.3.6'
                    }, {
                        'root': '2.16.840.1.113883.10.20.1.11'
                    }],
                    'text': 'Second line of text.',
                    'title': 'Problems'
                }, {
                    'code': {
                        'code': '10160-0',
                        'display': null,
                        'system': '2.16.840.1.113883.6.1',
                        'systemName': null
                    },
                    'templateIds': [{
                        'root': '2.16.840.1.113883.3.88.11.83.112'
                    }, {
                        'root': '1.3.6.1.4.1.19376.1.5.3.1.3.19'
                    }, {
                        'root': '2.16.840.1.113883.10.20.1.8'
                    }],
                    'text': 'Third line of text.',
                    'title': 'Medications'
                }],
                'sourcePatientId': '\'8394^^^& 1.3.6.1.4.1.26580.10.1.100&ISO\'',
                'stampTime': '20150415124228',
                'summary': 'Continuity of Care Document',
                'uid': 'urn:va:vlerdocument:VLER:10108V420871:29deea5f-efa3-4d1c-a43d-d64ea4f4de30'
            };
            var solrRecord = xformer(vprRecord, log);

            // Verify Common Fields
            //---------------------
            expect(solrRecord.uid).toBe(vprRecord.uid);
            expect(solrRecord.pid).toBe(vprRecord.pid);
            expect(solrRecord.kind).toBe(vprRecord.kind);
            expect(solrRecord.summary).toBe(vprRecord.summary);

            // Verify Vlerdocument Specific Fields
            //-------------------------------
            expect(solrRecord.domain).toBe('vlerdocument');
            expect(solrRecord.creation_time).toBe(vprRecord.creationTime);
            expect(solrRecord.datetime).toBe(vprRecord.creationTime);
            expect(solrRecord.datetime_all).toContain(vprRecord.creationTime);
            expect(solrRecord.name).toBe(vprRecord.name);
            expect(_.isArray(solrRecord.section)).toBe(true);
            if (_.isArray(solrRecord.section)) {
                expect(solrRecord.section.length).toBe(3);
                if (solrRecord.section.length === 3) {
                    expect(solrRecord.section).toContain(vprRecord.sections[0].title + ' ' + vprRecord.sections[0].text);
                    expect(solrRecord.section).toContain(vprRecord.sections[1].title + ' ' + vprRecord.sections[1].text);
                    expect(solrRecord.section).toContain(vprRecord.sections[2].title + ' ' + vprRecord.sections[2].text);
                }
            }
            expect(solrRecord.document_unique_id).toBe(vprRecord.documentUniqueId);
            expect(solrRecord.home_community_id).toBe(vprRecord.homeCommunityId);
            expect(solrRecord.repository_unique_id).toBe(vprRecord.repositoryUniqueId);
            expect(solrRecord.source_patient_id).toBe(vprRecord.sourcePatientId);
        });
    });
});