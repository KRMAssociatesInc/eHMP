'use strict';
var _ = require('underscore');
var documentResource = require('../fhir/medicationdispense/medicationdispenseResource.js');
var fhirUtils = require('../fhir/common/utils/fhirUtils');
var input = require('./input-data/outpatientResource-in.js');

var allMedsStatusCode = {
    'historical': 'completed',
    'not active': 'stopped',
    'hold': 'on hold',
    'active': 'active'
};

var outpatientStatus = {
    'DISCONTINUED': 'stopped',
    'COMPLETE': 'completed',
    'HOLD ': 'on hold',
    'FLAGGED': 'on hold',
    'PENDING': 'in progress',
    'ACTIVE ': 'in progress',
    'EXPIRED': 'completed',
    'DELAYED': 'on hold',
    'UNRELEASED': 'in progress',
    'DISCONTINUED/EDIT': 'stopped',
    'CANCELLED': 'stopped',
    'LAPSED': 'stopped',
    'RENEWED': 'in progress',
    'NO STATUS': 'on hold'
};

var vaTypeMap = {
    'I': 'Inpatient',
    'N': 'Non-Va',
    'O': 'Outpatient',
    'V': 'IV'
};

describe('Document FHIR Resource', function() {

    var vprDocuments = input.inputValue.data.items;
    var fhirDocuments = documentResource.convertToFhir(input.inputValue);

    it('verifies that given a valid VPR Document Resource converts to a defined FHIR Document Resource object', function() {
        expect(fhirDocuments).toBeDefined();
    });
    _.each(vprDocuments, function(vprDoc) {
        it('verifies that each VPR Document Resource has a coresponding FHIR Document Resource in the collection with the same uid', function() {

            var fhirDoc = _.find(fhirDocuments, function(doc) {
                return doc.identifier.value === vprDoc.uid;
            });
            expect(fhirDoc).toBeDefined();

            describe('found FHIR Document coresponds to the original VPR Document Resource - ' + vprDoc.uid, function() {

                describe('Medication Dispense', function() {

                    it('verifies that the uid from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                        expect(fhirDoc.identifier.value).toEqual(vprDoc.uid);
                    });

                    it('verifies that the vaStatus from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                        expect(fhirDoc.status).toEqual(outpatientStatus[vprDoc.vaStatus]);
                    });

                    it('verifies that the fillCost from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                        var dispenseFillCost = _.find(fhirDoc.dispense.extension, function(ext) {
                            return ext.url === 'http://vistacore.us/fhir/extensions/med#fillCost';
                        });
                        expect(dispenseFillCost).toBeDefined();
                        expect(dispenseFillCost.valueString).toEqual(vprDoc.orders[0].fillCost);
                    });

                    it('verifies that the fillsRemaining from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                        var dispenseFillsRemaining = _.find(fhirDoc.dispense.extension, function(ext) {
                            return ext.url === 'http://vistacore.us/fhir/extensions/med#fillsRemaining';
                        });
                        expect(dispenseFillsRemaining).toBeDefined();
                        expect(dispenseFillsRemaining.valueString).toEqual(vprDoc.orders[0].fillsRemaining);
                    });

                    it('verifies that the vaRouting from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                        var dispenseVaRouting = _.find(fhirDoc.dispense.extension, function(ext) {
                            return ext.url === 'http://vistacore.us/fhir/extensions/med#vaRouting';
                        });
                        expect(dispenseVaRouting).toBeDefined();
                        expect(dispenseVaRouting.valueString).toEqual(vprDoc.orders[0].vaRouting);
                    });

                    it('verifies that the administrations from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                        var dispenseAdministrations = _.find(fhirDoc.dispense.extension, function(ext) {
                            return ext.url === 'http://vistacore.us/fhir/extensions/med#administrations';
                        });
                        expect(dispenseAdministrations).toBeDefined();
                        //expect(dispenseAdministrations.valueString).toEqual(vprDoc.administrations[0]);
                    });

                    it('verifies that the units from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                        var dispenseUnits = _.find(fhirDoc.dispense.extension, function(ext) {
                            return ext.url === 'http://vistacore.us/fhir/extensions/med#units';
                        });
                        expect(dispenseUnits).toBeDefined();
                        expect(dispenseUnits.valueString).toEqual(vprDoc.units);
                    });

                    it('verifies that the IMO from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                        var dispenseIMO = _.find(fhirDoc.dispense.extension, function(ext) {
                            return ext.url === 'http://vistacore.us/fhir/extensions/med#IMO';
                        });
                        expect(dispenseIMO).toBeDefined();
                        expect(dispenseIMO.valueBoolean).toEqual(vprDoc.IMO);
                    });

                    it('verifies that the daysSupplyDispensed from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                        if (vprDoc.fills && vprDoc.fills[0]) {
                            var dispenseDays = _.find(fhirDoc.dispense.extension, function(ext) {
                                return ext.url === 'http://vistacore.us/fhir/extensions/med#daysSupplyDispensed';
                            });
                            expect(dispenseDays).toBeDefined();
                            expect(dispenseDays.valueString).toEqual(vprDoc.fills[0].daysSupplyDispensed);
                        }
                    });

                    it('verifies that the routing from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                        if (vprDoc.fills && vprDoc.fills[0]) {
                            var dispenseRouting = _.find(fhirDoc.dispense.extension, function(ext) {
                                return ext.url === 'http://vistacore.us/fhir/extensions/med#routing';
                            });
                            expect(dispenseRouting).toBeDefined();
                            expect(dispenseRouting.valueString).toEqual(vprDoc.fills[0].routing);
                        }
                    });

                    it('verifies that the partial from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                        if (vprDoc.fills && vprDoc.fills[0]) {
                            var dispensePartial = _.find(fhirDoc.dispense.extension, function(ext) {
                                return ext.url === 'http://vistacore.us/fhir/extensions/med#partial';
                            });
                            expect(dispensePartial).toBeDefined();
                            expect(dispensePartial.valueString).toEqual(vprDoc.fills[0].partial);
                        }
                    });

                    it('verifies that the quantityDispensed from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                        if (vprDoc.fills && vprDoc.fills[0]) {
                            expect(fhirDoc.dispense.quantity).toEqual(vprDoc.fills[0].quantityDispensed);
                        }
                    });

                    it('verifies that the releaseDate from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                        if (vprDoc.fills && vprDoc.fills[0]) {
                            expect(fhirDoc.dispense.whenPrepared).toEqual(fhirUtils.convertToFhirDateTime(vprDoc.fills[0].releaseDate));
                        }
                    });

                    it('verifies that the dispenseDate from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                        if (vprDoc.fills && vprDoc.fills[0]) {
                            expect(fhirDoc.dispense.whenHandedOver).toEqual(fhirUtils.convertToFhirDateTime(vprDoc.fills[0].dispenseDate));
                        }
                    });

                    describe('Contained Resources', function() {

                        //Practitioner
                        if (vprDoc.fills && vprDoc.fills[0]) {
                            var dispensePractitioner = _.find(fhirDoc.contained, function(res) {
                                return res.resourceType === 'Practitioner';
                            });
                            expect(dispensePractitioner).toBeDefined();
                        }

                        it('verifies that the dispensingPharmacy from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                            if (vprDoc.fills && vprDoc.fills[0]) {
                                expect(dispensePractitioner.organization.name).toEqual(vprDoc.fills[0].dispensingPharmacy);
                            }
                        });

                        //Medication
                        var dispenseMed = _.find(fhirDoc.contained, function(res) {
                            return res.resourceType === 'Medication';
                        });

                        it('verifies that the productFormCode from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                            expect(dispenseMed.product.form.coding[0].code).toEqual(vprDoc.productFormCode);
                        });

                        //Medication Prescription
                        var dispenseMedPrescription = _.find(fhirDoc.contained, function(res) {
                            return res.resourceType === 'MedicationPrescription';
                        });
                        expect(dispenseMedPrescription).toBeDefined();

                        it('verifies that the overall from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                            expect(dispenseMedPrescription.dispense.validityPeriod.start).toEqual(fhirUtils.convertToFhirDateTime(vprDoc.overallStart));
                            expect(dispenseMedPrescription.dispense.validityPeriod.end).toEqual(fhirUtils.convertToFhirDateTime(vprDoc.overallStop));
                        });

                        it('verifies that the stopped from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                            var dStopped = _.find(dispenseMedPrescription.dispense.validityPeriod.extension, function(ext) {
                                return ext.url === 'http://vistacore.us/fhir/extensions/med#stopped';
                            });
                            expect(dStopped).toBeDefined();
                            expect(dispenseMedPrescription.dispense.validityPeriod.end).toEqual(fhirUtils.convertToFhirDateTime(vprDoc.stopped));
                        });

                        it('verifies that the kind from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                            var dKind = _.find(dispenseMedPrescription.extension, function(ext) {
                                return ext.url === 'http://vistacore.us/fhir/extensions/med#kind';
                            });
                            expect(dKind).toBeDefined();
                            expect(dKind.valueString).toEqual(vprDoc.kind);
                        });

                        it('verifies that the scheduleFreq from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                            var dSchedule = _.find(dispenseMedPrescription.extension, function(ext) {
                                return ext.url === 'http://vistacore.us/fhir/extensions/med#scheduleFreq';
                            });
                            if (vprDoc.dosages[0]) {
                                expect(dSchedule).toBeDefined();
                                expect(dSchedule.valueString).toEqual(vprDoc.dosages[0].scheduleFreq);
                            }
                        });

                        it('verifies that the prescriptionId from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                            if (vprDoc.orders[0]) {
                                expect(dispenseMedPrescription.identifier[1].value).toEqual(vprDoc.orders[0].prescriptionId);
                            }
                        });

                        it('verifies that the facilityCode from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                            expect(dispenseMedPrescription.encounter.location[0].location.identifier).toEqual(vprDoc.facilityCode);
                        });

                        it('verifies that the name from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                            expect(dispenseMedPrescription.medication.display).toEqual(vprDoc.name);
                            expect(dispenseMedPrescription.medication.reference).toEqual('#Medication/' + vprDoc.uid);
                        });

                        it('verifies that the relativeStart from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                            if (dispenseMedPrescription.dosageInstruction && dispenseMedPrescription.dosageInstruction[0]) {
                                var dispenseRelativeStart = _.find(dispenseMedPrescription.dosageInstruction[0].extension, function(ext) {
                                    return ext.url === 'http://vistacore.us/fhir/extensions/med#relativeStart';
                                });
                                if (vprDoc.dosages[0]) {
                                    expect(dispenseRelativeStart).toBeDefined();
                                    expect(dispenseRelativeStart.valueString).toEqual(vprDoc.dosages[0].relativeStart);
                                }
                            }
                        });

                        it('verifies that the relativeStop from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                            if (dispenseMedPrescription.dosageInstruction && dispenseMedPrescription.dosageInstruction[0]) {
                                var dispenseRelativeStop = _.find(dispenseMedPrescription.dosageInstruction[0].extension, function(ext) {
                                    return ext.url === 'http://vistacore.us/fhir/extensions/med#relativeStop';
                                });
                                if (vprDoc.dosages[0]) {
                                    expect(dispenseRelativeStop).toBeDefined();
                                    expect(dispenseRelativeStop.valueString).toEqual(vprDoc.dosages[0].relativeStop);
                                }
                            }
                        });

                        it('verifies that the scheduleType from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                            if (dispenseMedPrescription.dosageInstruction && dispenseMedPrescription.dosageInstruction[0]) {
                                var dispenseScheduleType = _.find(dispenseMedPrescription.dosageInstruction[0].timing.period.extension, function(ext) {
                                    return ext.url === 'http://vistacore.us/fhir/extensions/med#scheduleType';
                                });
                                if (vprDoc.dosages[0]) {
                                    expect(dispenseScheduleType).toBeDefined();
                                    expect(dispenseScheduleType.valueString).toEqual(vprDoc.dosages[0].scheduleType);
                                }
                            }
                        });

                        it('verifies that the scheduleName from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                            if (dispenseMedPrescription.dosageInstruction && dispenseMedPrescription.dosageInstruction[0]) {
                                var dispenseScheduleName = _.find(dispenseMedPrescription.dosageInstruction[0].timing.schedule.extension, function(ext) {
                                    return ext.url === 'http://vistacore.us/fhir/extensions/med#scheduleName';
                                });
                                if (vprDoc.dosages[0]) {
                                    expect(dispenseScheduleName).toBeDefined();
                                    expect(dispenseScheduleName.valueString).toEqual(vprDoc.dosages[0].scheduleName);
                                }
                            }
                        });

                        it('verifies that the start and stop from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                            if (dispenseMedPrescription.dosageInstruction && dispenseMedPrescription.dosageInstruction[0]) {
                                expect(dispenseMedPrescription.dosageInstruction[0].timing.period.start).toEqual(fhirUtils.convertToFhirDateTime(vprDoc.dosages[0].start));
                                expect(dispenseMedPrescription.dosageInstruction[0].timing.period.end).toEqual(fhirUtils.convertToFhirDateTime(vprDoc.dosages[0].stop));
                            }
                        });

                        it('verifies coding fields from the FHIR Document Resource', function() {
                            // var link = 'http://www.hl7.org/implement/standards/fhir/v3/RouteOfAdministration/';
                            //expect(dispenseMedPrescription.dosageInstruction[0].route.coding.system).toEqual(link);
                            //expect(dispenseMedPrescription.dosageInstruction[0].route.coding.display).toEqual(routeNameMap[vprDoc.dosages[0].routeName]);
                            if (vprDoc.dosages[0] && dispenseMedPrescription.dosageInstruction && dispenseMedPrescription.dosageInstruction[0]) {
                                expect(dispenseMedPrescription.dosageInstruction[0].route.coding.code).toEqual(vprDoc.dosages[0].routeName);
                            }
                        });

                        it('verifies that the dosages from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                            if (vprDoc.dosages[0] && dispenseMedPrescription.dosageInstruction && dispenseMedPrescription.dosageInstruction[0]) {
                                expect(dispenseMedPrescription.dosageInstruction[0].doseQuantity.value).toEqual(vprDoc.dosages[0].dose);
                                expect(dispenseMedPrescription.dosageInstruction[0].doseQuantity.units).toEqual(vprDoc.dosages[0].units);
                            }
                        });

                        it('verifies that the fillsAllowed from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                            if (vprDoc.dosages[0]) {
                                expect(dispenseMedPrescription.dispense.numberOfRepeatsAllowed).toEqual(vprDoc.orders[0].fillsAllowed);
                            }
                        });

                        it('verifies that the quantityOrdered from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                            if (vprDoc.dosages[0]) {
                                expect(dispenseMedPrescription.dispense.quantity).toEqual(vprDoc.orders[0].quantityOrdered);
                            }
                        });

                        it('verifies that the daysSupply from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                            expect(dispenseMedPrescription.dispense.expectedSupplyDuration).toEqual(vprDoc.orders[0].daysSupply);
                        });

                    });

                    describe('Extensions', function() {

                        it('verifies that the lastFilled from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                            var dispenseKind = _.find(fhirDoc.extension, function(ext) {
                                return ext.url === 'http://vistacore.us/fhir/extensions/med#lastFilled';
                            });
                            expect(dispenseKind).toBeDefined();
                            expect(dispenseKind.valueString).toEqual(vprDoc.lastFilled);
                        });

                        it('verifies that the type from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                            var dispenseType = _.find(fhirDoc.extension, function(ext) {
                                return ext.url === 'http://vistacore.us/fhir/extensions/med#type';
                            });
                            expect(dispenseType).toBeDefined();
                            expect(dispenseType.valueString).toEqual(vprDoc.type);
                        });
                    });
                });

                describe('Contained Resources', function() {

                    //Medication Prescription
                    var medPrescription = _.find(fhirDoc.contained, function(res) {
                        return res.resourceType === 'MedicationPrescription';
                    });
                    expect(medPrescription).toBeDefined();

                    it('verifies that the uid from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                        var uidFind = _.find(medPrescription.identifier, function(fi) {
                            return fi.value === vprDoc.uid;
                        });
                        expect(uidFind).toBeDefined();
                        //expect(medPrescription.identifier[1].value).toEqual(vprDoc.uid);
                    });

                    it('verifies that the ordered from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                        expect(medPrescription.dateWritten).toEqual(fhirUtils.convertToFhirDateTime(vprDoc.orders[0].ordered));
                    });

                    it('verifies that the medStatusName from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                        expect(medPrescription.status.code).toEqual(allMedsStatusCode[vprDoc.medStatusName]);
                    });

                    it('verifies that the summary from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                        expect(medPrescription.text.div).toEqual(vprDoc.summary);
                    });

                    it('verifies that the sig from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                        if (medPrescription.dosageInstruction && medPrescription.dosageInstruction[0]) {
                            expect(medPrescription.dosageInstruction[0].text).toEqual(vprDoc.sig);
                        }
                    });

                    //Substance
                    var resSubstance = _.find(fhirDoc.contained, function(res) {
                        return res.resourceType === 'Substance';
                    });
                    expect(resSubstance).toBeDefined();

                    it('verifies that the ingredient fields from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                        if (vprDoc.products && vprDoc.products[0]) {
                            expect(resSubstance.type.coding[0].code).toEqual(vprDoc.products[0].ingredientCode);
                            expect(resSubstance.type.coding[0].display).toEqual(vprDoc.products[0].ingredientCodeName);
                            expect(resSubstance.type.coding[0].system).toEqual('urn:oid:2.16.840.1.113883.6.233');
                            if (vprDoc.products[0].ingredientRole.substring(0, 8) === 'urn:sct:') {
                                expect(resSubstance.type.coding[1].code).toEqual(vprDoc.products[0].ingredientRole);
                                expect(resSubstance.type.coding[1].display).toEqual(vprDoc.products[0].ingredientName);
                                expect(resSubstance.type.coding[1].system).toEqual('SNOMED-CT');
                            }
                        }
                    });
                    //Medication
                    var med = _.find(fhirDoc.contained, function(res) {
                        return res.resourceType === 'Medication';
                    });
                    expect(med).toBeDefined();

                    it('verifies that the name from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                        expect(med.name).toEqual(vprDoc.name);
                        expect(med.code.text).toEqual(vprDoc.name);
                    });

                    it('verifies that the rnxcodes from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                        _.each(vprDoc.rnxcodes, function(rnx) {
                            var rnxcodes = _.find(med.code.coding, function(fhirCode) {
                                return rnx === fhirCode.code;
                            });
                            expect(rnxcodes).toBeDefined();
                        });
                    });

                    it('verifies that the reference field from Medication Resource coresponds to the id from Substance Resource', function() {
                        expect(med.product.ingredient[0].item.reference).toEqual('#' + resSubstance._id);
                    });

                    it('verifies that the codes from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                        var cFind = _.find(med.code.coding, function(fi) {
                            return fi.system === vprDoc.codes[0].system;
                        });
                        expect(cFind).toBeDefined();

                        var cFind2 = _.find(med.code.coding, function(fi) {
                            return fi.code === vprDoc.codes[0].code;
                        });
                        expect(cFind2).toBeDefined();

                        var cFind3 = _.find(med.code.coding, function(fi) {
                            return fi.display === vprDoc.codes[0].display;
                        });
                        expect(cFind3).toBeDefined();
                    });

                    it('verifies that the productFormName from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                        expect(med.product.form.text).toEqual(vprDoc.productFormName);
                    });

                    //Practitioner
                    if (vprDoc.fills && vprDoc.fills[0]) {
                        var resPractitioner = _.find(fhirDoc.contained, function(res) {
                            return res.resourceType === 'Practitioner';
                        });
                        expect(resPractitioner).toBeDefined();


                        it('verifies that the providerUid from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                            expect(resPractitioner.identifier.value).toEqual(vprDoc.orders[0].providerUid);
                        });

                        it('verifies that the providerName from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                            expect(resPractitioner.name.text).toEqual(vprDoc.orders[0].providerName);
                        });
                    }

                    //Encounter
                    var resEncounter = _.find(fhirDoc.contained, function(res) {
                        return res.resourceType === 'Encounter';
                    });
                    expect(resEncounter).toBeDefined();

                    it('verifies that the type from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                        expect(resEncounter.type).toEqual(vaTypeMap[vprDoc.vaType]);
                    });

                    it('verifies that the locationName from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                        expect(resEncounter.location[0].display).toEqual(vprDoc.locationName);
                    });

                    it('verifies that the ordered from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                        expect(resEncounter.location[0].period.start).toEqual(fhirUtils.convertToFhirDateTime(vprDoc.orders[0].ordered));
                        expect(resEncounter.location[0].period.end).toEqual(fhirUtils.convertToFhirDateTime(vprDoc.orders[0].ordered));
                    });


                    //Location
                    var resLocation = _.find(fhirDoc.contained, function(res) {
                        return res.resourceType === 'Location';
                    });
                    expect(resLocation).toBeDefined();

                    it('verifies that the facility fields from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                        expect(resLocation.name).toEqual(vprDoc.facilityName);
                        expect(resLocation.identifier.value).toEqual(vprDoc.facilityCode);
                    });

                    describe('Contained Extensions', function() {

                        //Medication Prescription Extensions
                        it('verifies that the localId from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                            var locId = _.find(medPrescription.extension, function(ext) {
                                return ext.url === 'http://vistacore.us/fhir/extensions/med#localId';
                            });
                            expect(locId).toBeDefined();
                            expect(locId.valueString).toEqual(vprDoc.localId);
                        });

                        it('verifies that the medStatus from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                            var medStatus = _.find(medPrescription.extension, function(ext) {
                                return ext.url === 'http://vistacore.us/fhir/extensions/med#medStatus';
                            });
                            expect(medStatus).toBeDefined();
                            expect(medStatus.valueString).toEqual(vprDoc.medStatus);
                        });

                        it('verifies that the medStatusName from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                            var medStatusName = _.find(medPrescription.extension, function(ext) {
                                return ext.url === 'http://vistacore.us/fhir/extensions/med#medStatusName';
                            });
                            expect(medStatusName).toBeDefined();
                            expect(medStatusName.valueString).toEqual(vprDoc.medStatusName);
                        });

                        it('verifies that the medType from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                            var medType = _.find(medPrescription.extension, function(ext) {
                                return ext.url === 'http://vistacore.us/fhir/extensions/med#medType';
                            });
                            expect(medType).toBeDefined();
                            expect(medType.valueString).toEqual(vprDoc.medType);
                        });

                        it('verifies that the Orders - pharmacistUid from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                            var pUid = _.find(medPrescription.extension, function(ext) {
                                return ext.url === 'http://vistacore.us/fhir/extensions/med#pharmacistUid';
                            });
                            expect(pUid).toBeDefined();
                            expect(pUid.valueString).toEqual(vprDoc.orders[0].pharmacistUid);
                        });

                        it('verifies that the Orders - pharmacistName from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                            var pName = _.find(medPrescription.extension, function(ext) {
                                return ext.url === 'http://vistacore.us/fhir/extensions/med#pharmacistName';
                            });
                            expect(pName).toBeDefined();
                            expect(pName.valueString).toEqual(vprDoc.orders[0].pharmacistName);
                        });

                        it('verifies that the supply from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                            var supply = _.find(medPrescription.extension, function(ext) {
                                return ext.url === 'http://vistacore.us/fhir/extensions/med#supply';
                            });
                            expect(supply).toBeDefined();
                            expect(supply.valueBoolean).toEqual(vprDoc.supply);
                        });

                        it('verifies that the orderUid from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                            var orderUid = _.find(medPrescription.extension, function(ext) {
                                return ext.url === 'http://vistacore.us/fhir/extensions/med#orderUid';
                            });
                            expect(orderUid).toBeDefined();
                            expect(orderUid.valueString).toEqual(vprDoc.orders[0].orderUid);
                        });

                        //Medication Prescription -dosage Instruction- Extensions
                        it('verifies that the dosages fields from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                            if (medPrescription.dosageInstruction && medPrescription.dosageInstruction[0]) {
                                var dosagesNoun = _.find(medPrescription.dosageInstruction[0].extension, function(ext) {
                                    return ext.url === 'http://vistacore.us/fhir/extensions/med#noun';
                                });
                                if (vprDoc.dosages[0]) {
                                    expect(dosagesNoun).toBeDefined();
                                    expect(dosagesNoun.valueString).toEqual(vprDoc.dosages[0].noun);
                                }

                                var dosagesInstr = _.find(medPrescription.dosageInstruction[0].extension, function(ext) {
                                    return ext.url === 'http://vistacore.us/fhir/extensions/med#instructions';
                                });
                                if (vprDoc.dosages[0]) {
                                    expect(dosagesInstr).toBeDefined();
                                    expect(dosagesInstr.valueString).toEqual(vprDoc.dosages[0].instructions);
                                }

                                var dosagesAmount = _.find(medPrescription.dosageInstruction[0].extension, function(ext) {
                                    return ext.url === 'http://vistacore.us/fhir/extensions/med#amount';
                                });
                                if (vprDoc.dosages[0]) {
                                    expect(dosagesAmount).toBeDefined();
                                    expect(dosagesAmount.valueString).toEqual(vprDoc.dosages[0].amount);
                                }
                            }
                        });

                        //Medication extensions
                        it('verifies that the Products - drugClassCode from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                            if (vprDoc.products && vprDoc.products[0]) {
                                var drugCode = _.find(med.extension, function(ext) {
                                    return ext.url === 'http://vistacore.us/fhir/extensions/med#drugClassCode';
                                });
                                expect(drugCode).toBeDefined();
                                expect(drugCode.valueString).toEqual(vprDoc.products[0].drugClassCode);
                            }
                        });

                        it('verifies that the Products - drugClassName from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                            if (vprDoc.products && vprDoc.products[0]) {
                                var drugName = _.find(med.extension, function(ext) {
                                    return ext.url === 'http://vistacore.us/fhir/extensions/med#drugClassName';
                                });
                                expect(drugName).toBeDefined();
                                expect(drugName.valueString).toEqual(vprDoc.products[0].drugClassName);
                            }
                        });

                        it('verifies that the Products - suppliedCode from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                            if (vprDoc.products && vprDoc.products[0]) {
                                var sCode = _.find(med.extension, function(ext) {
                                    return ext.url === 'http://vistacore.us/fhir/extensions/med#suppliedCode';
                                });
                                expect(sCode).toBeDefined();
                                expect(sCode.valueString).toEqual(vprDoc.products[0].suppliedCode);
                            }
                        });

                        it('verifies that the Products - suppliedName from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                            if (vprDoc.products && vprDoc.products[0]) {
                                var sName = _.find(med.extension, function(ext) {
                                    return ext.url === 'http://vistacore.us/fhir/extensions/med#suppliedName';
                                });
                                expect(sName).toBeDefined();
                                expect(sName.valueString).toEqual(vprDoc.products[0].suppliedName);
                            }
                        });

                        it('verifies that the strength from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                            if (vprDoc.products && vprDoc.products[0]) {
                                var strength = _.find(med.extension, function(ext) {
                                    return ext.url === 'http://vistacore.us/fhir/extensions/med#strength';
                                });
                                expect(strength).toBeDefined();
                                expect(strength.valueString).toEqual(vprDoc.products[0].strength);
                            }
                        });

                        it('verifies that the ingredientRXNCode from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                            if (vprDoc.products && vprDoc.products[0]) {
                                var ingredient = _.find(med.extension, function(ext) {
                                    return ext.url === 'http://vistacore.us/fhir/extensions/med#ingredientRXNCode';
                                });
                                expect(ingredient).toBeDefined();
                                expect(ingredient.valueString).toEqual(vprDoc.products[0].ingredientRXNCode);
                            }
                        });

                        //Encounter extension

                        it('verifies that the locationUid from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                            var loc = _.find(resEncounter.extension, function(ext) {
                                return ext.url === 'http://vistacore.us/fhir/extensions/med#locationUid';
                            });
                            expect(loc).toBeDefined();
                            expect(loc.valueString).toEqual(vprDoc.orders[0].locationUid);
                        });
                    });
                });
            });
        });
    });
});
