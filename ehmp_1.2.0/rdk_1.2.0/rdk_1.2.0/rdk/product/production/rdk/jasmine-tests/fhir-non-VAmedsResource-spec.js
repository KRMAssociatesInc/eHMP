'use strict';
var _ = require('underscore');
var documentResource = require('../fhir/medicationstatement/medicationstatementResource.js');
var fhirUtils = require('../fhir/common/utils/fhirUtils');
var input = require('./input-data/non-VAmedsResource-in.js');

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

var routeNameMap = {
    'AP': 'Apply Externally',
    'B': 'Buccal',
    'DT': 'Dental',
    'EP': 'Epidural',
    'ET': 'Endotrachial Tube*',
    'GTT': 'Gastrostomy Tube',
    'GU': 'GU Irrigant',
    'IA': 'Intra-arterial',
    'IB': 'Intrabursal',
    'IC': 'Intracardiac',
    'ICV': 'Intracervical (uterus)',
    'ID': 'Intradermal',
    'IH': 'Inhalation',
    'IHA': 'Intrahepatic Artery',
    'IM': 'Intramuscular',
    'IMR': 'Immerse (Soak) Body Part',
    'IN': 'Intranasal',
    'IO': 'Intraocular',
    'IP': 'Intraperitoneal',
    'IS': 'Intrasynovial',
    'IT': 'Intrathecal',
    'IU': 'Intrauterine',
    'IV': 'Intravenous',
    'MM': 'Mucous Membrane',
    'MTH': 'Mouth/Throat',
    'NG': 'Nasogastric',
    'NP': 'Nasal Prongs*',
    'NS': 'Nasal',
    'NT': 'Nasotrachial Tube',
    'OP': 'Ophthalmic',
    'OT': 'Otic',
    'OTH': 'Other/Miscellaneous',
    'PF': 'Perfusion',
    'PO': 'Oral',
    'PR': 'Rectal',
    'RM': 'Rebreather Mask*',
    'SC': 'Subcutaneous',
    'SD': 'Soaked Dressing',
    'SL': 'Sublingual',
    'TD': 'Transdermal',
    'TL': 'Translingual',
    'TP': 'Topical',
    'TRA': 'Tracheostomy*',
    'UR': 'Urethral',
    'VG': 'Vaginal',
    'VM': 'Ventimask',
    'WND': 'Wound'
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

                describe('Medication Administration', function() {

                    it('verifies that the pid from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                        expect(fhirDoc.patient.reference).toEqual('Patient/' + vprDoc.pid);
                    });

                    it('verifies that the dosages fields from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                        expect(fhirDoc.whenGiven.start).toEqual(fhirUtils.convertToFhirDateTime(vprDoc.dosages[0].start));
                        expect(fhirDoc.whenGiven.end).toEqual(fhirUtils.convertToFhirDateTime(vprDoc.dosages[0].stop));
                        expect(fhirDoc.dosage[0].quantity.value).toEqual(vprDoc.dosages[0].dose);
                        expect(fhirDoc.dosage[0].quantity.units).toEqual(vprDoc.dosages[0].units);
                        expect(fhirDoc.dosage[0].route.text).toEqual(routeNameMap[vprDoc.dosages[0].routeName]);
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

                    it('verifies that the noun from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                        var adminNoun = _.find(fhirDoc.dosage[0].extension, function(ext) {
                            return ext.url === 'http://vistacore.us/fhir/extensions/med#noun';
                        });
                        expect(adminNoun).toBeDefined();
                        expect(adminNoun.valueString).toEqual(vprDoc.dosages[0].noun);
                    });

                    it('verifies that the instructions from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                        var adminInstructions = _.find(fhirDoc.dosage[0].extension, function(ext) {
                            return ext.url === 'http://vistacore.us/fhir/extensions/med#instructions';
                        });
                        expect(adminInstructions).toBeDefined();
                        expect(adminInstructions.valueString).toEqual(vprDoc.dosages[0].instructions);
                    });

                    it('verifies that the amount from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                        var adminAmount = _.find(fhirDoc.dosage[0].extension, function(ext) {
                            return ext.url === 'http://vistacore.us/fhir/extensions/med#amount';
                        });
                        expect(adminAmount).toBeDefined();
                        expect(adminAmount.valueString).toEqual(vprDoc.dosages[0].amount);
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

                        it('verifies that the providerUid from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                            var adminProviderUid = _.find(fhirDoc.extension, function(ext) {
                                return ext.url === 'http://vistacore.us/fhir/extensions/med#providerUid';
                            });
                            expect(adminProviderUid).toBeDefined();
                            expect(adminProviderUid.valueString).toEqual(vprDoc.orders[0].providerUid);
                        });

                        it('verifies that the locationUid from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                            var adminLocationUid = _.find(fhirDoc.extension, function(ext) {
                                return ext.url === 'http://vistacore.us/fhir/extensions/med#locationUid';
                            });
                            expect(adminLocationUid).toBeDefined();
                            expect(adminLocationUid.valueString).toEqual(vprDoc.orders[0].locationUid);
                        });

                        it('verifies that the locationName from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                            var adminLocationName = _.find(fhirDoc.extension, function(ext) {
                                return ext.url === 'http://vistacore.us/fhir/extensions/med#locationName';
                            });
                            expect(adminLocationName).toBeDefined();
                            expect(adminLocationName.valueString).toEqual(vprDoc.orders[0].locationName);
                        });

                        it('verifies that the vaStatus from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                            var adminVaStatus = _.find(fhirDoc.extension, function(ext) {
                                return ext.url === 'http://vistacore.us/fhir/extensions/med#status';
                            });
                            expect(adminVaStatus).toBeDefined();
                            expect(adminVaStatus.valueString).toEqual(vaStatusMap[vprDoc.vaStatus]);
                        });
                    });
                });

                describe('Contained Resources', function() {

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

                    describe('Contained Extensions', function() {

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
                    });
                });
            });
        });
    });
});
