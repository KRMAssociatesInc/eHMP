'use strict';
var _ = require('underscore');
var fhirUtils = require('../common/utils/fhir-converter');
var medDispense = require('./medication-dispense-resource.js');
var medDispObj = require('./medication-dispense-objects.js');
var medDispenseIn = require('./medication-dispense-resource-spec-data.js');

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

     var vprDocuments = medDispenseIn.inputValue.data.items;
     var fhirDocuments = medDispObj.convertToFhir(vprDocuments);

     it('verifies that given a valid VPR Medication Dispense Resource converts to a defined FHIR Medication Dispense Resource object', function() {
         expect(fhirDocuments).not.to.be.undefined();
     });
     _.each(vprDocuments, function(vprDoc) {
         it('verifies that each VPR Medication Dispense Resource has a coresponding FHIR Medication Dispense Resource in the collection with the same uid', function() {

             var fhirDoc = _.find(fhirDocuments, function(doc) {
                 return doc.identifier.value === vprDoc.uid;
             });
             expect(fhirDoc).not.to.be.undefined();

             describe('found FHIR Medication Dispense coresponds to the original VPR Medication Dispense Resource - ' + vprDoc.uid, function() {

                 describe('Medication Dispense', function() {

                     it('verifies that the uid from VPR Medication Dispense Resource coresponds to the one from the FHIR Medication Dispense Resource', function() {
                         expect(fhirDoc.identifier.value).to.eql(vprDoc.uid);
                     });

                     it('verifies that the vaStatus from VPR Medication Dispense Resource coresponds to the one from the FHIR Medication Dispense Resource', function() {
                         expect(fhirDoc.status).to.eql(outpatientStatus[vprDoc.vaStatus]);
                     });

                     it('verifies that the quantityDispensed from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                         if (vprDoc.fills && vprDoc.fills[0]) {
                             expect(fhirDoc.quantity.value).to.eql(parseInt(vprDoc.fills[0].quantityDispensed));
                             expect(fhirDoc.quantity.units).to.eql(vprDoc.productFormName);
                         }
                     });

                     it('verifies that the prescription display from VPR Medication Dispense Resource coresponds to the one from the FHIR Medication Dispense Resource', function() {
                         if (vprDoc.orders[0]) {
                             expect(fhirDoc.authorizingPrescription.display).to.eql(vprDoc.name);
                         }
                     });

                     describe('Contained Resources', function() {

                         //Dispenser
                         expect(fhirDoc.dispenser).not.to.be.undefined();

                         //Medication
                         var dispenseMed = _.find(fhirDoc.contained, function(res) {
                             return res.resourceType === 'Medication';
                         });

                         it('verifies that the productFormCode from VPR Medication Dispense Resource coresponds to the one from the FHIR Medication Dispense Resource', function() {
                             expect(dispenseMed.name).to.eql(vprDoc.qualifiedName);
                         });

                         //Medication Prescription
                         var dispenseMedPrescription = _.find(fhirDoc.contained, function(res) {
                             return res.resourceType === 'MedicationPrescription';
                         });
                         expect(dispenseMedPrescription).not.to.be.undefined();

                         it('verifies that the relativeStop from VPR Medication Dispense Resource coresponds to the one from the FHIR Medication Dispense Resource', function() {
                             if (dispenseMedPrescription.dosageInstruction && dispenseMedPrescription.dosageInstruction[0]) {
                                 var dispenseRelativeStop = _.find(dispenseMedPrescription.dosageInstruction[0].extension, function(ext) {
                                     return ext.url === 'http://vistacore.us/fhir/extensions/med#relativeStop';
                                 });
                                 if (vprDoc.dosages[0]) {
                                     expect(dispenseRelativeStop).not.to.be.undefined();
                                     expect(dispenseRelativeStop.valueString).to.eql(vprDoc.dosages[0].relativeStop);
                                 }
                             }
                         });

                         it('verifies that the scheduleType from VPR Medication Dispense Resource coresponds to the one from the FHIR Medication Dispense Resource', function() {
                             if (dispenseMedPrescription.dosageInstruction && dispenseMedPrescription.dosageInstruction[0]) {
                                 var dispenseScheduleType = _.find(dispenseMedPrescription.dosageInstruction[0].timing.period.extension, function(ext) {
                                     return ext.url === 'http://vistacore.us/fhir/extensions/med#scheduleType';
                                 });
                                 if (vprDoc.dosages[0]) {
                                     expect(dispenseScheduleType).not.to.be.undefined();
                                     expect(dispenseScheduleType.valueString).to.eql(vprDoc.dosages[0].scheduleType);
                                 }
                             }
                         });

                         it('verifies that the scheduleName from VPR Medication Dispense Resource coresponds to the one from the FHIR Medication Dispense Resource', function() {
                             if (dispenseMedPrescription.dosageInstruction && dispenseMedPrescription.dosageInstruction[0]) {
                                 var dispenseScheduleName = _.find(dispenseMedPrescription.dosageInstruction[0].timing.schedule.extension, function(ext) {
                                     return ext.url === 'http://vistacore.us/fhir/extensions/med#scheduleName';
                                 });
                                 if (vprDoc.dosages[0]) {
                                     expect(dispenseScheduleName).not.to.be.undefined();
                                     expect(dispenseScheduleName.valueString).to.eql(vprDoc.dosages[0].scheduleName);
                                 }
                             }
                         });

                         it('verifies that the start and stop from VPR Medication Dispense Resource coresponds to the one from the FHIR Medication Dispense Resource', function() {
                             if (dispenseMedPrescription.dosageInstruction && dispenseMedPrescription.dosageInstruction[0]) {
                                 expect(dispenseMedPrescription.dosageInstruction[0].timing.period.start).to.eql(fhirUtils.convertToFhirDateTime(vprDoc.dosages[0].start));
                                 expect(dispenseMedPrescription.dosageInstruction[0].timing.period.end).to.eql(fhirUtils.convertToFhirDateTime(vprDoc.dosages[0].stop));
                             }
                         });

                         it('verifies coding fields from the FHIR Medication Dispense Resource', function() {
                             // var link = 'http://www.hl7.org/implement/standards/fhir/v3/RouteOfAdministration/';
                             //expect(dispenseMedPrescription.dosageInstruction[0].route.coding.system).to.eql(link);
                             //expect(dispenseMedPrescription.dosageInstruction[0].route.coding.display).to.eql(routeNameMap[vprDoc.dosages[0].routeName]);
                             if (vprDoc.dosages[0] && dispenseMedPrescription.dosageInstruction && dispenseMedPrescription.dosageInstruction[0]) {
                                 expect(dispenseMedPrescription.dosageInstruction[0].route.coding.code).to.eql(vprDoc.dosages[0].routeName);
                             }
                         });

                         it('verifies that the dosages from VPR Medication Dispense Resource coresponds to the one from the FHIR Medication Dispense Resource', function() {
                             if (vprDoc.dosages[0] && dispenseMedPrescription.dosageInstruction && dispenseMedPrescription.dosageInstruction[0]) {
                                 expect(dispenseMedPrescription.dosageInstruction[0].doseQuantity.value).to.eql(vprDoc.dosages[0].dose);
                                 expect(dispenseMedPrescription.dosageInstruction[0].doseQuantity.units).to.eql(vprDoc.dosages[0].units);
                             }
                         });



                     });

                 });

                 describe('Contained Resources', function() {

                     //Medication Prescription
                     var medPrescription = _.find(fhirDoc.contained, function(res) {
                         return res.resourceType === 'MedicationPrescription';
                     });
                     expect(medPrescription).not.to.be.undefined();


                     it('verifies that the ordered from VPR Medication Dispense Resource coresponds to the one from the FHIR Medication Dispense Resource', function() {
                         expect(medPrescription.dateWritten).to.eql(fhirUtils.convertToFhirDateTime(vprDoc.orders[0].ordered));
                     });


                     it('verifies that the sig from VPR Medication Dispense Resource coresponds to the one from the FHIR Medication Dispense Resource', function() {
                         if (medPrescription.dosageInstruction && medPrescription.dosageInstruction[0]) {
                             expect(medPrescription.dosageInstruction[0].text).to.eql(vprDoc.sig);
                         }
                     });

                     //Substance
                     var resSubstance = _.find(fhirDoc.contained, function(res) {
                         return res.resourceType === 'Substance';
                     });

                     //Medication
                     var med = _.find(fhirDoc.contained, function(res) {
                         return res.resourceType === 'Medication';
                     });
                     expect(med).not.to.be.undefined();

                     it('verifies that the name from VPR Medication Dispense Resource coresponds to the one from the FHIR Medication Dispense Resource', function() {
                         expect(med.name).to.eql(vprDoc.name);
//                         expect(med.code.text).to.eql(vprDoc.name);
                     });

                     it('verifies that the rnxcodes from VPR Medication Dispense Resource coresponds to the one from the FHIR Medication Dispense Resource', function() {
                         _.each(vprDoc.rnxcodes, function(rnx) {
                             var rnxcodes = _.find(med.code.coding, function(fhirCode) {
                                 return rnx === fhirCode.code;
                             });
                             expect(rnxcodes).not.to.be.undefined();
                         });
                     });


                     it('verifies that the codes from VPR Medication Dispense Resource coresponds to the one from the FHIR Medication Dispense Resource', function() {
                         var cFind = _.find(med.code.coding, function(fi) {
                             return fi.system === vprDoc.codes[0].system;
                         });
                         expect(cFind).not.to.be.undefined();

                         var cFind2 = _.find(med.code.coding, function(fi) {
                             return fi.code === vprDoc.codes[0].code;
                         });
                         expect(cFind2).not.to.be.undefined();

                         var cFind3 = _.find(med.code.coding, function(fi) {
                             return fi.display === vprDoc.codes[0].display;
                         });
                         expect(cFind3).not.to.be.undefined();
                     });

                     it('verifies that the productFormName from VPR Medication Dispense Resource coresponds to the one from the FHIR Medication Dispense Resource', function() {
                         expect(med.product.form.text).to.eql(vprDoc.productFormName);
                     });


                     describe('Contained Extensions', function() {

                         //Medication Prescription -dosage Instruction- Extensions
                         it('verifies that the dosages fields from VPR Medication Dispense Resource coresponds to the one from the FHIR Medication Dispense Resource', function() {
                             if (medPrescription.dosageInstruction && medPrescription.dosageInstruction[0]) {
                                 var dosagesNoun = _.find(medPrescription.dosageInstruction[0].extension, function(ext) {
                                     return ext.url === 'http://vistacore.us/fhir/extensions/med#noun';
                                 });
                                 if (vprDoc.dosages[0]) {
                                     expect(dosagesNoun).not.to.be.undefined();
                                     expect(dosagesNoun.valueString).to.eql(vprDoc.dosages[0].noun);
                                 }

                                 var dosagesInstr = _.find(medPrescription.dosageInstruction[0].extension, function(ext) {
                                     return ext.url === 'http://vistacore.us/fhir/extensions/med#instructions';
                                 });
                                 if (vprDoc.dosages[0]) {
                                     expect(dosagesInstr).not.to.be.undefined();
                                     expect(dosagesInstr.valueString).to.eql(vprDoc.dosages[0].instructions);
                                 }

                                 var dosagesAmount = _.find(medPrescription.dosageInstruction[0].extension, function(ext) {
                                     return ext.url === 'http://vistacore.us/fhir/extensions/med#amount';
                                 });
                                 if (vprDoc.dosages[0]) {
                                     expect(dosagesAmount).not.to.be.undefined();
                                     expect(dosagesAmount.valueString).to.eql(vprDoc.dosages[0].amount);
                                 }
                             }
                         });
                     });
                 });
             });
         });
     });
 });
