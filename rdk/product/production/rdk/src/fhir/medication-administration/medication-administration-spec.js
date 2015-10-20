'use strict';
var _ = require('underscore');
var fhirUtils = require('../common/utils/fhir-converter');
var MedAdmin = require('./medication-administration-resource');
var MedAdminIn = require('./medication-administration-spec-data').data;
var jdsInput = MedAdminIn.jdsData;

// Test for the mappings of the common elements from:
// http://www.hl7.org/FHIR/2015May/medicationadministration.html

/*
 * NOTE:  There is some code that's commented out for the time being, pending research (US8267)
 * regarding the nature of how this data is handled.  Currently, one record is split into multiple
 * FHIR items when it encounters VPR data with a 'kind' of 'Infusion' when there are multiple
 * products administered.
 *
 * Another part of that discussion is whether the nested MedicationPrescription and other
 * elements should be complete objects or just references to retrieve the additional information
 * if needed.  (With full nested objects, MedicationAdministration is one of the types that can
 * grow to a very large size, etc.
 *
 * This test can be updated when there is clarification on how these should be handled.
 * The code below had some beginnings of checking each record type as well as it's nested
 * parts.  Leaving some original looping logic the helped to find the issue(s) commented
 * out below until we know how all of this should be handled.
 *
 */

describe('Medication Administration FHIR Resource', function() {
    it('Verifies that resource is parameters are configured correctly', function() {
        var config = MedAdmin.getResourceConfig()[0];
        var params = config.parameters;
        expect(params.get).not.to.be.undefined();
        expect(params.get['subject.identifier']).not.to.be.undefined();
        expect(params.get['subject.identifier'].required).to.be.truthy();
    });
    it('Verifies correct resource name and path', function() {
        var config = MedAdmin.getResourceConfig()[0];
        expect(config.name).to.eql('medicationAdministration');
        expect(config.path).to.eql('');
    });
});

describe('Medication Administration FHIR conversion methods', function() {
    var req = {
        '_pid': '9E7A;8',
        originalUrl: '/resource/fhir/medicationadministration?subject.identifier=10110V004877',
        headers: {
            host: 'localhost:8888'
        },
        protocol: 'http'
    };

    var fhirBundle = MedAdmin.convertToFhir(jdsInput, req, null, jdsInput.data.totalItems);

    // first, lets verify the bundle structure itself.
    it('bundle results correctly', function() {
        expect(fhirBundle.resourceType).to.eql('Bundle');
        expect(fhirBundle.type).to.eql('collection');
        expect(fhirBundle.id).not.to.be.undefined();
        expect(fhirBundle.link).not.to.be.undefined();
        expect(fhirBundle.link.length).to.eql(1);
        expect(fhirBundle.link[0].relation).to.eql('self');
        expect(fhirBundle.link[0].url).to.eql('http://localhost:8888/resource/fhir/medicationadministration?subject.identifier=10110V004877');
        expect(fhirBundle.total).to.eql(3);
        expect(fhirBundle.entry).not.to.be.undefined();
        expect(fhirBundle.entry.length).to.eql(3);
    });

    // check the first item in the bundle to verify the most common remapped fields.
    var fhirItem = fhirBundle.entry[0].resource;
    var jdsItem = jdsInput.data.items[0];

    it('sets an id and resourceType for the contained MedicationAdministration correctly', function() {
        expect(fhirItem.resourceType).to.eql('MedicationAdministration');
        expect(fhirItem.id).not.to.be.undefined();
        expect(fhirItem.status).not.to.be.undefined();
    });

    it('sets an identifier correctly', function() {
        expect(fhirItem.identifier).not.to.be.undefined();
        expect(fhirItem.identifier.length).to.eql(1);
        //Commenting this out for now due to issues that are being researched. (US8267)
        //expect(fhirItem.identifier[0].value).to.eql(jdsItem.uid);
        expect(fhirItem.identifier[0].system).to.eql('urn:oid:2.16.840.1.113883.6.233');
    });

    it('sets patient reference correctly', function() {
        expect(fhirItem.patient).not.to.be.undefined();
        expect(fhirItem.patient.reference).to.eql('Patient/' + jdsItem.pid);
    });

    var expectedWasNotGiven = false;
    it('sets wasNotGiven correctly', function() {
        expect(fhirItem.wasNotGiven).not.to.be.undefined();

        if (jdsItem.dosages === null || jdsItem.dosages.length === 0) {
            expectedWasNotGiven = true;
        }
        expect(fhirItem.wasNotGiven).to.eql(expectedWasNotGiven);
    });

    if (expectedWasNotGiven === false) {
        expect(fhirItem.reasonGiven).not.to.be.undefined();
        //for the current data that VPR returns (and it's mapping), these are all identifical.
        expect(fhirItem.reasonGiven[0].text).not.to.be.undefined();
        expect(fhirItem.reasonGiven[0].text).to.eql('None');
        expect(fhirItem.reasonGiven[0].coding).not.to.be.undefined();
        expect(fhirItem.reasonGiven[0].coding[0].system).to.eql('http://hl7.org/fhir/reason-medication-given');
        expect(fhirItem.reasonGiven[0].coding[0].code).to.eql('a');
        expect(fhirItem.reasonGiven[0].coding[0].display).to.eql('None');
    } else {
        expect(fhirItem.reasonNotGiven).not.to.be.undefined();
        //for the current data that VPR returns (and it's mapping), these are all identifical.
        expect(fhirItem.reasonNotGiven[0].text).not.to.be.undefined();
        expect(fhirItem.reasonNotGiven[0].text).to.eql('None');
        expect(fhirItem.reasonNotGiven[0].coding).not.to.be.undefined();
        expect(fhirItem.reasonNotGiven[0].coding[0].system).to.eql('http://hl7.org/fhir/reason-medication-not-given');
        expect(fhirItem.reasonNotGiven[0].coding[0].code).to.eql('a');
        expect(fhirItem.reasonNotGiven[0].coding[0].display).to.eql('None');
    }

    it('sets effectiveTime or period correctly', function() {
        //effectiveTime - check and verify it if the data is present.
        if (fhirItem.effectiveTimePeriod) {
            expect(fhirItem.effectiveTimePeriod.start).to.eql(fhirUtils.convertToFhirDateTime(
                jdsItem.dosages[0].start));
            expect(fhirItem.effectiveTimePeriod.end).to.eql(fhirUtils.convertToFhirDateTime(
                jdsItem.dosages[0].stop));
        }
        if (fhirItem.effectiveTimeDateTime) {
            if (jdsItem.dosages[0].start) {
                expect(fhirItem.effectiveTimeDateTime).to.eql(fhirUtils.convertToFhirDateTime(
                    jdsItem.dosages[0].start));
            } else {
                expect(fhirItem.effectiveTimeDateTime).to.eql(fhirUtils.convertToFhirDateTime(
                    jdsItem.overallStart));
            }
        }
    });

    it('sets note correctly', function() {
        expect(fhirItem.note).to.eql(jdsItem.dosages[0].summary);
    });

    it('sets a prescription reference correctly', function() {
        expect(fhirItem.prescription.reference).not.to.be.undefined();
    });

    it('sets a practitioner reference correctly', function() {
        expect(fhirItem.practitioner.reference).not.to.be.undefined();
    });


    // Medication Prescription
    describe(':: MedicationPrescription', function() {
        var medPres = _.find(fhirItem.contained, function(item) {
            return item.resourceType === 'MedicationPrescription';
        });

        console.log(medPres);

        it('sets the id and resourceType correctly', function() {
            expect(medPres.resourceType).to.equal('MedicationPrescription');
            expect(medPres.id).to.not.be.undefined();
        });

        it('sets identifier correctly', function() {
            expect(medPres.identifier).not.to.be.undefined();
            expect(medPres.identifier.length).to.eql(1);
            //commented out due to issue described above...
            //expect(medPres.identifier[0].value).to.eql(jdsInput.data.items[i].uid);
            expect(medPres.identifier[0].system).to.eql('urn:oid:2.16.840.1.113883.6.233');
        });

        it('sets note correctly', function() {
            expect(medPres.note).to.eql(jdsItem.summary);
        });

        it('sets patient reference correctly', function() {
            expect(fhirItem.patient.reference).to.equal('Patient/' + req._pid);
        });

        it('sets prescriber reference correctly', function() {
            expect(medPres.prescriber.reference).to.eql('Provider/' + jdsItem.orders[0].providerUid);
        });

        it('sets dateWritten correctly', function() {
            expect(medPres.dateWritten).to.eql(fhirUtils.convertToFhirDateTime(jdsItem.orders[0].ordered));
        });

        it('sets dosageInstruction correctly', function() {
            expect(medPres.dosageInstruction).to.not.be.undefined();
            expect(medPres.dosageInstruction.length).to.equal(1);
            expect(medPres.dosageInstruction[0].text).to.equal(jdsItem.sig);
            expect(medPres.dosageInstruction[0].route.text).to.equal(jdsItem.dosages[0].routeName);
            expect(medPres.dosageInstruction[0].doseQuantity.value).to.equal(parseFloat(jdsItem.dosages[0].dose));
            expect(medPres.dosageInstruction[0].doseQuantity.units).to.equal(jdsItem.dosages[0].units);

            describe(':: scheduledTiming', function() {
                var schedTiming = medPres.dosageInstruction[0].scheduledTiming;
                it('creates a propert Timing object', function() {
                    expect(schedTiming).to.not.be.undefined();
                    expect(schedTiming.repeat.frequency).to.equal(jdsItem.dosages[0].amount);
                    expect(schedTiming.repeat.period).to.equal(jdsItem.dosages[0].scheduleFreq);
                    expect(schedTiming.repeat.periodUnits).to.equal('s');
                    expect(schedTiming.code.text).to.equal(jdsItem.dosages[0].scheduleName);
                });
            });
        });
        it('sets dispense correctly', function() {
            expect(medPres.dispense).to.not.be.undefined();
            //Medication is not currently mapped to this, but likely should be.
            //expect(medPres.dispense.medication.reference).to.equal('#' + med.id);
            expect(medPres.dispense.validityPeriod.start).to.equal(fhirUtils.convertToFhirDateTime(jdsItem.overallStart));
            expect(medPres.dispense.validityPeriod.end).to.equal(fhirUtils.convertToFhirDateTime(jdsItem.overallStop));
            expect(medPres.dispense.quantity.value).to.equal(parseFloat(jdsItem.orders[0].quantityOrdered));
            expect(medPres.dispense.expectedSupplyDuration.value).to.equal(jdsItem.orders[0].daysSupply);
            expect(medPres.dispense.expectedSupplyDuration.units).to.equal('days');
            //Fills allowed is not currently mapped to this, but likely should be.
            //expect(medPres.dispense.numberOfRepeatsAllowed).to.equal(jdsItem.orders[0].fillsAllowed);
        });

        // Medication
        describe(':: Medication', function() {
            var med = _.find(medPres.contained, function(item) {
                return item.resourceType === 'Medication';
            });

            it('sets name correctly', function() {
                expect(med.name).to.eql(jdsItem.name);
            });

            it('sets code text correctly', function() {
                expect(med.code.text).to.eql(jdsItem.codes[0].display);
            });

            it('sets code correctly', function() {
                expect(med.code.coding[0].code).to.eql(jdsItem.codes[0].code);
                expect(med.code.coding[0].display).to.eql(jdsItem.codes[0].display);
                expect(med.code.coding[0].system).to.eql(jdsItem.codes[0].system);
            });

            it('sets product form correctly', function() {
                expect(med.product.form.text).to.eql(jdsItem.productFormName);
            });

            it('sets product ingredient correctly', function() {
                expect(med.product.ingredient[0].item.reference).not.to.be.undefined();
                expect(med.product.ingredient[0].item.display).to.eql(jdsItem.products[0].ingredientName);
            });

            // Substance
            describe(':: Substance', function() {
                var sub = _.find(med.contained, function(item) {
                    return item.resourceType === 'Substance';
                });

                it('sets the id and resourceType correctly', function() {
                    expect(sub.resourceType).to.equal('Substance');
                    expect(sub.id).to.not.be.undefined();
                });

                it('sets the description correctly', function() {
                    expect(sub.description).to.eql(jdsItem.products[0].suppliedName);
                });

                it('sets the type correctly', function() {
                    expect(sub.type.text).to.eql(jdsItem.products[0].suppliedName);

                    expect(sub.type.coding[0].code).to.eql(jdsItem.products[0].ingredientCode);
                    expect(sub.type.coding[0].display).to.eql(jdsItem.products[0].ingredientCodeName);
                    expect(sub.type.coding[0].system).to.eql('urn:oid:2.16.840.1.113883.6.233');
                });
            });
        });
    });
});

//
// Checking each of the records in the sample data set.
//
/*
_.each(fhirBundle.entry, function(entry, i) {

    it('sets patient reference correctly', function() {
        expect(entry.resource.patient).not.to.be.undefined();
        expect(entry.resource.patient.reference).to.eql('Patient/' + jdsInput.data.items[i].pid);
    });

    //First, lets do some basic checks on the contained MedicationPrescription
    var medPrescription = _.find(entry.resource.contained, function(item) {
        return item.resourceType === 'MedicationPrescription';
    });

    it('sets the id and resourceType correctly', function() {
        expect(medPrescription.resourceType).to.eql('MedicationPrescription');
        expect(medPrescription.id).not.to.be.undefined();
    });
    it('sets identifier correctly', function() {
        expect(medPrescription.identifier).not.to.be.undefined();
        expect(medPrescription.identifier.length).to.eql(1);
        //expect(medPrescription.identifier[0].value).to.eql(jdsInput.data.items[i].uid);
        expect(medPrescription.identifier[0].system).to.eql('urn:oid:2.16.840.1.113883.6.233');
    });
    it('sets dateWritten correctly', function() {
        expect(medPrescription.dateWritten).to.eql(fhirUtils.convertToFhirDateTime(jdsInput.data.items[i].orders[0].ordered));
    });
    it('sets prescriber reference correctly', function() {
        expect(medPrescription.prescriber.reference).to.eql('Provider/' + jdsInput.data.items[i].orders[0].providerUid);
    });
    it('sets prescription note correctly', function() {
        expect(medPrescription.note).to.eql(jdsInput.data.items[i].summary);
    });

    var medication = _.find(medPrescription.contained, function(item) {
        return item.resourceType === 'Medication';
    });

    var substance = _.find(medication.contained, function(item) {
        return item.resourceType === 'Substance';
    });

    it('sets a practitioner reference correctly', function() {
        expect(entry.resource.practitioner).not.to.be.undefined();
    });

    it('sets an identifier correctly', function() {
        expect(entry.resource.identifier).not.to.be.undefined();
        expect(entry.resource.identifier.length).to.eql(1);
        //There is a problem with this sometimes having a :1 or :2 after it - research this.
        //expect(entry.resource.identifier[0].value).to.eql(jdsInput.data.items[i].uid);
        expect(entry.resource.identifier[0].system).to.eql('urn:oid:2.16.840.1.113883.6.233');
    });

    it('sets effectiveTime or Period correctly', function() {
        //effectiveTime - check and verify it if the data is present.
        if(entry.effectiveTimePeriod) {
            expect(entry.resource.effectiveTimePeriod.start).to.eql(fhirUtils.convertToFhirDateTime(
                jdsInput.data.items[i].dosages[0].start)
            );
            expect(entry.resource.effectiveTimePeriod.end).to.eql(fhirUtils.convertToFhirDateTime(
                jdsInput.data.items[i].dosages[0].stop)
            );
        }
        if(entry.effectiveTimeDateTime) {
            if(jdsInput.data.items[i].dosages[0].start) {
                expect(entry.resource.effectiveTimeDateTime).to.eql(fhirUtils.convertToFhirDateTime(
                jdsInput.data.items[i].dosages[0].start));
            } else {
                expect(entry.resource.effectiveTimeDateTime).to.eql(fhirUtils.convertToFhirDateTime(
                jdsInput.data.items[i].overallStart));
            }
        }
    });

    it('sets note correctly', function() {
        expect(fhirItem.note).to.eql(jdsInput.data.items[i].dosages[0].summary);
    });

});
*/
