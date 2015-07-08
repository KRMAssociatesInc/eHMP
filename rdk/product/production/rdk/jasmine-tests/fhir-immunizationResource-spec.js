/*jslint node: true */
'use strict';

var _ = require('underscore');
var ImmunizationResource = require('../fhir/immunization/immunizationResource');
var fhirUtils = require('../fhir/common/utils/fhirUtils');

describe('Immunization FHIR Resource', function() {
    var inputValue = {
        'apiVersion': '1.0',
        'data': {
            'updated': 20141014050323,
            'totalItems': 2,
            'currentItemCount': 2,
            'items': [{
                'facilityCode': '888',
                'facilityName': 'FT. LOGAN',
                'administeredDateTime': '200004061200',
                'cptCode': 'urn:cpt:90732',
                'cptName': 'PNEUMOCOCCAL VACCINE',
                'performerUid': 'urn:va:user:9E7A:11623',
                'encounterUid': 'urn:va:visit:9E7A:253:2035',
                'kind': 'Immunization',
                'uid': 'urn:va:immunization:9E7A:253:60',
                'summary': 'PNEUMOCOCCAL',
                'pid': '9E7A;253',
                'localId': '60',
                'name': 'PNEUMOCOCCAL',
                'contraindicated': false,
                'seriesName': 'BOOSTER',
                'comment': 'test comment',
                'reactionName': 'TEST REACTION',
                'codes': [{
                    'code': '33',
                    'system': 'urn:oid:2.16.840.1.113883.12.292',
                    'display': 'pneumococcal polysaccharide vaccine, 23 valent'
                }],
                'performerName': 'STUDENT,SEVEN',
                'locationUid': 'urn:va:location:9E7A:32',
                'seriesCode': 'urn:va:series:9E7A:253:BOOSTER',
                'locationName': 'PRIMARY CARE',
                'encounterName': 'PRIMARY CARE Apr 06, 2000'
            }, {
                'facilityCode': '888',
                'facilityName': 'FT. LOGAN',
                'administeredDateTime': '200004061200',
                'cptCode': 'urn:cpt:90732',
                'cptName': 'PNEUMOCOCCAL VACCINE',
                'performerUid': 'urn:va:user:C877:11623',
                'encounterUid': 'urn:va:visit:C877:253:2035',
                'kind': 'Immunization',
                'uid': 'urn:va:immunization:C877:253:60',
                'summary': 'PNEUMOCOCCAL',
                'pid': '9E7A;253',
                'localId': '60',
                'name': 'PNEUMOCOCCAL',
                'contraindicated': false,
                'seriesName': 'BOOSTER',
                'comment': 'test comment',
                'reactionName': 'TEST REACTION',
                'codes': [{
                    'code': '33',
                    'system': 'urn:oid:2.16.840.1.113883.12.292',
                    'display': 'pneumococcal polysaccharide vaccine, 23 valent'
                }],
                'performerName': 'STUDENT,SEVEN',
                'locationUid': 'urn:va:location:C877:32',
                'seriesCode': 'urn:va:series:C877:253:BOOSTER',
                'locationName': 'PRIMARY CARE',
                'encounterName': 'PRIMARY CARE Apr 06, 2000'
            }]
        }
    };
    var req = {
        '_pid': '9E7A;253',
        query: '/fhir/diagnosticreport?subject.identifier=9E7A;253&domain=rad',
        headers: {
            host: 'localhost:8888'
        },
        protocol: 'http'
    };
    var vprImmunization = inputValue.data.items;
    var fhirImmunization = ImmunizationResource.convertToFhir(inputValue, req);

    it('verifies that given a valid VPR Immunization Resource converts to a defined FHIR Immunization Resource object', function() {
        expect(fhirImmunization).toBeDefined();
    });

    _.each(vprImmunization, function(vprIm) {
        it('verifies that each VPR Immunization Resource has a coresponding FHIR Immunization Resource in the collection with the same uid', function() {

            var fhirIm = _.find(fhirImmunization.entry, function(im) {
                var id = im.id.substr(im.id.lastIndexOf('/') + 1);
                return id === vprIm.uid;
            });
            expect(fhirIm).toBeDefined();
            if (fhirIm !== undefined) {
                describe('found FHIR Immunization that coresponds to the original VPR Immunization Resource', function() {
                    it('verifies that the facility code information from VPR Immunization Resource coresponds to the one from the FHIR Immunization Resource', function() {
                        var fcode = _.find(fhirIm.content.contained, function(c) {
                            return c.resourceType === 'Organization';
                        });
                        expect(fcode.identifier[0].value).toEqual(vprIm.facilityCode);
                        expect(fcode.name).toEqual(vprIm.facilityName);
                    });
                    it('verifies that the administered date time from VPR Immunization Resource coresponds to the one from the FHIR Immunization Resource', function() {
                        expect(fhirIm.content.date).toEqual(fhirUtils.convertToFhirDateTime(vprIm.administeredDateTime));
                    });
                    it('verifies that the cptCode from VPR Immunization Resource coresponds to the one from the FHIR Immunization Resource', function() {
                        expect(fhirIm.content.vaccineType.coding[0].code).toEqual(vprIm.cptCode);
                    });
                    it('verifies that the cptName from VPR Immunization Resource coresponds to the one from the FHIR Immunization Resource', function() {
                        expect(fhirIm.content.vaccineType.coding[0].display).toEqual(vprIm.cptName);
                    });
                    it('verifies that the performer uid from VPR Immunization Resource coresponds to the one from the FHIR Immunization Resource', function() {
                        var pUid = _.find(fhirIm.content.contained, function(c) {
                            return c.resourceType === 'Practitioner';
                        });
                        expect(pUid.identifier[0].value).toEqual(vprIm.performerUid);
                        expect(pUid.text.status).toEqual('generated');
                        expect(fhirUtils.removeDivFromText(pUid.text.div)).toEqual(vprIm.performerName);
                        expect(pUid.identifier[0].label).toEqual('uid');
                    });
                    it('verifies that the performer name from VPR Immunization Resource coresponds to the one from the FHIR Immunization Resource', function() {
                        expect(fhirIm.content.performer.display).toEqual(vprIm.performerName);
                    });
                    it('verifies that the encounter uid from VPR Immunization Resource coresponds to the one from the FHIR Immunization Resource', function() {
                        var eUid = _.find(fhirIm.content.extension, function(e) {
                            return e.url === 'http://vistacore.us/fhir/extensions/immunization#encounterUid';
                        });
                        expect(eUid.valueString).toEqual(vprIm.encounterUid);
                    });
                    it('verifies that the summary from VPR Immunization Resource coresponds to the one from the FHIR Immunization Resource', function() {
                        expect(fhirUtils.removeDivFromText(fhirIm.content.text.div)).toEqual(vprIm.summary);
                    });
                    it('verifies that the pid from VPR Immunization Resource coresponds to the one from the FHIR Immunization Resource', function() {
                        expect(fhirIm.content.subject.reference).toEqual('Patient/' + vprIm.pid);
                    });
                    it('verifies that the contraindicated information from VPR Immunization Resource coresponds to the one from the FHIR Immunization Resource', function() {
                        var contra = _.find(fhirIm.content.extension, function(e) {
                            return e.url === 'http://vistacore.us/fhir/extensions/immunization#contraindicated';
                        });
                        expect(contra.valueBoolean).toEqual(vprIm.contraindicated);
                    });
                    it('verifies that the series name from VPR Immunization Resource coresponds to the one from the FHIR Immunization Resource', function() {
                        var eSeries = _.find(fhirIm.content.extension, function(e) {
                            return e.url === 'http://vistacore.us/fhir/extensions/immunization#seriesName';
                        });
                        expect(eSeries.valueString).toEqual(vprIm.seriesName);
                    });
                    it('verifies that the comment from VPR Immunization Resource coresponds to the one from the FHIR Immunization Resource', function() {
                        var comm = _.find(fhirIm.content.extension, function(e) {
                            return e.url === 'http://vistacore.us/fhir/extensions/immunization#comment';
                        });
                        expect(comm.valueString).toEqual(vprIm.comment);
                    });
                    it('verifies that the location name from VPR Immunization Resource coresponds to the one from the FHIR Immunization Resource', function() {
                        expect(fhirIm.content.location.display).toEqual(vprIm.locationName);
                    });
                    it('verifies that the location uid from VPR Immunization Resource coresponds to the one from the FHIR Immunization Resource', function() {
                        var lUid = _.find(fhirIm.content.contained, function(c) {
                            return c.resourceType === 'Location';
                        });
                        expect(lUid.identifier[0].value).toEqual(vprIm.locationUid);
                        expect(lUid.text.status).toEqual('generated');
                        expect(fhirUtils.removeDivFromText(lUid.text.div)).toEqual(vprIm.locationName);
                        expect(lUid.identifier[0].label).toEqual('uid');
                    });
                    it('verifies that the encounter name from VPR Immunization Resource coresponds to the one from the FHIR Immunization Resource', function() {
                        var eName = _.find(fhirIm.content.extension, function(e) {
                            return e.url === 'http://vistacore.us/fhir/extensions/immunization#encounterName';
                        });
                        expect(eName.valueString).toEqual(vprIm.encounterName);
                    });
                    it('verifies that the series name from VPR Immunization Resource coresponds to the one from the FHIR Immunization Resource', function() {
                        expect(fhirIm.content.reaction.detail.symptom.code.text).toEqual(vprIm.reactionName);
                    });
                });
            }
        });

    });
});
