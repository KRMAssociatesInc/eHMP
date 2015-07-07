'use strict';
//------------------------------------------------------------------------------------
// This contains a set of unit tests for record-enrichment-patient-xformer.js.
//
// Author: Les Westberg
//------------------------------------------------------------------------------------

require('../../../../env-setup');

var _ = require('underscore');

var xformer = require(global.VX_HANDLERS + 'record-enrichment-request/record-enrichment-patient-xformer');
var log = require(global.VX_UTILS + '/dummy-logger');
// NOTE: be sure next line is commented out before pushing
// log = require('bunyan').createLogger({
//     name: 'record-enrichment-patient-xformer-spec',
//     level: 'debug'
// });

var originalVaPatientRecord = {
    'address': [{
        'city': 'Any Town',
        'line1': 'Any Street',
        'state': 'WV',
        'use': 'H',
        'zip': 99998,
        'start': 20130101090807,
        'end': 20130101090807
    }],
    'admissionUid': 'urn:va:visit:9E7A:3:H4612',
    'alias': [{
        'fullName': 'P8'
    }],
    'birthDate': 19350407,
    'briefId': 'E0008',
    'contact': [{
        'name': 'VETERAN,BROTHER',
        'typeCode': 'urn:va:pat-contact:NOK',
        'typeName': 'Next of Kin',
        'address': [{
            'zip': '84111',
            'start': '20130101090807',
            'end': '20150101'
        }],
        'telecom': [{
            'use': 'H',
            'value': 8018011111
        }]
    }],
    'cwadf': 'CADF',
    'exposure': [{
        'name': 'No',
        'uid': 'urn:va:agent-orange:N',
        'vuid': '12345',
        'code': '100'
    }, {
        'name': 'No',
        'uid': 'urn:va:ionizing-radiation:N',
        'vuid': '54321',
        'code': '200'
    }],
    'facility': [{
        'code': 500,
        'earliestDate': 20010101,
        'latestDate': 20010101,
        'localPatientId': 3,
        'name': 'CAMP MASTER',
        'systemId': '9E7A'
    }, {
        'code': 998,
        'localPatientId': 3,
        'homeSite': true,
        'earliestDate': 20010101,
        'latestDate': 20010101,
        'name': 'ABILENE (CAA)',
        'systemId': 'C877'
    }],
    'familyName': 'EIGHT',
    'fullName': 'EIGHT,PATIENT',
    'genderCode': 'urn:va:pat-gender:M',
    'genderName': 'Male',
    'givenNames': 'PATIENT',
    'icn': '10108V420871',
    'inpatientLocation': '7A GEN MED',
    'localId': 3,
    'lrdfn': 27,
    'maritalStatusCode': 'urn:va:pat-maritalStatus:M',
    'maritalStatusName': 'Married',
    'patientRecordFlag': [{
        'approved': 'PROGRAMMER,EIGHT',
        'assignTS': 20141223160037,
        'assignmentStatus': 'Active',
        'category': 'II (LOCAL)',
        'name': 'WANDERER',
        'nextReviewDT': 20150221,
        'originatingSite': 'CAMP MASTER  ',
        'ownerSite': 'CAMP MASTER  ',
        'text': 'This patient likes to wander around the hospital.  Please notify the\r\nsecurity office',
        'type': 'OTHER'
    }],
    'pid': '9E7A;3',
    'religionCode': 'urn:va:pat-religion:99',
    'religionName': 'ROMAN CATHOLIC CHURCH',
    'roomBed': '722-B',
    'scPercent': 0,
    'sensitive': false,
    'serviceConnected': true,
    'shortInpatientLocation': '7A GM',
    'specialty': 'GENERAL MEDICINE',
    'specialtyService': 'M',
    'ssn': 666000008,
    'stampTime': '20150313063209',
    'teamInfo': {
        'associateProvider': {
            'name': 'unassigned'
        },
        'attendingProvider': {
            'analogPager': '',
            'digitalPager': '',
            'name': 'PROVIDER,THIRTY',
            'officePhone': '',
            'uid': 'urn:va:user:9E7A:1057'
        },
        'inpatientProvider': {
            'analogPager': '',
            'digitalPager': '',
            'name': 'PROVIDER,TWENTY',
            'officePhone': '',
            'uid': 'urn:va:user:9E7A:1005'
        },
        'mhCoordinator': {
            'mhPosition': 'unassigned',
            'mhTeam': 'unassigned',
            'name': 'unassigned'
        },
        'primaryProvider': {
            'name': 'unassigned'
        },
        'team': {
            'name': 'RED',
            'phone': '555-555-5551',
            'uid': 'urn:va:team:9E7A:3'
        },
        'text': '        Primary Care Team:  '
    },
    'telecom': [{
        'use': 'H',
        'value': '(222)555-8235'
    }],
    'uid': 'urn:va:patient:9E7A:3:3',
    'veteran': true,
    'insurance': [{
        'companyName': 'Acme Insurance',
        'effectiveDate': 20140901,
        'expirationDate': 20160830,
        'groupNumber': 11111,
        'id': 22222,
        'policyHolder': 'EIGHT,PATIENT',
        'policyType': 'someType'
    }],
    'scCondition': [{
        'scPercent': 50
    }],
    'deceased': '20150301',
    'lastUpdated': '20150301100000',
    'serviceConnectedPercent': 30,
    'race': [{
        'code': 100,
        'vuid': 200
    }],
    'ethnicity': [{
        'code': 300,
        'vuid': 400
    }],
    'language': [{
        'code': 500,
        'vuid': 600
    }],
    'disability': [{
        'name': 'blind'
    }]
};
var originalVaPatientJob = {
    record: originalVaPatientRecord
};

var originalDodPatientRecord = {
    'address': [{
        'city': 'Any Town',
        'line1': 'Any Street',
        'state': 'WV',
        'use': 'H',
        'zip': 99998,
        'start': 20130101090807,
        'end': 20130101090807
    }],
    'admissionUid': 'urn:va:visit:9E7A:3:H4612',
    'alias': [{
        'fullName': 'P8'
    }],
    'birthDate': 19350407,
    'briefId': 'E0008',
    'contact': [{
        'name': 'VETERAN,BROTHER',
        'typeCode': 'urn:va:pat-contact:NOK',
        'typeName': 'Next of Kin',
        'address': [{
            'zip': 84111,
            'start': 20130101090807,
            'end': 20150101
        }],
        'telecom': [{
            'use': 'H',
            'value': 8018011111
        }]
    }],
    'cwadf': 'CADF',
    'exposure': [{
        'name': 'No',
        'uid': 'urn:va:agent-orange:N',
        'vuid': 12345,
        'code': 100
    }, {
        'name': 'No',
        'uid': 'urn:va:ionizing-radiation:N',
        'vuid': 54321,
        'code': 200
    }],
    'facility': [{
        'code': 500,
        'earliestDate': 20010101,
        'latestDate': 20010101,
        'localPatientId': 3,
        'name': 'CAMP MASTER',
        'systemId': '9E7A'
    }, {
        'code': 998,
        'localPatientId': 3,
        'homeSite': true,
        'earliestDate': 20010101,
        'latestDate': 20010101,
        'name': 'ABILENE (CAA)',
        'systemId': 'C877'
    }],
    'familyName': 'EIGHT',
    'fullName': 'EIGHT,PATIENT',
    'genderCode': 'urn:va:pat-gender:M',
    'genderName': 'Male',
    'givenNames': 'PATIENT',
    'icn': '10108V420871',
    'inpatientLocation': '7A GEN MED',
    'localId': 3,
    'lrdfn': 27,
    'maritalStatusCode': 'urn:va:pat-maritalStatus:M',
    'maritalStatusName': 'Married',
    'patientRecordFlag': [{
        'approved': 'PROGRAMMER,EIGHT',
        'assignTS': 20141223160037,
        'assignmentStatus': 'Active',
        'category': 'II (LOCAL)',
        'name': 'WANDERER',
        'nextReviewDT': 20150221,
        'originatingSite': 'CAMP MASTER  ',
        'ownerSite': 'CAMP MASTER  ',
        'text': 'This patient likes to wander around the hospital.  Please notify the\r\nsecurity office',
        'type': 'OTHER'
    }],
    'pid': 'DOD;0000000003',
    'religionCode': 'urn:va:pat-religion:99',
    'religionName': 'ROMAN CATHOLIC CHURCH',
    'roomBed': '722-B',
    'scPercent': 0,
    'sensitive': false,
    'serviceConnected': true,
    'shortInpatientLocation': '7A GM',
    'specialty': 'GENERAL MEDICINE',
    'specialtyService': 'M',
    'ssn': 666000008,
    'stampTime': '20150313063209',
    'teamInfo': {
        'associateProvider': {
            'name': 'unassigned'
        },
        'attendingProvider': {
            'analogPager': '',
            'digitalPager': '',
            'name': 'PROVIDER,THIRTY',
            'officePhone': '',
            'uid': 'urn:va:user:9E7A:1057'
        },
        'inpatientProvider': {
            'analogPager': '',
            'digitalPager': '',
            'name': 'PROVIDER,TWENTY',
            'officePhone': '',
            'uid': 'urn:va:user:9E7A:1005'
        },
        'mhCoordinator': {
            'mhPosition': 'unassigned',
            'mhTeam': 'unassigned',
            'name': 'unassigned'
        },
        'primaryProvider': {
            'name': 'unassigned'
        },
        'team': {
            'name': 'RED',
            'phone': '555-555-5551',
            'uid': 'urn:va:team:9E7A:3'
        },
        'text': '        Primary Care Team:  '
    },
    'telecom': [{
        'use': 'H',
        'value': '(222)555-8235'
    }],
    'uid': 'urn:va:patient:DOD:0000000003:0000000003',
    'veteran': true,
    'insurance': [{
        'companyName': 'Acme Insurance',
        'effectiveDate': 20140901,
        'expirationDate': 20160830,
        'groupNumber': 11111,
        'id': 22222,
        'policyHolder': 'EIGHT,PATIENT',
        'policyType': 'someType'
    }],
    'scCondition': [{
        'scPercent': 50
    }],
    'deceased': '20150301',
    'lastUpdated': '20150301100000',
    'serviceConnectedPercent': 30,
    'race': [{
        'code': 100,
        'vuid': 200
    }],
    'ethnicity': [{
        'code': 300,
        'vuid': 400
    }],
    'language': [{
        'code': 500,
        'vuid': 600
    }],
    'disability': [{
        'name': 'blind'
    }]
};
var originalDodPatientJob = {
    record: originalDodPatientRecord
};

var removedRecord = {
    'pid': 'DOD;0000000003',
    'stampTime': '20150226124943',
    'removed': true,
    'uid': 'urn:va:patient:DOD:0000000003:1000010340'
};

var removedJob = {
    record: removedRecord
};

var config = {};

describe('record-enrichment-patient-xformer.js', function() {
    describe('transformAndEnrichRecord()', function() {
        it('Happy Path with VA Patient', function() {
            var finished = false;
            var environment = {};

            runs(function() {
                xformer(log, config, environment, originalVaPatientJob, function(error, record) {
                    expect(error).toBeNull();
                    expect(record).toBeTruthy();

                    // Root level fields
                    //------------------
                    expect(record.homeFacility).toBeTruthy();
                    expect(record.homeFacility).toBe(originalVaPatientRecord.facility[1]);
                    expect(record.last4).toBe('0008');
                    expect(record.last5).toBe('E0008');
                    expect(record.displayName).toBe('Eight,Patient');
                    expect(typeof record.stampTime).toEqual('string');
                    expect(typeof record.birthDate).toEqual('string');
                    expect(typeof record.deceased).toEqual('string');
                    expect(typeof record.lastUpdated).toEqual('string');
                    expect(typeof record.localId).toEqual('string');
                    expect(typeof record.lrdfn).toEqual('string');
                    expect(typeof record.ssn).toEqual('string');
                    expect(typeof record.last4).toEqual('string');
                    expect(typeof record.last5).toEqual('string');
                    expect(typeof record.scPercent).toEqual('string');
                    expect(typeof record.serviceConnectedPercent).toEqual('string');

                    //  Insurance Fields
                    //------------------
                    expect(_.isEmpty(record.insurance)).toBe(false);
                    _.each(record.insurance, function(insurance) {
                        expect(insurance.summary).toEqual('Acme Insurance (someType)');
                        expect(typeof insurance.effectiveDate).toEqual('string');
                        expect(typeof insurance.expirationDate).toEqual('string');
                        expect(typeof insurance.groupNumber).toEqual('string');
                        expect(typeof insurance.id).toEqual('string');
                        expect(typeof insurance.policyHolder).toEqual('string');
                        expect(typeof insurance.policyType).toEqual('string');
                    });

                    // ScCondition Fields
                    //-------------------
                    expect(_.isEmpty(record.scCondition)).toBe(false);
                    _.each(record.scCondition, function(scCondition) {
                        expect(scCondition.summary).toEqual('ServiceConnectedCondition{uid=\'\'}');
                        expect(typeof scCondition.scPercent).toEqual('string');
                    });

                    // Contact Fields
                    //-------------------
                    expect(_.isEmpty(record.contact)).toBe(false);
                    _.each(record.contact, function(contact) {
                        expect(contact.summary).toEqual(contact.name);
                        expect(typeof contact.typeCode).toEqual('string');
                        expect(typeof contact.typeName).toEqual('string');
                        _.each(contact.address, function(contactAddress) {
                            expect(contactAddress.summary).toEqual('Address{uid=\'\'}');
                            expect(typeof contactAddress.zip).toEqual('string');
                            expect(typeof contactAddress.start).toEqual('string');
                            expect(typeof contactAddress.end).toEqual('string');
                        });
                        _.each(contact.telecom, function(contactTelecom) {
                            expect(contactTelecom.summary).toEqual('Telecom{uid=\'\'}');
                            expect(typeof contactTelecom.use).toEqual('string');
                            expect(typeof contactTelecom.value).toEqual('string');
                        });
                    });

                    // Exposure Fields
                    //----------------
                    expect(_.isEmpty(record.exposure)).toBe(false);
                    _.each(record.exposure, function(exposure) {
                        expect(exposure.summary).toEqual('PatientExposure{uid=\'' + exposure.uid + '\'}');
                        expect(typeof exposure.code).toEqual('string');
                        expect(typeof exposure.vuid).toEqual('string');
                    });

                    // Race Fields
                    //----------------
                    expect(_.isEmpty(record.race)).toBe(false);
                    _.each(record.race, function(race) {
                        expect(race.summary).toEqual('PatientRace{uid=\'\'}');
                        expect(typeof race.code).toEqual('string');
                        expect(typeof race.vuid).toEqual('string');
                    });

                    // Ethnicity Fields
                    //------------------
                    expect(_.isEmpty(record.ethnicity)).toBe(false);
                    _.each(record.ethnicity, function(ethnicity) {
                        expect(ethnicity.summary).toEqual('PatientEthnicity{uid=\'\'}');
                        expect(typeof ethnicity.code).toEqual('string');
                        expect(typeof ethnicity.vuid).toEqual('string');
                    });

                    // Language Fields
                    //----------------
                    expect(_.isEmpty(record.language)).toBe(false);
                    _.each(record.language, function(language) {
                        expect(language.summary).toEqual('PatientLanguage{uid=\'\'}');
                        expect(typeof language.code).toEqual('string');
                        expect(typeof language.vuid).toEqual('string');
                    });

                    // Telecom Fields
                    //----------------
                    expect(_.isEmpty(record.telecom)).toBe(false);
                    _.each(record.telecom, function(telecom) {
                        expect(telecom.summary).toEqual('Telecom{uid=\'\'}');
                        expect(typeof telecom.use).toEqual('string');
                        expect(typeof telecom.value).toEqual('string');
                    });

                    // PatientRecordFlag Fields
                    //--------------------------
                    expect(_.isEmpty(record.patientRecordFlag)).toBe(false);
                    _.each(record.patientRecordFlag, function(patientRecordFlag) {
                        expect(patientRecordFlag.summary).toEqual('PatientRecordFlag{uid=\'\'}');
                        expect(typeof patientRecordFlag.nextReviewDT).toEqual('string');
                        expect(typeof patientRecordFlag.assignTS).toEqual('string');
                    });

                    // Facility Fields
                    //----------------
                    expect(_.isEmpty(record.facility)).toBe(false);
                    _.each(record.facility, function(facility) {
                        expect(facility.summary).toEqual(facility.name);
                        expect(((facility.homeSite === true) || (facility.homeSite === false))).toBe(true); // Must be either true or false.  (never undefined or null)
                        expect(typeof facility.code).toEqual('string');
                        expect(typeof facility.systemId).toEqual('string');
                        expect(typeof facility.localPatientId).toEqual('string');
                        expect(typeof facility.earliestDate).toEqual('string');
                        expect(typeof facility.latestDate).toEqual('string');
                    });

                    // Disability Fields
                    //------------------
                    expect(_.isEmpty(record.disability)).toBe(false);
                    _.each(record.disability, function(disability) {
                        expect(disability.summary).toEqual('PatientDisability{uid=\'\'}');
                    });

                    // Address Fields
                    //----------------
                    expect(_.isEmpty(record.address)).toBe(false);
                    _.each(record.address, function(address) {
                        expect(address.summary).toEqual('Address{uid=\'\'}');
                        expect(typeof address.zip).toEqual('string');
                        expect(typeof address.start).toEqual('string');
                        expect(typeof address.end).toEqual('string');
                    });

                    // Alias Fields
                    //------------------
                    expect(_.isEmpty(record.alias)).toBe(false);
                    _.each(record.alias, function(alias) {
                        expect(alias.summary).toEqual('Alias{uid=\'\'}');
                    });

                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            }, 'Call failed to return in time.', 500);
        });
        it('Happy Path with Dod Patient', function() {
            var finished = false;
            var environment = {};

            runs(function() {
                xformer(log, config, environment, originalDodPatientJob, function(error, record) {
                    expect(error).toBeNull();
                    expect(record).toBeTruthy();
                    // Root level fields
                    //------------------
                    expect(record.homeFacility).toBeTruthy();
                    expect(record.homeFacility).toBe(originalDodPatientRecord.facility[1]);
                    expect(record.last4).toBe('0008');
                    expect(record.last5).toBe('E0008');
                    expect(record.displayName).toBe('Eight,Patient');
                    expect(typeof record.stampTime).toEqual('string');
                    expect(typeof record.birthDate).toEqual('string');
                    expect(typeof record.deceased).toEqual('string');
                    expect(typeof record.lastUpdated).toEqual('string');
                    expect(typeof record.localId).toEqual('string');
                    expect(typeof record.lrdfn).toEqual('string');
                    expect(typeof record.ssn).toEqual('string');
                    expect(typeof record.last4).toEqual('string');
                    expect(typeof record.last5).toEqual('string');
                    expect(typeof record.scPercent).toEqual('string');
                    expect(typeof record.serviceConnectedPercent).toEqual('string');

                    //  Insurance Fields
                    //------------------
                    expect(_.isEmpty(record.insurance)).toBe(false);
                    _.each(record.insurance, function(insurance) {
                        expect(insurance.summary).toEqual('Acme Insurance (someType)');
                        expect(typeof insurance.effectiveDate).toEqual('string');
                        expect(typeof insurance.expirationDate).toEqual('string');
                        expect(typeof insurance.groupNumber).toEqual('string');
                        expect(typeof insurance.id).toEqual('string');
                        expect(typeof insurance.policyHolder).toEqual('string');
                        expect(typeof insurance.policyType).toEqual('string');
                    });

                    // ScCondition Fields
                    //-------------------
                    expect(_.isEmpty(record.scCondition)).toBe(false);
                    _.each(record.scCondition, function(scCondition) {
                        expect(scCondition.summary).toEqual('ServiceConnectedCondition{uid=\'\'}');
                        expect(typeof scCondition.scPercent).toEqual('string');
                    });

                    // Contact Fields
                    //-------------------
                    expect(_.isEmpty(record.contact)).toBe(false);
                    _.each(record.contact, function(contact) {
                        expect(contact.summary).toEqual(contact.name);
                        expect(typeof contact.typeCode).toEqual('string');
                        expect(typeof contact.typeName).toEqual('string');
                        _.each(contact.address, function(contactAddress) {
                            expect(contactAddress.summary).toEqual('Address{uid=\'\'}');
                            expect(typeof contactAddress.zip).toEqual('string');
                            expect(typeof contactAddress.start).toEqual('string');
                            expect(typeof contactAddress.end).toEqual('string');
                        });
                        _.each(contact.telecom, function(contactTelecom) {
                            expect(contactTelecom.summary).toEqual('Telecom{uid=\'\'}');
                            expect(typeof contactTelecom.use).toEqual('string');
                            expect(typeof contactTelecom.value).toEqual('string');
                        });
                    });

                    // Exposure Fields
                    //----------------
                    expect(_.isEmpty(record.exposure)).toBe(false);
                    _.each(record.exposure, function(exposure) {
                        expect(exposure.summary).toEqual('PatientExposure{uid=\'' + exposure.uid + '\'}');
                        expect(typeof exposure.code).toEqual('string');
                        expect(typeof exposure.vuid).toEqual('string');
                    });

                    // Race Fields
                    //----------------
                    expect(_.isEmpty(record.race)).toBe(false);
                    _.each(record.race, function(race) {
                        expect(race.summary).toEqual('PatientRace{uid=\'\'}');
                        expect(typeof race.code).toEqual('string');
                        expect(typeof race.vuid).toEqual('string');
                    });

                    // Ethnicity Fields
                    //------------------
                    expect(_.isEmpty(record.ethnicity)).toBe(false);
                    _.each(record.ethnicity, function(ethnicity) {
                        expect(ethnicity.summary).toEqual('PatientEthnicity{uid=\'\'}');
                        expect(typeof ethnicity.code).toEqual('string');
                        expect(typeof ethnicity.vuid).toEqual('string');
                    });

                    // Language Fields
                    //----------------
                    expect(_.isEmpty(record.language)).toBe(false);
                    _.each(record.language, function(language) {
                        expect(language.summary).toEqual('PatientLanguage{uid=\'\'}');
                        expect(typeof language.code).toEqual('string');
                        expect(typeof language.vuid).toEqual('string');
                    });

                    // Telecom Fields
                    //----------------
                    expect(_.isEmpty(record.telecom)).toBe(false);
                    _.each(record.telecom, function(telecom) {
                        expect(telecom.summary).toEqual('Telecom{uid=\'\'}');
                        expect(typeof telecom.use).toEqual('string');
                        expect(typeof telecom.value).toEqual('string');
                    });

                    // PatientRecordFlag Fields
                    //--------------------------
                    expect(_.isEmpty(record.patientRecordFlag)).toBe(false);
                    _.each(record.patientRecordFlag, function(patientRecordFlag) {
                        expect(patientRecordFlag.summary).toEqual('PatientRecordFlag{uid=\'\'}');
                        expect(typeof patientRecordFlag.nextReviewDT).toEqual('string');
                        expect(typeof patientRecordFlag.assignTS).toEqual('string');
                    });

                    // Facility Fields
                    //----------------
                    expect(_.isEmpty(record.facility)).toBe(false);
                    _.each(record.facility, function(facility) {
                        expect(facility.summary).toEqual(facility.name);
                        expect(((facility.homeSite === true) || (facility.homeSite === false))).toBe(true); // Must be either true or false.  (never undefined or null)
                        expect(typeof facility.code).toEqual('string');
                        expect(typeof facility.systemId).toEqual('string');
                        expect(typeof facility.localPatientId).toEqual('string');
                        expect(typeof facility.earliestDate).toEqual('string');
                        expect(typeof facility.latestDate).toEqual('string');
                    });

                    // Disability Fields
                    //------------------
                    expect(_.isEmpty(record.disability)).toBe(false);
                    _.each(record.disability, function(disability) {
                        expect(disability.summary).toEqual('PatientDisability{uid=\'\'}');
                    });

                    // Address Fields
                    //----------------
                    expect(_.isEmpty(record.address)).toBe(false);
                    _.each(record.address, function(address) {
                        expect(address.summary).toEqual('Address{uid=\'\'}');
                        expect(typeof address.zip).toEqual('string');
                        expect(typeof address.start).toEqual('string');
                        expect(typeof address.end).toEqual('string');
                    });

                    // Alias Fields
                    //------------------
                    expect(_.isEmpty(record.alias)).toBe(false);
                    _.each(record.alias, function(alias) {
                        expect(alias.summary).toEqual('Alias{uid=\'\'}');
                    });

                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            }, 'Call failed to return in time.', 500);
        });
        it('Job was null', function() {
            var finished = false;
            var environment = {};

            runs(function() {
                xformer(log, config, environment, null, function(error, record) {
                    expect(error).toBeNull();
                    expect(record).toBeNull();
                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            }, 'Call failed to return in time.', 500);
        });
        it('Job.record was null', function() {
            var finished = false;
            var environment = {};

            runs(function() {
                xformer(log, config, environment, {}, function(error, record) {
                    expect(error).toBeNull();
                    expect(record).toBeNull();
                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            }, 'Call failed to return in time.', 500);
        });
        it('Job was removed', function() {
            var finished = false;
            var environment = {};

            runs(function() {
                xformer(log, config, environment, removedJob, function(error, record) {
                    expect(error).toBeNull();
                    expect(record).toBeTruthy();
                    expect(record.uid).toEqual('urn:va:patient:DOD:0000000003:1000010340');
                    expect(record.pid).toEqual('DOD;0000000003');
                    expect(record.stampTime).toEqual('20150226124943');
                    expect(record.removed).toEqual(true);
                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            }, 'Call failed to return in time.', 500);
        });
    });
});