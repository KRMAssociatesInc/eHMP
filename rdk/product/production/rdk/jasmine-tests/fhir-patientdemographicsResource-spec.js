/*jslint node: true */
'use strict';

var _ = require('underscore');
var patientResource = require('../fhir/patientdemographics/patientdemographicsResource');

describe('Patient FHIR Resource', function() {
    var inputValue = {
        'apiVersion': '1.0',
        'data': {
            'updated': 20140923110302,
            'totalItems': 1,
            'currentItemCount': 1,
            'items': [{
                'admissionUid': 'urn:va:visit:C877:100022:H3419',
                'birthDate': '19350407',
                'briefId': 'B0008',
                'cwadf': 'A',
                'displayName': 'Bcma,Eight',
                'domainUpdated': 'meds, vitals, documents, orders, visits, factors, labs, allergies',
                'exposure': [{
                    'name': 'No',
                    'uid': 'urn:va:sw-asia:N'
                }, {
                    'name': 'Unknown',
                    'uid': 'urn:va:head-neck-cancer:U'
                }, {
                    'name': 'No',
                    'uid': 'urn:va:ionizing-radiation:N'
                }, {
                    'name': 'Unknown',
                    'uid': 'urn:va:mst:U'
                }, {
                    'name': 'No',
                    'uid': 'urn:va:combat-vet:N'
                }, {
                    'name': 'No',
                    'uid': 'urn:va:agent-orange:N'
                }],
                'facility': [{
                    'code': '500',
                    'homeSite': false,
                    'latestDate': '20020415',
                    'localPatientId': '100022',
                    'name': 'CAMP BEE',
                    'summary': 'CAMP BEE',
                    'systemId': 'C877'
                }],
                'familyName': 'BCMA',
                'fullName': 'BCMA,EIGHT',
                'genderCode': 'urn:va:pat-gender:M',
                'genderName': 'Male',
                'givenNames': 'EIGHT',
                'inpatientLocation': 'BCMA',
                'last4': '0008',
                'last5': 'B0008',
                'lastUpdated': '20140923023950.729',
                'localId': '100022',
                'lrdfn': '418',
                'pid': 'C877;100022',
                'roomBed': '2-C',
                'sensitive': false,
                'serviceConnected': false,
                'shortInpatientLocation': 'BCMA',
                'specialty': 'GENERAL MEDICINE',
                'specialtyService': 'M',
                'ssn': '666330008',
                'summary': 'gov.va.cpe.vpr.PatientDemographics{pids=[500;100022, 666330008, C877;100022]}',
                'syncErrorCount': 0,
                'teamInfo': {
                    'associateProvider': {
                        'name': 'unassigned'
                    },
                    'attendingProvider': {
                        'analogPager': '',
                        'digitalPager': '',
                        'name': 'RADTECH,THIRTYNINE',
                        'officePhone': '',
                        'uid': 'urn:va:user:C877:11815'
                    },
                    'inpatientProvider': {
                        'name': 'unassigned'
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
                        'name': 'unassigned'
                    },
                    'text': 'No Primary Care Team Assigned.\r\n \r\nNo Primary Care Provider Assigned.\r\n \r\nNo Associate Provider Assigned.\r\n \r\n      Attending Physician:  RADTECH,THIRTYNINE\r\n             Analog Pager:  \r\n            Digital Pager:  \r\n   Office Phone:  \r\n \r\nNo Inpatient Provider Assigned.\r\n \r\n'
                },
                'uid': 'urn:va:patient:C877:100022:100022',
                'veteran': true
            }]
        }
    };

    var vprPatient = inputValue.data.items[0];

    var fhirPatient = patientResource.convertToFhir(inputValue);

    it('verifies that given a valid VPR Patient Resource converts to a defined FHIR Patient Resource object', function() {
        expect(fhirPatient).toBeDefined();
    });

    it('verifies that the name from the VPR Patient Resource coresponds to the name from the FHIR Patient Resource', function() {
        expect(fhirPatient.name).toBeDefined();
        expect(fhirPatient.name[0].family).toEqual([vprPatient.familyName]);
        expect(fhirPatient.name[0].given).toEqual([vprPatient.givenNames]);
        expect(fhirPatient.name[0].text).toEqual(vprPatient.fullName);

    });

    it('verifies that the telecoms from the VPR Patient Resource corespond to those from the FHIR Patient Resource', function() {
        var telecomUsageCodes = {
            'work': 'WP',
            'home': 'H'
        };
        if (vprPatient.telecoms !== undefined) {
            _.each(vprPatient.telecoms, function(vprTelecom) {
                var fhirTelecom = _.find(fhirPatient.telecom, function(t) {
                    return telecomUsageCodes[t.use] === vprTelecom.usageCode && t.value === vprTelecom.telecom;
                });
                expect(fhirTelecom).toBeDefined();
            });
        }
    });

    it('verifies that the gender from the VPR Patient Resource coresponds to the gender from the FHIR Patient Resource', function() {
        var genderCodes = {
            M: 'urn:va:pat-gender:M',
            F: 'urn:va:pat-gender:F',
            UN: 'urn:va:pat-gender:U'
        };
        expect(genderCodes[fhirPatient.gender.coding[0].code]).toEqual(vprPatient.genderCode);
    });

    it('verifies that the birthDate from the VPR Patient Resource equals that from the FHIR Patient Resource', function() {
        var strVprDateOfBirth = vprPatient.birthDate.toString().substring(0, 4) + '-' + vprPatient.birthDate.toString().substring(4, 6) + '-' + vprPatient.birthDate.toString().substring(6, 8);
        expect(fhirPatient.birthDate).toEqual(strVprDateOfBirth);
    });

    it('verifies that the addresses from the VPR Patient Resource corespond to those from the FHIR Patient Resource', function() {
        if (vprPatient.addresses !== undefined) {
            _.each(vprPatient.addresses, function(vprAddress) {
                var fhirAddress = _.find(fhirPatient.address, function(a) {
                    var containsStreetLines = true;
                    if (vprAddress.streetLine1 !== undefined) {
                        containsStreetLines = containsStreetLines && _.contains(a.line, vprAddress.streetLine1);
                    }
                    if (vprAddress.streetLine2 !== undefined) {
                        containsStreetLines = containsStreetLines && _.contains(a.line, vprAddress.streetLine2);
                    }
                    return a.city === vprAddress.city && a.state === vprAddress.stateProvince && a.zip === vprAddress.postalCode && containsStreetLines;
                });

                expect(fhirAddress).toBeDefined();
            });
        }
    });

    it('verifies that the latest maritalStatus from the VPR Patient Resource coresponds to the maritalStatus from the FHIR Patient Resource', function() {
        var maritalStatusCodes = {
            'D': 'urn:va:pat-maritalStatus:D',
            'UNK': 'urn:va:pat-maritalStatus:U',
            'S': 'urn:va:pat-maritalStatus:S',
            'M': 'urn:va:pat-maritalStatus:M',
            'L': 'urn:va:pat-maritalStatus:L',
            'W': 'urn:va:pat-maritalStatus:W'
        };
        if (vprPatient.maritalStatuses !== undefined && vprPatient.maritalStatuses.length > 0) {
            expect(maritalStatusCodes[fhirPatient.maritalStatus.coding[0].code]).toEqual(vprPatient.maritalStatuses[vprPatient.maritalStatuses.length - 1].code);
        }
    });



    it('verifies that the supports information from the VPR Patient Resource corespond to the contacts information from the FHIR Patient Resource', function() {
        var contactTypeCodes = {
            'family': 'urn:va:pat-contact:NOK',
            'emergency': 'urn:va:pat-contact:ECON'
        };
        _.each(vprPatient.supports, function(s) {
            var fhirContact = _.find(fhirPatient.contact, function(c) {
                return c.name.text === s.name && contactTypeCodes[c.relationship[0].coding[0].code] === s.contactTypeCode;
            });
            expect(fhirContact).toBeDefined();
            expect(fhirContact.relationship[0].coding[0].display).toEqual(s.contactTypeName);
        });
    });

    if (vprPatient.homeFacility !== undefined && vprPatient.homeFacility.localPatientId !== undefined) {
        it('verifies that the managingOrganization from the FHIR Patient Resource exists in the contained organizations', function() {
            var managingOrganizationId = fhirPatient.managingOrganization.reference.substring(1);
            if (vprPatient.homeFacility !== undefined && vprPatient.homeFacility.localPatientId !== undefined) {
                expect(managingOrganizationId).toEqual(vprPatient.homeFacility.localPatientId);
            } else {
                var containedManagingOrganization = _.find(fhirPatient.contained, function(res) {
                    return res._id === managingOrganizationId;
                });
                expect(containedManagingOrganization).toBeDefined();
            }
        });

        it('verifies that the homeFacility information from the VPR Patient Resource coresponds to the contained organization facility information from FHIR Patient Resource', function() {
            var containedOrganization = _.find(fhirPatient.contained, function(res) {
                return res._id === vprPatient.homeFacility.localPatientId;
            });

            expect(containedOrganization).toBeDefined();
            expect(containedOrganization.name).toEqual(vprPatient.homeFacility.name);
            var idHomeFacilityCode = _.find(containedOrganization.identifier, function(id) {
                return id.label === 'facility-code' && id.value === vprPatient.homeFacility.code;
            });

            expect(idHomeFacilityCode).toBeDefined();
        });
    }

    describe('identifiers', function() {
        it('verifies that the SSN from the VPR Patient Resource equals the one from the FHIR Patient Resource', function() {
            var idSSN = _.find(fhirPatient.identifier, function(id) {
                return id.system === 'http://hl7.org/fhir/sid/us-ssn';
            });

            expect(idSSN.value).toEqual(vprPatient.ssn);
        });

        it('verifies that the UID from the VPR Patient Resource equals the one from the FHIR Patient Resource', function() {
            var idUID = _.find(fhirPatient.identifier, function(id) {
                return id.system === 'http://vistacore.us/fhir/id/uid';
            });

            expect(idUID.value).toEqual(vprPatient.uid);
        });

        if (vprPatient.icn !== undefined) {
            it('verifies that the ICN from the VPR Patient Resource equals the one from the FHIR Patient Resource', function() {
                var idICN = _.find(fhirPatient.identifier, function(id) {
                    return id.system === 'http://vistacore.us/fhir/id/icn';
                });

                expect(idICN.value).toEqual(vprPatient.icn);
            });
        }

        it('verifies that the localId from the VPR Patient Resource equals the one from the FHIR Patient Resource', function() {
            if (vprPatient.localId !== undefined) {
                var idLocalId = _.find(fhirPatient.identifier, function(id) {
                    return id.system === 'http://vistacore.us/fhir/id/dfn';
                });

                expect(idLocalId).toBeDefined();
                expect(idLocalId.value).toEqual(vprPatient.localId.toString());
            }
        });

        it('verifies that the LRDFN from the VPR Patient Resource equals the one from the FHIR Patient Resource', function() {
            if (vprPatient.veteran !== undefined && vprPatient.veteran.lrdfn !== undefined) {
                var idLRDFN = _.find(fhirPatient.identifier, function(id) {
                    return id.system === 'http://vistacore.us/fhir/id/lrdfn';
                });

                expect(idLRDFN).toBeDefined();
                expect(idLRDFN.value).toEqual(vprPatient.veteran.lrdfn.toString());
            }
        });
    });

    describe('extensions', function() {
        if (vprPatient.religionCode !== undefined || vprPatient.religionName !== undefined) {
            it('verifies that the religion information from VPR Patient Resource coresponds to the one from the FHIR Patient Resource', function() {
                var extReligion = _.find(fhirPatient.extension, function(ext) {
                    return ext.url === 'http://vistacore.us/fhir/profiles/@main#religion';
                });

                expect(extReligion.valueCoding.code).toEqual(vprPatient.religionCode);
                expect(extReligion.valueCoding.display).toEqual(vprPatient.religionName);
            });
        }

        if (vprPatient.sensitive !== undefined) {
            it('verifies that the sensitive information flag from VPR Patient Resource coresponds to the one from the FHIR Patient Resource', function() {
                if (vprPatient.sensitive !== undefined) {
                    var extSensitive = _.find(fhirPatient.extension, function(ext) {
                        return ext.url === 'http://vistacore.us/fhir/profiles/@main#sensitive';
                    });

                    expect(extSensitive).toBeDefined();
                    expect(extSensitive.valueBoolean).toEqual(vprPatient.sensitive);
                }
            });
        }

        it('verifies that the veteran serviceConnected information from VPR Patient Resource coresponds to the one from FHIR Patient Resource', function() {
            if (vprPatient.veteran !== undefined) {
                if (vprPatient.veteran.serviceConnected !== undefined) {
                    var extServiceConnectedVet = _.find(fhirPatient.extension, function(ext) {
                        return ext.url === 'http://vistacore.us/fhir/profiles/@main#service-connected';
                    });

                    expect(extServiceConnectedVet).toBeDefined();
                    expect(extServiceConnectedVet.valueCoding.code).toEqual(vprPatient.veteran.serviceConnected ? 'Y' : 'N');
                }
                if (vprPatient.veteran.serviceConnectionPercent !== undefined) {
                    var extServiceConnectionPercent = _.find(fhirPatient.extension, function(ext) {
                        return ext.url === 'http://vistacore.us/fhir/profiles/@main#service-connected-percent';
                    });

                    expect(extServiceConnectionPercent).toBeDefined();
                    expect(extServiceConnectionPercent.valueQuantity.value).toEqual(vprPatient.veteran.serviceConnectionPercent);
                }
            }

            if (vprPatient.serviceConnected !== undefined) {
                var extServiceConnected = _.find(fhirPatient.extension, function(ext) {
                    return ext.url === 'http://vistacore.us/fhir/profiles/@main#service-connected';
                });

                expect(extServiceConnected).toBeDefined();
                expect(extServiceConnected.valueCoding.code).toEqual(vprPatient.serviceConnected ? 'Y' : 'N');
            }
        });
    });

});
