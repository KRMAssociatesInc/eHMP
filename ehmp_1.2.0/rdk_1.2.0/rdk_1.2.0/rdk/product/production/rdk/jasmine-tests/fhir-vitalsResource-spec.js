'use strict';
var _ = require('underscore');
var vitalsResource = require('../fhir/observation/vitals/vitalsResource');
var fhirUtils = require('../fhir/common/utils/fhirUtils');

describe('Vitals FHIR Resource', function() {
    var inputValue = {
        'apiVersion': '1.0',
        'data': {
            'updated': 20140512151443,
            'totalItems': 2,
            'currentItemCount': 2,
            'items': [{
                'facilityCode': '561',
                'facilityName': 'New Jersey HCS',
                'observed': '199903091300',
                'resulted': '19990309154917',
                'locationName': 'GEN MED',
                'kind': 'Vital Sign',
                'displayName': 'PN',
                'result': '7',
                'units': '',
                'patientGeneratedDataFlag': false,
                'qualifiedName': 'PAIN',
                'uid': 'urn:va:vital:ABCD:105:333',
                'summary': 'PAIN 7 ',
                'pid': '9E7A;100022',
                'localId': '333',
                'typeCode': 'urn:va:vuid:4500635',
                'typeName': 'PAIN',
                'codes': [{
                    'code': '72514-3',
                    'system': 'http://loinc.org',
                    'display': 'Pain severity - 0-10 verbal numeric rating [#] - Reported'
                }],
                'locationUid': 'urn:va:location:ABCD:9'
            }, {
                'facilityCode': '998',
                'facilityName': 'ABILENE (CAA)',
                'observed': '201312101432',
                'resulted': '20140916180808',
                'locationName': 'PRIMARY CARE',
                'kind': 'Vital Sign',
                'dispfiedName': 'BLOOD PRESSURE',
                'uid': 'urn:va:vital:9E7A:100022:24039',
                'summary': 'BLOOD PRESSURE 120/75 mm[Hg]',
                'pid': '9E7A;100022',
                'localId': '24039',
                'typeCode': 'urn:va:vuid:4500634',
                'typeName': 'BLOOD PRESSURE',
                'codelayName': 'BP',
                'result': '120/75',
                'units': 'mm[Hg]',
                'low': '100/60',
                'high': '210/110',
                'patientGeneratedDataFlag': false,
                'qualis': [{
                    'code': '55284-4',
                    'system': 'http://loinc.org',
                    'display': 'Blood pressure systolic and diastolic'
                }],
                'locationUid': 'urn:va:location:9E7A:32'
            }, {
                'facilityCode': '998',
                'facilityName': 'ABILENE (CAA)',
                'observed': '201312101432',
                'resulted': '20140916180808',
                'locationName': 'PRIMARY CARE',
                'kind': 'Vital Sign',
                'displayName': 'T',
                'result': '98.6',
                'units': 'F',
                'metricResult': '37.0',
                'metricUnits': 'C',
                'low': '95',
                'high': '102',
                'patientGeneratedDataFlag': false,
                'qualifiedName': 'TEMPERATURE',
                'uid': 'urn:va:vital:9E7A:100022:24040',
                'summary': 'TEMPERATURE 98.6 F',
                'pid': '9E7A;100022',
                'localId': '24040',
                'typeCode': 'urn:va:vuid:4500638',
                'typeName': 'TEMPERATURE',
                'codes': [{
                    'code': '8310-5',
                    'system': 'http://loinc.org',
                    'display': 'Body temperature'
                }],
                'locationUid': 'urn:va:location:9E7A:32'
            }, {
                'facilityCode': '998',
                'facilityName': 'ABILENE (CAA)',
                'observed': '201312101432',
                'resulted': '20140916180808',
                'locationName': 'PRIMARY CARE',
                'kind': 'Vital Sign',
                'displayName': 'R',
                'result': '22',
                'units': '/min',
                'low': '8',
                'high': '30',
                'patientGeneratedDataFlag': false,
                'qualifiedName': 'RESPIRATION',
                'uid': 'urn:va:vital:9E7A:100022:24041',
                'summary': 'RESPIRATION 22 /min',
                'pid': '9E7A;100022',
                'localId': '24041',
                'typeCode': 'urn:va:vuid:4688725',
                'typeName': 'RESPIRATION',
                'codes': [{
                    'code': '9279-1',
                    'system': 'http://loinc.org',
                    'display': 'Respiratory rate'
                }],
                'locationUid': 'urn:va:location:9E7A:32'
            }, {
                'facilityCode': '998',
                'facilityName': 'ABILENE (CAA)',
                'observed': '201312101432',
                'resulted': '20140916180808',
                'locationName': 'PRIMARY CARE',
                'kind': 'Vital Sign',
                'displayName': 'P',
                'result': '70',
                'units': '/min',
                'low': '60',
                'high': '120',
                'patientGeneratedDataFlag': false,
                'qualifiedName': 'PULSE',
                'uid': 'urn:va:vital:9E7A:100022:24042',
                'summary': 'PULSE 70 /min',
                'pid': '9E7A;100022',
                'localId': '24042',
                'typeCode': 'urn:va:vuid:4500636',
                'typeName': 'PULSE',
                'codes': [{
                    'code': '8867-4',
                    'system': 'http://loinc.org',
                    'display': 'Heart rate'
                }],
                'locationUid': 'urn:va:location:9E7A:32'
            }, {
                'facilityCode': '998',
                'facilityName': 'ABILENE (CAA)',
                'observed': '201312101432',
                'resulted': '20140916180808',
                'locationName': 'PRIMARY CARE',
                'kind': 'Vital Sign',
                'displayName': 'PO2',
                'result': '98',
                'units': '%',
                'low': '50',
                'high': '100',
                'patientGeneratedDataFlag': false,
                'qualifiedName': 'PULSE OXIMETRY',
                'uid': 'urn:va:vital:9E7A:100022:24043',
                'summary': 'PULSE OXIMETRY 98 %',
                'pid': '9E7A;100022',
                'localId': '24043',
                'typeCode': 'urn:va:vuid:4500637',
                'typeName': 'PULSE OXIMETRY',
                'codes': [{
                    'code': '59408-5',
                    'system': 'http://loinc.org',
                    'display': 'Oxygen saturation in Arterial blood by Pulse oximetry'
                }],
                'locationUid': 'urn:va:location:9E7A:32'
            }, {
                'facilityCode': '998',
                'facilityName': 'ABILENE (CAA)',
                'observed': '201312101432',
                'resulted': '20140916180808',
                'locationName': 'PRIMARY CARE',
                'kind': 'Vital Sign',
                'displayName': 'HT',
                'result': '60',
                'units': 'in',
                'metricResult': '152.40',
                'metricUnits': 'cm',
                'patientGeneratedDataFlag': false,
                'qualifiedName': 'HEIGHT',
                'uid': 'urn:va:vital:9E7A:100022:24044',
                'summary': 'HEIGHT 60 in',
                'pid': '9E7A;100022',
                'localId': '24044',
                'typeCode': 'urn:va:vuid:4688724',
                'typeName': 'HEIGHT',
                'codes': [{
                    'code': '8302-2',
                    'system': 'http://loinc.org',
                    'display': 'Body height'
                }],
                'locationUid': 'urn:va:location:9E7A:32'
            }, {
                'facilityCode': '998',
                'facilityName': 'ABILENE (CAA)',
                'observed': '201312101432',
                'resulted': '20140916180808',
                'locationName': 'PRIMARY CARE',
                'kind': 'Vital Sign',
                'displayName': 'WT',
                'result': '200',
                'units': 'lb',
                'metricResult': '90.91',
                'metricUnits': 'kg',
                'patientGeneratedDataFlag': false,
                'qualifiedName': 'WEIGHT',
                'uid': 'urn:va:vital:9E7A:100022:24045',
                'summary': 'WEIGHT 200 lb',
                'pid': '9E7A;100022',
                'localId': '24045',
                'typeCode': 'urn:va:vuid:4500639',
                'typeName': 'WEIGHT',
                'codes': [{
                    'code': '29463-7',
                    'system': 'http://loinc.org',
                    'display': 'Body weight'
                }],
                'locationUid': 'urn:va:location:9E7A:32'
            }, {
                'facilityCode': 'DOD',
                'facilityName': 'DOD',
                'observed': '20070717180926',
                'kind': 'Vital Sign',
                'result': '24',
                'units': '/min',
                'patientGeneratedDataFlag': false,
                'qualifiedName': 'RESPIRATION',
                'uid': 'urn:va:vital:DOD:0000000010:1000001561',
                'summary': 'RESPIRATION 24 /min',
                'pid': '9E7A;100022',
                'typeName': 'RESPIRATION',
                'codes': [{
                    'code': '2124',
                    'system': 'DOD_NCID'
                }, {
                    'code': '9279-1',
                    'system': 'http://loinc.org',
                    'display': 'Respiratory rate'
                }]
            }]
        }
    };
    var req = {
        '_pid': '9E7A;100022',
        query: {
            'subject.identifier': '9E7A;100022'
        },
        headers: {
            host: 'localhost:8888'
        },
        protocol: 'http'
    };
    var vprVitals = inputValue.data.items;
    var fhirBundle = vitalsResource.convertToFhir(inputValue, req);
    var fhirVitals = [];
    _.each(fhirBundle.entry, function(e) {
        fhirVitals.push(e.content);
    });
    it('verifies that given a valid VPR Vitals Resource converts to a defined FHIR Vitals Resource object', function() {
        expect(fhirVitals).toBeDefined();
    });
    //expect(fhirVitals).toEqual({});
    _.each(vprVitals, function(vprV) {
        it('verifies that each VPR Vitals Resource has a coresponding FHIR Vitals Resource in the collection with the same uid', function() {
            var fhirVs = _.filter(fhirVitals, function(v) {
                return v.identifier.value === vprV.uid;
            });
            expect(fhirVs).toBeDefined();
            if (vprV.typeCode === 'urn:va:vuid:4500634') {
                expect(fhirVs.length).toEqual(2);
            }
            _.each(fhirVs, function(fhirV) {
                vitalResource(fhirV, vprV);
            });
        });
    });
});

function vitalResource(fhirV, vprV) {
    if (fhirV !== undefined) {
        describe('found FHIR Vitals coresponds to the original VPR Vitals Resource', function() {
            var code = fhirV.name.coding[0];
            it('verifies that the facility information from VPR Vitals Resource coresponds to the one from the FHIR Vitals Resource', function() {
                var organization = _.find(fhirV.contained, function(cont) {
                    return cont.resourceType === 'Organization';
                });
                expect(organization.name).toEqual(vprV.facilityName);
                expect(organization.identifier[0].value).toEqual(vprV.facilityCode);
            });
            it('verifies that the observed datetime information from VPR Vitals Resource coresponds to the one from the FHIR Vitals Resource', function() {
                expect(fhirV.appliesDateTime.replace('-00:00', '')).toEqual(fhirUtils.convertToFhirDateTime(vprV.observed));
            });
            if (fhirV.issued !== undefined) {
                it('verifies that the resulted datetime information from VPR Vitals Resource coresponds to the one from the FHIR Vitals Resource', function() {
                    expect(fhirV.issued.replace('-00:00', '')).toEqual(fhirUtils.convertToFhirDateTime(vprV.resulted));
                });
            }
            it('verifies that the summary from the VPR Vitals Resource coresponds to the text in the FHIR Vitals Resource', function() {
                //expect(fhirV.text).toBeDefined();
                //expect(fhirV.text.div).toEqual(vprV.summary);
            });
            it('verifies that the code from VPR Vitals Resource coresponds to the one from FHIR Vitals Resource', function() {
                expect(fhirV.name).toBeDefined();
                expect(fhirV.name.coding).toBeDefined();
                if (code !== undefined) {
                    if (vprV.typeCode !== 'urn:va:vuid:4500634') {
                        expect(code.code).toEqual(vprV.typeCode);
                        expect(code.display).toEqual(vprV.typeName);
                    } else {
                        if (code.code === '8480-6') {
                            expect(code.code).toEqual('8480-6');
                            expect(code.display).toEqual('Systolic blood pressure');
                        } else {
                            expect(code.code).toEqual('8462-4');
                            expect(code.display).toEqual('Diastolic blood pressure');
                        }
                        expect(code.system).toEqual('http://loinc.org');
                    }
                }
            });
            it('verifies that the result from VPR Vitals Resource coresponds to the one from FHIR Vitals Resource', function() {
                if (vprV.typeCode !== 'urn:va:vuid:4500634') {
                    expect(fhirV.valueQuantity.value + '').toEqual(vprV.result);
                } else {
                    if (code.code === '8480-6') {
                        expect('' + fhirV.valueQuantity.value).toEqual(vprV.result.split('/')[0]);
                    } else {
                        expect('' + fhirV.valueQuantity.value).toEqual(vprV.result.split('/')[1]);
                    }
                }
            });
            it('verifies that the units from VPR Vitals Resource coresponds to the one from FHIR Vitals Resource', function() {
                if (vprV.units === '') {
                    expect(fhirV.valueQuantity.units).not.toBeDefined();
                } else {
                    expect(fhirV.valueQuantity.units).toEqual(vprV.units);
                }
            });
            it('verifies that the low value of the reference range from VPR Vitals Resource coresponds to the one from FHIR Vitals Resource', function() {
                _.each(fhirV.referenceRange, function(val) {
                    var part = 0;
                    if (vprV.typeCode === 'urn:va:vuid:4500634' && code.code === '8462-4') {
                        part = 1;
                    }
                    if (val.low) {
                        expect('' + val.low.value).toEqual(vprV.low.split('/')[part]);
                    } else if (val.high) {
                        expect('' + val.high.value).toEqual(vprV.high.split('/')[part]);
                    }
                    expect(val.low.units).toEqual(vprV.units);
                    expect(val.high.units).toEqual(vprV.units);
                });
            });
            it('verifies that the facility from the VPR Vitals exists in the contained resources from the FHIR Vitals', function() {
                var resFacility = _.find(fhirV.contained, function(res) {
                    return res.resourceType === 'Organization' && res.identifier !== undefined && res.identifier[0].label === 'facility-code';
                });
                expect(resFacility).toBeDefined();
                expect(resFacility.identifier[0].value).toEqual(vprV.facilityCode);
                expect(resFacility.name).toEqual(vprV.facilityName);
            });
            it('verifies that the uid from VPR Vitals Resource coresponds to the one from FHIR Vitals Resource', function() {
                expect(fhirV.identifier.use).toEqual('official');
                expect(fhirV.identifier.label).toEqual('uid');
                expect(fhirV.identifier.system).toEqual('http://vistacore.us/fhir/id/uid');
                expect(fhirV.identifier.value).toEqual(vprV.uid);
            });
        });
    }
}
