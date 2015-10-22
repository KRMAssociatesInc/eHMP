'use strict';

var resource = require('./notes-vista-writer');

describe('write-back notes vista writer', function() {
    describe('tests encounterObj()', function() {
        it('returns expected object when model contains a formatted encounterUid', function() {
            var model = {
                'authorUid': '10000000255',
                'documentDefUid': 'urn:va:doc-def:9E7A:40',
                'encounterUid': 'A;2931013.14;32',
                'locationUid': 'urn:va:location:9E7A:32',
                'patientIcn': '10110V004877',
                'pid': '9E7A;8',
                'status': 'UNSIGNED'
            };
            var expectedObj = {
                location: '32',
                dateTime: '2931013.14',
                category: 'A'
            };
            var retObj = resource._encounterObj(model);
            expect(retObj).to.eql(expectedObj);
        });
        it('returns empty object when model is missing encounterUid', function() {
            var model = {
                'authorUid': '10000000255',
                'documentDefUid': 'urn:va:doc-def:9E7A:40',
                'locationUid': 'urn:va:location:9E7A:32',
                'patientIcn': '10110V004877',
                'pid': '9E7A;8',
                'status': 'UNSIGNED'
            };
            var expectedObj = {};
            var retObj = resource._encounterObj(model);
            expect(retObj).to.eql(expectedObj);
        });
        it('returns empty object when model is missing encounterDateTime', function() {
            var model = {
                'authorUid': '10000000255',
                'documentDefUid': 'urn:va:doc-def:9E7A:40',
                'encounterUid': 'H2931013',
                'locationUid': 'urn:va:location:9E7A:32',
                'patientIcn': '10110V004877',
                'pid': '9E7A;8',
                'status': 'UNSIGNED'
            };
            var expectedObj = {};
            var retObj = resource._encounterObj(model);
            expect(retObj).to.eql(expectedObj);
        });
        it('returns empty object when model is missing locationUid', function() {
            var model = {
                'authorUid': '10000000255',
                'documentDefUid': 'urn:va:doc-def:9E7A:40',
                'encounterUid': 'H2931013',
                'encounterDateTime': '199310131400',
                'patientIcn': '10110V004877',
                'pid': '9E7A;8',
                'status': 'UNSIGNED'
            };
            var expectedObj = {};
            var retObj = resource._encounterObj(model);
            expect(retObj).to.eql(expectedObj);
        });
        it('returns expected object when model contains unformatted encounterUid', function() {
            var model = {
                'authorUid': '10000000255',
                'documentDefUid': 'urn:va:doc-def:9E7A:40',
                'encounterUid': 'H2931013',
                'encounterDateTime': '199310131400',
                'locationUid': 'urn:va:location:9E7A:32',
                'patientIcn': '10110V004877',
                'pid': '9E7A;8',
                'status': 'UNSIGNED'
            };
            var expectedObj = {
                location: '32',
                dateTime: '2931013.1400',
                category: 'H'
            };
            var retObj = resource._encounterObj(model);
            expect(retObj).to.eql(expectedObj);
        });
    });
    describe('tests getStub()', function() {
        it('returns expected array when model contains bare minimum ', function() {
            var model = {
                'authorUid': '10000000255',
                'documentDefUid': 'urn:va:doc-def:9E7A:40',
                'patientIcn': '10110V004877',
                'pid': '9E7A;8',
                'status': 'UNSIGNED'
            };
            var expectedArray = ['8', '40', '', '', '', {
                '1202': '10000000255',
                '1205': '',
                '1301': '',
                '\"TEXT\",1,0': 'This is a stub of an Unsigned note created in eHMP.',
                '\"TEXT\",2,0': 'Please edit the note in eHMP.',
                '\"TEXT\",3,0': 'Edits here will not be saved in eHMP and may be overwritten.'
            }, '', '1'];
            var retObj = resource._getStub(model);
            expect(retObj).to.eql(expectedArray);
        });
        it('returns expected array when model contains referenceDateTime', function() {
            var model = {
                'authorUid': '10000000255',
                'documentDefUid': 'urn:va:doc-def:9E7A:40',
                'referenceDateTime':'201507101410',
                'patientIcn': '10110V004877',
                'pid': '9E7A;8',
                'status': 'UNSIGNED'
            };
            var expectedArray = ['8', '40', '', '', '', {
                '1202': '10000000255',
                '1205': '',
                '1301': '3150710.1410',
                '\"TEXT\",1,0': 'This is a stub of an Unsigned note created in eHMP.',
                '\"TEXT\",2,0': 'Please edit the note in eHMP.',
                '\"TEXT\",3,0': 'Edits here will not be saved in eHMP and may be overwritten.'
            }, '', '1'];
            var retObj = resource._getStub(model);
            expect(retObj).to.eql(expectedArray);
        });
        it('returns expected array when model contains encounter information', function() {
            var model = {
                'authorUid': '10000000255',
                'documentDefUid': 'urn:va:doc-def:9E7A:40',
                'encounterUid': 'H2931013',
                'encounterDateTime': '199310131400',
                'referenceDateTime':'201507101410',
                'locationUid': 'urn:va:location:9E7A:32',
                'patientIcn': '10110V004877',
                'pid': '9E7A;8',
                'status': 'UNSIGNED'
            };
            var expectedArray = ['8', '40', '', '', '', {
                '1202': '10000000255',
                '1205': '32',
                '1301': '3150710.1410',
                '\"TEXT\",1,0': 'This is a stub of an Unsigned note created in eHMP.',
                '\"TEXT\",2,0': 'Please edit the note in eHMP.',
                '\"TEXT\",3,0': 'Edits here will not be saved in eHMP and may be overwritten.'
            }, '32;2931013.1400;H', '', '1'];
            var retObj = resource._getStub(model);
            expect(retObj).to.eql(expectedArray);
        });
    });
});
