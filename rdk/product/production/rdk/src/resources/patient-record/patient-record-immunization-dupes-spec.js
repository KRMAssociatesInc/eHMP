/*jslint node: true*/
'use strict';

var PatientImmunizationDupes = require('./patient-record-immunization-dupes');

describe('Verify duplicates are removed', function() {
    it('Correct immunization records are obtained with no duplication', function() {
        var resultSets = [
            {
                "administeredDateTime": "20131204103149",
                "codes": [
                    {
                        "code": "141",
                        "display": "Influenza, seasonal, injectable",
                        "system": "urn:oid:2.16.840.1.113883.12.292"
                    }
                ],
                "comment": "No Comment",
                "contraindicated": false,
                "cptCode": "urn:cpt:90658",
                "cptName": "FLU VACCINE 3 YRS & > IM",
                "encounterName": "PRIMARY CARE Dec 04, 2013",
                "encounterUid": "urn:va:visit:DOD:433:9329",
                "facilityCode": "DOD",
                "facilityName": "Department of Defense",
                "kind": "Immunization",
                "lastUpdateTime": "20131204103149",
                "localId": "432",
                "locationName": "PRIMARY CARE",
                "locationUid": "urn:va:location:DOD:32",
                "name": "INFLUENZA, UNSPECIFIED FORMULATION (HISTORICAL)",
                "performerName": "PROGRAMMER,ONE",
                "performerUid": "urn:va:user:DOD:1",
                "pid": "9E7A;433",
                "stampTime": "20131204103149",
                "summary": "INFLUENZA, UNSPECIFIED FORMULATION (HISTORICAL)",
                "uid": "urn:va:immunization:DOD:433:432",
                "uidHref": "http://localhost:8888/resource/patient/record/uid?pid=9E7A%3B433&uid=urn%3Ava%3Aimmunization%3A9E7A%3A433%3A432",
                "facilityDisplay": "Department of Defense",
                "facilityMoniker": "DOD"
            },
            {
                "administeredDateTime": "20131204103149",
                "codes": [
                    {
                        "code": "141",
                        "display": "Influenza, seasonal, injectable",
                        "system": "urn:oid:2.16.840.1.113883.12.292"
                    }
                ],
                "comment": "No Comment",
                "contraindicated": false,
                "cptCode": "urn:cpt:90658",
                "cptName": "FLU VACCINE 3 YRS & > IM",
                "encounterName": "PRIMARY CARE Dec 04, 2013",
                "encounterUid": "urn:va:visit:9E7A:433:9329",
                "facilityCode": "500",
                "facilityName": "CAMP MASTER",
                "kind": "Immunization",
                "lastUpdateTime": "20131204103149",
                "localId": "432",
                "locationName": "PRIMARY CARE",
                "locationUid": "urn:va:location:9E7A:32",
                "name": "INFLUENZA, UNSPECIFIED FORMULATION (HISTORICAL)",
                "performerName": "PROGRAMMER,ONE",
                "performerUid": "urn:va:user:9E7A:1",
                "pid": "9E7A;433",
                "stampTime": "20131204103149",
                "summary": "INFLUENZA, UNSPECIFIED FORMULATION (HISTORICAL)",
                "uid": "urn:va:immunization:9E7A:433:432",
                "uidHref": "http://localhost:8888/resource/patient/record/uid?pid=9E7A%3B433&uid=urn%3Ava%3Aimmunization%3A9E7A%3A433%3A432",
                "facilityDisplay": "Camp Master",
                "facilityMoniker": "TST1"
            },
            {
                "administeredDateTime": "20131204103114",
                "codes": [
                    {
                        "code": "141",
                        "display": "Influenza, seasonal, injectable",
                        "system": "urn:oid:2.16.840.1.113883.12.292"
                    }
                ],
                "comment": "No Comment",
                "contraindicated": false,
                "cptCode": "urn:cpt:90658",
                "cptName": "FLU VACCINE 3 YRS & > IM",
                "encounterName": "PRIMARY CARE Dec 04, 2013",
                "encounterUid": "urn:va:visit:9E7A:433:9327",
                "facilityCode": "500",
                "facilityName": "CAMP MASTER",
                "kind": "Immunization",
                "lastUpdateTime": "20131204103114",
                "localId": "431",
                "locationName": "PRIMARY CARE",
                "locationUid": "urn:va:location:9E7A:32",
                "name": "INFLUENZA, UNSPECIFIED FORMULATION (HISTORICAL)",
                "performerName": "PROGRAMMER,ONE",
                "performerUid": "urn:va:user:9E7A:1",
                "pid": "9E7A;433",
                "stampTime": "20131204103114",
                "summary": "INFLUENZA, UNSPECIFIED FORMULATION (HISTORICAL)",
                "uid": "urn:va:immunization:9E7A:433:431",
                "uidHref": "http://localhost:8888/resource/patient/record/uid?pid=9E7A%3B433&uid=urn%3Ava%3Aimmunization%3A9E7A%3A433%3A431",
                "facilityDisplay": "CAMP MASTER",
                "facilityMoniker": "TST1"
            },
            {
                "administeredDateTime": "20131204103114",
                "codes": [
                    {
                        "code": "141",
                        "display": "Influenza, seasonal, injectable",
                        "system": "urn:oid:2.16.840.1.113883.12.292"
                    }
                ],
                "comment": "No Comment",
                "contraindicated": false,
                "cptCode": "urn:cpt:90658",
                "cptName": "FLU VACCINE 3 YRS & > IM",
                "encounterName": "PRIMARY CARE Dec 04, 2013",
                "encounterUid": "urn:va:visit:C877:433:9327",
                "facilityCode": "500",
                "facilityName": "CAMP BEE",
                "kind": "Immunization",
                "lastUpdateTime": "20131204103114",
                "localId": "431",
                "locationName": "PRIMARY CARE",
                "locationUid": "urn:va:location:C877:32",
                "name": "INFLUENZA, UNSPECIFIED FORMULATION (HISTORICAL)",
                "performerName": "PROGRAMMER,ONE",
                "performerUid": "urn:va:user:C877:1",
                "pid": "C877;433",
                "stampTime": "20131204103114",
                "summary": "INFLUENZA, UNSPECIFIED FORMULATION (HISTORICAL)",
                "uid": "urn:va:immunization:C877:433:431",
                "uidHref": "http://localhost:8888/resource/patient/record/uid?pid=C877%3B433&uid=urn%3Ava%3Aimmunization%3AC877%3A433%3A431",
                "facilityDisplay": "Camp Bee",
                "facilityMoniker": "TST2"
            },
            {
                "administeredDateTime": "20000404105506",
                "codes": [
                    {
                        "code": "33",
                        "display": "pneumococcal polysaccharide vaccine, 23 valent",
                        "system": "urn:oid:2.16.840.1.113883.12.292"
                    }
                ],
                "contraindicated": false,
                "cptCode": "urn:cpt:90732",
                "cptName": "PNEUMOCOCCAL VACCINE",
                "encounterName": "AUDIOLOGY Apr 04, 2000",
                "encounterUid": "urn:va:visit:ABCD:229:1975",
                "facilityCode": "561",
                "facilityName": "New Jersey HCS",
                "kind": "Immunization",
                "localId": "44",
                "locationName": "AUDIOLOGY",
                "locationUid": "urn:va:location:ABCD:64",
                "name": "PNEUMOCOCCAL",
                "performerName": "WARDCLERK,SIXTYEIGHT",
                "performerUid": "urn:va:user:ABCD:11278",
                "pid": "HDR;10180V273016",
                "stampTime": "20150724130452",
                "summary": "PNEUMOCOCCAL",
                "uid": "urn:va:immunization:ABCD:229:44",
                "uidHref": "http://localhost:8888/resource/patient/record/uid?pid=HDR%3B10180V273016&uid=urn%3Ava%3Aimmunization%3AABCD%3A229%3A44",
                "facilityDisplay": "New Jersey HCS",
                "facilityMoniker": "NJS"
            }
        ];

        var expectedOutput = [
            {
                "administeredDateTime": "20131204103149",
                "codes": [
                    {
                        "code": "141",
                        "display": "Influenza, seasonal, injectable",
                        "system": "urn:oid:2.16.840.1.113883.12.292"
                    }
                ],
                "comment": "No Comment",
                "contraindicated": false,
                "cptCode": "urn:cpt:90658",
                "cptName": "FLU VACCINE 3 YRS & > IM",
                "encounterName": "PRIMARY CARE Dec 04, 2013",
                "kind": "Immunization",
                "lastUpdateTime": "20131204103149",
                "localId": "432",
                "locationName": "PRIMARY CARE",
                "locationUid": "urn:va:location:DOD:32",
                "name": "INFLUENZA, UNSPECIFIED FORMULATION (HISTORICAL)",
                "performerName": "PROGRAMMER,ONE",
                "performerUid": "urn:va:user:DOD:1",
                "pid": "9E7A;433",
                "stampTime": "20131204103149",
                "summary": "INFLUENZA, UNSPECIFIED FORMULATION (HISTORICAL)",
                "uid": "urn:va:immunization:DOD:433:432",
                "administeredDate": "20131204",
                "uidHref": "http://localhost:8888/resource/patient/record/uid?pid=9E7A%3B433&uid=urn%3Ava%3Aimmunization%3A9E7A%3A433%3A432",
                "encounterUid": "urn:va:visit:DOD:433:9329",
                "facilityCode": "DOD",
                "facilityDisplay": "Department of Defense",
                "facilityMoniker": "DOD",
                "facilityName": "Department of Defense"
            },
            {
                "administeredDateTime": "20000404105506",
                "codes": [
                    {
                        "code": "33",
                        "display": "pneumococcal polysaccharide vaccine, 23 valent",
                        "system": "urn:oid:2.16.840.1.113883.12.292"
                    }
                ],
                "contraindicated": false,
                "cptCode": "urn:cpt:90732",
                "cptName": "PNEUMOCOCCAL VACCINE",
                "encounterName": "AUDIOLOGY Apr 04, 2000",
                "encounterUid": "urn:va:visit:ABCD:229:1975",
                "facilityCode": "561",
                "facilityName": "New Jersey HCS",
                "kind": "Immunization",
                "localId": "44",
                "locationName": "AUDIOLOGY",
                "locationUid": "urn:va:location:ABCD:64",
                "name": "PNEUMOCOCCAL",
                "performerName": "WARDCLERK,SIXTYEIGHT",
                "performerUid": "urn:va:user:ABCD:11278",
                "pid": "HDR;10180V273016",
                "stampTime": "20150724130452",
                "summary": "PNEUMOCOCCAL",
                "uid": "urn:va:immunization:ABCD:229:44",
                "administeredDate": "20000404",
                "uidHref": "http://localhost:8888/resource/patient/record/uid?pid=HDR%3B10180V273016&uid=urn%3Ava%3Aimmunization%3AABCD%3A229%3A44",
                "facilityDisplay": "New Jersey HCS",
                "facilityMoniker": "NJS"
            }
        ];
        var vistaSites =
        { C877:
            {   name: 'KODAK',
                division: '500',
                host: '10.2.2.102',
                localIP: '10.2.2.1',
                localAddress: 'localhost',
                port: 9210,
                production: false,
                accessCode: 'ep1234',
                verifyCode: 'ep1234!!',
                infoButtonOid: '1.3.6.1.4.1.3768' },
            '9E7A':
            {   name: 'PANORAMA',
                division: '500',
                host: '10.2.2.101',
                localIP: '10.2.2.1',
                localAddress: 'localhost',
                port: 9210,
                production: false,
                accessCode: 'ep1234',
                verifyCode: 'ep1234!!',
                infoButtonOid: '1.3.6.1.4.1.3768' }
        };
        var actualOutput = PatientImmunizationDupes.removeDuplicateImmunizations(vistaSites, resultSets);

        expect(actualOutput).to.eql(expectedOutput);
    });

});
