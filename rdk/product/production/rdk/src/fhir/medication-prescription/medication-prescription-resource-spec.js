'use strict';
var _ = require('underscore');
var fhirUtils = require('../common/utils/fhir-converter');
var MedicationPrescriptionResource = require('./medication-prescription-resource');
var MedicationPrescription = require('./medication-prescription');
var MedPrescriptionIn = require('./medication-prescription-resource-spec-data').data;
var jdsInput = MedPrescriptionIn.jdsData;
var singleRecord = MedPrescriptionIn.singleRecord;
var singleRecordNoFills = MedPrescriptionIn.singleRecordNoFills;

function vaStatusToFhirStatus(vaStatus) {
    var jdsRecord = _.clone(singleRecord);
    jdsRecord.vaStatus = vaStatus;
    return MedicationPrescription.convertToMedicationPrescription(jdsRecord, '123456').status;
}

describe('Medication Prescription FHIR Resource', function() {
    it('Verifies that resource is parameters are configured correctly', function() {
        var config = MedicationPrescriptionResource.getResourceConfig()[0];
        var params = config.parameters;
        expect(params.get).to.not.be.undefined();
        expect(params.get['subject.identifier']).to.not.be.undefined();
        expect(params.get['subject.identifier'].required).to.be.truthy();
    });
    it('Verifies correct resource name and path', function() {
        var config = MedicationPrescriptionResource.getResourceConfig()[0];
        expect(config.name).to.equal('medicationprescription');
        expect(config.path).to.equal('');
    });
});

describe('MedicationPrescription FHIR conversion methods', function() {
    var req = {
        '_pid': '9E7A;253',
        originalUrl: '/fhir/medicationprescription?subject.identifier=11016V630869',
        headers: {
            host: 'localhost:8888'
        },
        protocol: 'http'
    };
    var fhirBundle = MedicationPrescription.buildBundle(jdsInput.data.items, req, jdsInput.data.totalItems);

    it('bundle results correctly', function() {
        expect(fhirBundle.resourceType).to.equal('Bundle');
        expect(fhirBundle.type).to.equal('collection');
        expect(fhirBundle.id).to.not.be.undefined();
        expect(fhirBundle.link).to.not.be.undefined();
        expect(fhirBundle.link.length).to.equal(1);
        expect(fhirBundle.link[0].relation).to.equal('self');
        expect(fhirBundle.link[0].url).to.equal('http://localhost:8888/fhir/medicationprescription?subject.identifier=11016V630869');
        expect(fhirBundle.total).to.equal(99);
        expect(fhirBundle.entry).to.not.be.undefined();
        expect(fhirBundle.entry.length).to.equal(3);
    });

    describe(':: MedicationPrescription', function() {
        var fhirItem = MedicationPrescription.convertToMedicationPrescription(singleRecord, req._pid);

        it('sets the id and resourceType correctly', function() {
            expect(fhirItem.resourceType).to.equal('MedicationPrescription');
            expect(fhirItem.id).to.not.be.undefined();
        });
        it('maps status correctly', function() {
            expect(vaStatusToFhirStatus('Pending')).to.equal('active');
            expect(vaStatusToFhirStatus('active')).to.equal('active');
            expect(vaStatusToFhirStatus('unreleased')).to.equal('active');
            expect(vaStatusToFhirStatus('renewed')).to.equal('active');
            expect(vaStatusToFhirStatus('continued')).to.equal('active');
            expect(vaStatusToFhirStatus('hold')).to.equal('on-hold');
            expect(vaStatusToFhirStatus('flagged')).to.equal('on-hold');
            expect(vaStatusToFhirStatus('delayed')).to.equal('on-hold');
            expect(vaStatusToFhirStatus('no status')).to.equal('on-hold');
            expect(vaStatusToFhirStatus('complete')).to.equal('completed');
            expect(vaStatusToFhirStatus('discontinued')).to.equal('stopped');
            expect(vaStatusToFhirStatus('discontinued/edit')).to.equal('stopped');
            expect(vaStatusToFhirStatus('cancelled')).to.equal('stopped');
            expect(vaStatusToFhirStatus('lapsed')).to.equal('stopped');
            expect(vaStatusToFhirStatus('expired')).to.equal('stopped');
            expect(vaStatusToFhirStatus('suspend')).to.equal('stopped');
        });
        it('sets identifier correctly', function() {
            expect(fhirItem.identifier).to.not.be.undefined();
            expect(fhirItem.identifier.length).to.equal(1);
            expect(fhirItem.identifier[0].value).to.equal(singleRecord.uid);
            expect(fhirItem.identifier[0].system).to.equal('urn:oid:2.16.840.1.113883.6.233');
        });
        it('sets dateWritten correctly', function() {
            expect(fhirItem.dateWritten).to.equal(fhirUtils.convertToFhirDateTime(singleRecord.orders[0].ordered));
        });
        it('sets patient reference correctly', function() {
            expect(fhirItem.patient.reference).to.equal('Patient/' + req._pid);
        });
        it('sets prescriber reference correctly', function() {
            expect(fhirItem.prescriber.reference).to.equal('Provider/' + singleRecord.orders[0].providerUid);
        });
        it('sets note correctly', function() {
            expect(fhirItem.note).to.equal(singleRecord.summary);
        });
        describe(':: medication ::', function() {
            var med = _.find(fhirItem.contained, function(item) {
                return item.resourceType === 'Medication';
            });
            var substance = _.find(med.contained, function(item) {
                return item.resourceType === 'Substance';
            });

            it('sets medication reference correctly', function() {
                expect(med).to.not.be.undefined();
                expect(fhirItem.medication.reference).to.equal('#' + med.id);
            });

            it('constructs a proper Medication object', function() {
                expect(med.name).to.equal(singleRecord.name);
                expect(med.code.text).to.equal(singleRecord.codes[0].display);
                expect(med.code.coding[0].code).to.equal(singleRecord.codes[0].code);
                expect(med.code.coding[0].display).to.equal(singleRecord.codes[0].display);
                expect(med.code.coding[0].system).to.equal(singleRecord.codes[0].system);
                expect(med.product.form.text).to.equal(singleRecord.productFormName);
                expect(med.product.ingredient[0].item.display).to.equal(singleRecord.products[0].ingredientName);
            });
            it('sets substance reference correctly', function() {
                expect(substance).to.not.be.undefined();
                expect(med.product.ingredient[0].item.reference).to.equal('#' + substance.id);
            });
            it('constructs a propert Substance object', function() {
                var product = singleRecord.products[0];
                var coding1 = _.find(substance.type.coding, function(item) {
                    return item.code === product.ingredientCode;
                });
                var coding2 = _.find(substance.type.coding, function(item) {
                    return item.code === product.ingredientRole;
                });

                expect(substance.type.text).to.equal(product.suppliedName);

                expect(coding1).to.not.be.undefined();
                expect(coding1.display).to.equal(product.ingredientCodeName);
                expect(coding1.code).to.equal(product.ingredientCode);
                expect(coding1.system).to.equal('urn:oid:2.16.840.1.113883.6.233');

                expect(coding2).to.not.be.undefined();
                expect(coding2.display).to.equal(product.ingredientName);
                expect(coding2.code).to.equal(product.ingredientRole);
                expect(coding2.system).to.equal('SNOMED-CT');
            });
        });
        it('sets dosageInstruction correctly', function() {
            expect(fhirItem.dosageInstruction).to.not.be.undefined();
            expect(fhirItem.dosageInstruction.length).to.equal(1);
            expect(fhirItem.dosageInstruction[0].text).to.equal(singleRecord.sig);
            expect(fhirItem.dosageInstruction[0].route.text).to.equal(singleRecord.dosages[0].routeName);
            expect(fhirItem.dosageInstruction[0].doseQuantity.value).to.equal(parseFloat(singleRecord.dosages[0].dose));
            expect(fhirItem.dosageInstruction[0].doseQuantity.units).to.equal(singleRecord.dosages[0].units);

            describe(':: scheduledTiming', function() {
                var schedTiming = fhirItem.dosageInstruction[0].scheduledTiming;
                it('creates a propert Timing object', function() {
                    expect(schedTiming).to.not.be.undefined();
                    expect(schedTiming.repeat.frequency).to.equal(singleRecord.dosages[0].amount);
                    expect(schedTiming.repeat.period).to.equal(singleRecord.dosages[0].scheduleFreq);
                    expect(schedTiming.repeat.periodUnits).to.equal('s');
                    expect(schedTiming.code.text).to.equal(singleRecord.dosages[0].scheduleName);
                });
            });
        });
        it('sets dispense correctly', function() {
            var med = _.find(fhirItem.contained, function(item) {
                return item.resourceType === 'Medication';
            });
            expect(fhirItem.dispense).to.not.be.undefined();
            expect(fhirItem.dispense.medication.reference).to.equal('#' + med.id);
            expect(fhirItem.dispense.validityPeriod.start).to.equal(fhirUtils.convertToFhirDateTime(singleRecord.overallStart));
            expect(fhirItem.dispense.validityPeriod.end).to.equal(fhirUtils.convertToFhirDateTime(singleRecord.overallStop));
            expect(fhirItem.dispense.quantity.value).to.equal(parseFloat(singleRecord.orders[0].quantityOrdered));
            expect(fhirItem.dispense.expectedSupplyDuration.value).to.equal(singleRecord.orders[0].daysSupply);
            expect(fhirItem.dispense.expectedSupplyDuration.units).to.equal('days');
            expect(fhirItem.dispense.numberOfRepeatsAllowed).to.equal(singleRecord.orders[0].fillsAllowed);
        });
        it('omits dispense.numberOfRepeatsAllowed when the JDS object has fillsAllowed set to 0', function() {
            var fhir = MedicationPrescription.convertToMedicationPrescription(singleRecordNoFills, req._pid);
            expect(fhir.dispense.numberOfRepeatsAllowed).to.be.undefined();
        });
    });
});
