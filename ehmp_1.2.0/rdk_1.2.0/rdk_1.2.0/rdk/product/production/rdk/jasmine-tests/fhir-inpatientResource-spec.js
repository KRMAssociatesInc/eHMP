'use strict';
var _ = require('underscore');
var documentResource = require('../fhir/medicationAdministration/medicationadministrationResource.js');
var fhirUtils = require('../fhir/common/utils/fhirUtils');
var input = require('./input-data/inpatientResource-in.js');

var allMedsStatusCode = {
    'historical': 'completed',
    'not active': 'stopped',
    'hold': 'on hold',
    'active': 'active'
};

var vaStatusMap = {
    'DISCONTINUED': 'stopped',
    'COMPLETE': 'completed',
    'HOLD': 'on hold',
    'FLAGGED': 'on hold',
    'PENDING': 'in progress',
    'ACTIVE': 'in progress',
    'EXPIRED': 'completed',
    'DELAYED': 'on hold',
    'UNRELEASED': 'in progress',
    'DISCONTINUED/EDIT': 'stopped',
    'CANCELLED': 'stopped',
    'LAPSED': 'stopped',
    'RENEWED': 'in progress',
    'NO STATUS': 'on hold'
};

describe('Document FHIR Resource', function() {
    var req = {
        '_pid': '9E7A;8',
        query: {
            'subject.identifier': '9E7A;8'
        },
        headers: {
            host: 'localhost:8888'
        },
        protocol: 'http',
        originalUrl: '/fhir/medicationadministration?subject.identifier=9E7A:100022'
    };
    var vprDocuments = input.inputValue.data.items;
    var fhirDocumentsBundle = documentResource.convertToFhir(input.inputValue, req);
    var fhirDocuments = [];
    _.each(fhirDocumentsBundle.entry, function(e) {
        fhirDocuments.push(e.content);
    });
    it('verifies that given a valid VPR Document Resource converts to a defined FHIR Document Resource object', function() {
        expect(fhirDocuments).toBeDefined();
    });
    _.each(vprDocuments, function(vprDoc) {
        it('verifies that each VPR Document Resource has a coresponding FHIR Document Resource in the collection with the same uid', function() {

            var fhirDoc = _.find(fhirDocuments, function(doc) {
                return doc.identifier[0].value.indexOf((vprDoc.uid) > -1);
            });
            expect(fhirDoc).toBeDefined();

            describe('found FHIR Document coresponds to the original VPR Document Resource - ' + vprDoc.uid, function() {

                describe('Medication Administration', function() {

                    it('verifies that the pid from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                        expect(fhirDoc.patient.reference).toEqual('Patient/' + vprDoc.pid);
                    });

                    it('verifies that the providerName from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                        expect(fhirDoc.patient.display).toEqual(vprDoc.providerName);
                    });

                    it('verifies that the vaStatus from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                        expect(fhirDoc.status).toEqual(vaStatusMap[vprDoc.vaStatus]);
                    });

                    it('verifies that the dosages fields from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                        expect(fhirDoc.whenGiven.start).toEqual(fhirUtils.convertToFhirDateTime(vprDoc.dosages[0].start));
                        expect(fhirDoc.whenGiven.end).toEqual(fhirUtils.convertToFhirDateTime(vprDoc.dosages[0].stop));
                        expect(fhirDoc.dosage[0].quantity.value).toEqual(vprDoc.dosages[0].dose);
                        expect(fhirDoc.dosage[0].quantity.units).toEqual(vprDoc.dosages[0].units);
                        expect(fhirDoc.dosage[0].route.text).toEqual(vprDoc.dosages[0].routeName);
                    });

                    it('verifies that the relativeStart from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                        var adminRelativeStart = _.find(fhirDoc.dosage[0].extension, function(ext) {
                            return ext.url === 'http://vistacore.us/fhir/extensions/med#relativeStart';
                        });
                        expect(adminRelativeStart).toBeDefined();
                        expect(adminRelativeStart.valueString).toEqual(vprDoc.dosages[0].relativeStart);
                    });

                    it('verifies that the relativeStop from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                        var adminRelativeStop = _.find(fhirDoc.dosage[0].extension, function(ext) {
                            return ext.url === 'http://vistacore.us/fhir/extensions/med#relativeStop';
                        });
                        expect(adminRelativeStop).toBeDefined();
                        expect(adminRelativeStop.valueString).toEqual(vprDoc.dosages[0].relativeStop);
                    });

                    it('verifies that the succesor from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                        var adminSuccessor = _.find(fhirDoc.dosage[0].extension, function(ext) {
                            return ext.url === 'http://vistacore.us/fhir/extensions/med#successor';
                        });
                        expect(adminSuccessor).toBeDefined();
                        expect(adminSuccessor.valueString).toEqual(vprDoc.orders[0].successor);
                    });

                    it('verifies that the predecessor from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                        var adminPredecessor = _.find(fhirDoc.dosage[0].extension, function(ext) {
                            return ext.url === 'http://vistacore.us/fhir/extensions/med#predecessor';
                        });
                        expect(adminPredecessor).toBeDefined();
                        expect(adminPredecessor.valueString).toEqual(vprDoc.orders[0].predecessor);
                    });

                    it('verifies that the IMO from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                        var adminIMO = _.find(fhirDoc.dosage[0].extension, function(ext) {
                            return ext.url === 'http://vistacore.us/fhir/extensions/med#IMO';
                        });
                        expect(adminIMO).toBeDefined();
                        expect(adminIMO.valueBoolean).toEqual(vprDoc.IMO);
                    });

                    describe('Contained Resources', function() {

                        //Practitioner
                        var adminPractitioner = _.find(fhirDoc.contained, function(res) {
                            return res.resourceType === 'Practitioner';
                        });
                        expect(adminPractitioner).toBeDefined();

                        it('verifies that the providerUid from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                            expect(adminPractitioner.identifier[0].value).toEqual(vprDoc.orders[0].providerUid);
                        });

                        it('verifies that the providerName from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                            expect(adminPractitioner.name.text).toEqual(vprDoc.orders[0].providerName);
                        });

                        //Medication Prescription
                        var adminMedPrescription = _.find(fhirDoc.contained, function(res) {
                            return res.resourceType === 'MedicationPrescription';
                        });

                        it('verifies that the pid from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                            var pidFind = _.find(adminMedPrescription.identifier, function(fi) {
                                return fi.value === vprDoc.pid;
                            });
                            expect(pidFind).toBeDefined();
                        });

                        //Encounter
                        var adminEncounter = _.find(fhirDoc.contained, function(res) {
                            return res.resourceType === 'Encounter';
                        });

                        it('verifies that the location Name from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                            expect(adminEncounter.location[0].location.display).toEqual(vprDoc.orders[0].locationName);
                        });

                        it('verifies that the location Uid from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                            var locUid = _.find(adminEncounter.extension, function(ext) {
                                return ext.url === 'http://vistacore.us/fhir/extensions/med#locationUid';
                            });
                            expect(locUid).toBeDefined();
                            expect(locUid.valueString).toEqual(vprDoc.orders[0].locationUid);
                        });
                    });

                    describe('Extensions', function() {

                        it('verifies that the kind from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                            var adminKind = _.find(fhirDoc.extension, function(ext) {
                                return ext.url === 'http://vistacore.us/fhir/extensions/med#kind';
                            });
                            expect(adminKind).toBeDefined();
                            expect(adminKind.valueString).toEqual(vprDoc.kind);
                        });

                        it('verifies that the orderUid from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                            var adminUid = _.find(fhirDoc.extension, function(ext) {
                                return ext.url === 'http://vistacore.us/fhir/extensions/med#orderUid';
                            });
                            expect(adminUid).toBeDefined();
                            expect(adminUid.valueString).toEqual(vprDoc.orders[0].orderUid);
                        });

                        it('verifies that the realeasingPharmacistUid from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                            var adminPharmacistUid = _.find(fhirDoc.extension, function(ext) {
                                return ext.url === 'http://vistacore.us/fhir/extensions/med#pharmacistUid';
                            });
                            expect(adminPharmacistUid).toBeDefined();
                            expect(adminPharmacistUid.valueString).toEqual(vprDoc.orders[0].pharmacistUid);
                        });

                        it('verifies that the realeasingPharmacistName from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                            var adminPharmacistName = _.find(fhirDoc.extension, function(ext) {
                                return ext.url === 'http://vistacore.us/fhir/extensions/med#pharmacistName';
                            });
                            expect(adminPharmacistName).toBeDefined();
                            expect(adminPharmacistName.valueString).toEqual(vprDoc.orders[0].pharmacistName);
                        });

                        it('verifies that the supply from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                            var adminSupply = _.find(fhirDoc.extension, function(ext) {
                                return ext.url === 'http://vistacore.us/fhir/extensions/med#supply';
                            });
                            expect(adminSupply).toBeDefined();
                            expect(adminSupply.valueBoolean).toEqual(vprDoc.supply);
                        });
                    });
                });

                describe('Contained Resources', function() {

                    //Medication Prescription
                    var medPrescription = _.find(fhirDoc.contained, function(res) {
                        return res.resourceType === 'MedicationPrescription';
                    });
                    expect(medPrescription).toBeDefined();

                    it('verifies that the scheduleName from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                        var adminScheduleName = _.find(medPrescription.dosageInstruction[0].timing.extension, function(ext) {
                            return ext.url === 'http://vistacore.us/fhir/extensions/med#scheduleName';
                        });
                        expect(adminScheduleName).toBeDefined();
                        expect(adminScheduleName.valueString).toEqual(vprDoc.dosages[0].scheduleName);
                    });

                    it('verifies that the uid from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                        expect(medPrescription.identifier[0].value.indexOf(vprDoc.uid) > -1).toBe(true);
                    });

                    it('verifies that the ordered from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                        expect(medPrescription.dateWritten).toEqual(fhirUtils.convertToFhirDateTime(vprDoc.orders[0].ordered));
                    });

                    it('verifies that the medStatusName from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                        expect(medPrescription.status.code).toEqual(allMedsStatusCode[vprDoc.medStatusName]);
                    });

                    it('verifies that the summary from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                        expect(medPrescription.text.div).toEqual('<div>' + vprDoc.summary + '</div>');
                    });

                    it('verifies that the sig from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                        expect(medPrescription.dosageInstruction[0].text).toEqual(vprDoc.sig);
                    });

                    //Substance
                    var resSubstance = _.find(fhirDoc.contained, function(res) {
                        return res.resourceType === 'Substance';
                    });
                    expect(resSubstance).toBeDefined();

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
                    var resPractitioner = _.find(fhirDoc.contained, function(res) {
                        return res.resourceType === 'Practitioner';
                    });
                    expect(resPractitioner).toBeDefined();

                    it('verifies that the providerUid from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                        expect(resPractitioner.identifier[0].value).toEqual(vprDoc.orders[0].providerUid);
                    });

                    it('verifies that the providerName from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                        expect(resPractitioner.name.text).toEqual(vprDoc.orders[0].providerName);
                    });

                    //Encounter
                    var resEncounter = _.find(fhirDoc.contained, function(res) {
                        return res.resourceType === 'Encounter';
                    });
                    expect(resEncounter).toBeDefined();

                    it('verifies that the ordered from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                        expect(resEncounter.location[0].period.start).toEqual(fhirUtils.convertToFhirDateTime(vprDoc.orders[0].ordered));
                        expect(resEncounter.location[0].period.end).toEqual(fhirUtils.convertToFhirDateTime(vprDoc.orders[0].ordered));
                    });

                    it('verifies that the type from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                        expect(resEncounter.type[0].text).toEqual(vprDoc.vaType);
                    });

                    it('verifies that the locationName from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                        expect(resEncounter.location[0].display).toEqual(vprDoc.locationName);
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
                            var dosagesNoun = _.find(medPrescription.dosageInstruction[0].extension, function(ext) {
                                return ext.url === 'http://vistacore.us/fhir/extensions/med#noun';
                            });
                            expect(dosagesNoun).toBeDefined();
                            expect(dosagesNoun.valueString).toEqual(vprDoc.dosages[0].noun);

                            var dosagesInstr = _.find(medPrescription.dosageInstruction[0].extension, function(ext) {
                                return ext.url === 'http://vistacore.us/fhir/extensions/med#instructions';
                            });
                            expect(dosagesInstr).toBeDefined();
                            expect(dosagesInstr.valueString).toEqual(vprDoc.dosages[0].instructions);

                            var dosagesAmount = _.find(medPrescription.dosageInstruction[0].extension, function(ext) {
                                return ext.url === 'http://vistacore.us/fhir/extensions/med#amount';
                            });
                            expect(dosagesAmount).toBeDefined();
                            expect(dosagesAmount.valueString).toEqual(vprDoc.dosages[0].amount);
                        });

                        //Medication extensions
                        it('verifies that the Products - drugClassCode from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                            var drugCode = _.find(med.extension, function(ext) {
                                return ext.url === 'http://vistacore.us/fhir/extensions/med#drugClassCode';
                            });
                            expect(drugCode).toBeDefined();
                            expect(drugCode.valueString).toEqual(vprDoc.products[0].drugClassCode);
                        });

                        it('verifies that the Products - drugClassName from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                            var drugName = _.find(med.extension, function(ext) {
                                return ext.url === 'http://vistacore.us/fhir/extensions/med#drugClassName';
                            });
                            expect(drugName).toBeDefined();
                            expect(drugName.valueString).toEqual(vprDoc.products[0].drugClassName);
                        });

                        it('verifies that the Products - suppliedCode from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                            var sCode = _.find(med.extension, function(ext) {
                                return ext.url === 'http://vistacore.us/fhir/extensions/med#suppliedCode';
                            });
                            expect(sCode).toBeDefined();
                            expect(sCode.valueString).toEqual(vprDoc.products[0].suppliedCode);
                        });

                        it('verifies that the Products - suppliedName from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                            var sName = _.find(med.extension, function(ext) {
                                return ext.url === 'http://vistacore.us/fhir/extensions/med#suppliedName';
                            });
                            expect(sName).toBeDefined();
                            expect(sName.valueString).toEqual(vprDoc.products[0].suppliedName);
                        });

                        it('verifies that the strength from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                            var strength = _.find(med.extension, function(ext) {
                                return ext.url === 'http://vistacore.us/fhir/extensions/med#strength';
                            });
                            expect(strength).toBeDefined();
                            expect(strength.valueString).toEqual(vprDoc.products[0].strength);
                        });

                        it('verifies that the ingredientRXNCode from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                            var ingredient = _.find(med.extension, function(ext) {
                                return ext.url === 'http://vistacore.us/fhir/extensions/med#ingredientRXNCode';
                            });
                            expect(ingredient).toBeDefined();
                            expect(ingredient.valueString).toEqual(vprDoc.products[0].ingredientRXNCode);
                        });

                        it('verifies that the ingredient fields from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                            var ingredientCodeF = _.find(med.extension, function(ext) {
                                return ext.url === 'http://vistacore.us/fhir/extensions/med#ingredientCode';
                            });

                            expect(ingredientCodeF).toBeDefined();
                            expect(ingredientCodeF.valueString).toEqual(vprDoc.products[0].ingredientCode);

                            var ingredientCodeN = _.find(med.extension, function(ext) {
                                return ext.url === 'http://vistacore.us/fhir/extensions/med#ingredientCodeName';
                            });

                            expect(ingredientCodeN).toBeDefined();
                            expect(ingredientCodeN.valueString).toEqual(vprDoc.products[0].ingredientCodeName);
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
