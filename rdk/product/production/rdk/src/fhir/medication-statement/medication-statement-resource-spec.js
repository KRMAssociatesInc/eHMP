'use strict';
var _ = require('underscore');
var MedicationStatementResource = require('./medication-statement-resource');
var MedStatementObjects = require('./medication-statement-objects');
var MedStatementIn = require('./medication-statement-resource-spec-data').data;
var jdsInput = MedStatementIn.jdsData;
var singleRecord = MedStatementIn.singleRecord;

var map = {
    vaStatus: {
        'DISCONTINUED': 'stopped',
        'HOLD': 'on hold',
        'FLAGGED': 'on hold',
        'PENDINNG': 'in progress',
        'ACTIVE': 'in progress',
        'DELAYED': 'on hold',
        'UNRELEASED': 'in progress',
        'DISCONTINUED/EDIT': 'stopped',
        'CANCELLED': 'stopped',
        'LAPSED': 'stopped',
        'RENEWED': 'in progress',
        'NO STATUS': 'on hold',
        '_default_': 'completed'
    },
    getvaStatus: function(vaStatus) {
        return this.vaStatus[vaStatus] || this.vaStatus._default_;
    },
    routeName: {
        'AP': ['Apply Externally', 'TODO'],
        'B': ['Buccal', 'TODO'],
        'DT': ['Dental', 'TODO'],
        'EP': ['Epidural', 'TODO'],
        'ET': ['Endotrachial Tube', 'TODO'],
        'GTT': ['Gastrostomy Tube', 'TODO'],
        'GU': ['GU Irrigant', 'TODO'],
        'IA': ['Intra-arterial', 'TODO'],
        'IB': ['Intrabursal', 'TODO'],
        'IC': ['Intracardiac', 'TODO'],
        'ICV': ['Intracervical (uterus)', 'TODO'],
        'ID': ['Intradermal', 'TODO'],
        'IH': ['Inhalation', 'TODO'],
        'IHA': ['Intrahepatic Artery', 'TODO'],
        'IM': ['Intramuscular', 'TODO'],
        'IMR': ['Immerse (Soak) Body Part', 'TODO'],
        'IN': ['Intranasal', 'TODO'],
        'IO': ['Intraocular', 'TODO'],
        'IP': ['Intraperitoneal', 'TODO'],
        'IS': ['Intrasynovial', 'TODO'],
        'IT': ['Intrathecal', 'TODO'],
        'IU': ['Intrauterine', 'TODO'],
        'IV': ['Intravenous', 'TODO'],
        'MM': ['Mucous Membrane', 'TODO'],
        'MTH': ['Mouth/Throat', 'TODO'],
        'NG': ['Nasogastric', 'TODO'],
        'NP': ['Nasal Prongs', 'TODO'],
        'NS': ['Nasal', 'TODO'],
        'NT': ['Nasotrachial Tube', 'TODO'],
        'OP': ['Ophthalmic', 'TODO'],
        'OT': ['Otic', 'TODO'],
        'OTH': ['Other/Miscellaneous', 'TODO'],
        'PF': ['Perfusion', 'TODO'],
        'PO': ['Oral', 'TODO'],
        'PR': ['Rectal', 'TODO'],
        'RM': ['Rebreather Mask', 'TODO'],
        'SC': ['Subcutaneous', 'TODO'],
        'SD': ['Soaked Dressing', 'TODO'],
        'SL': ['Sublingual', 'TODO'],
        'TD': ['Transdermal', 'TODO'],
        'TL': ['Translingual', 'TODO'],
        'TP': ['Topical', 'TODO'],
        'TRA': ['Tracheostomy', 'TODO'],
        'UR': ['Urethral', 'TODO'],
        'VG': ['Vaginal', 'TODO'],
        'VM': ['Ventimask', 'TODO'],
        'WND': ['Wound', 'TODO']
    },
    getrouteNameDesc: function(jdsCode) {

        return (this.routeName[jdsCode]) ? this.routeName[jdsCode][0] : jdsCode;
    },
    getrouteNameFhir: function(jdsCode) {
        return (this.routeName[jdsCode]) ? this.routeName[jdsCode][1] : jdsCode;
    },
    vaType: {
        'I': 'Inpatient',
        'N': 'Non-Va',
        'O': 'Outpatient',
        'V': 'IV'
    },
    medStatusName: {
        'historical': 'completed',
        'not active': 'entered-in-error', // ?? DSTU1 used to have: 'stopped'
        'hold': 'entered-in-error', // ?? DSTU1 used to have: 'on hold'
        'active': 'in-progress',
        '_default_': 'entered-in-error' // ?? DSTU2 spec has no default setting
    },
    getmedStatusName: function(medStatusName) {
        return this.medStatusName[medStatusName] || this.medStatusName._default_;
    }
};

describe('Medication Statement FHIR Resource', function() {
    it('Verifies that resource is parameters are configured correctly', function() {
        var config = MedicationStatementResource.getResourceConfig()[0];
        var params = config.parameters;
        expect(params.get).to.not.be.undefined();
        expect(params.get['subject.identifier']).to.not.be.undefined();
        expect(params.get['subject.identifier'].required).to.be.truthy();
    });
    it('Verifies correct resource name and path', function() {
        var config = MedicationStatementResource.getResourceConfig()[0];
        expect(config.name).to.equal('getMedicationStatement');
        expect(config.path).to.equal('');
    });
});

describe('MedicationStatement FHIR conversion methods', function() {
    var req = {
        '_pid': '9E7A;253',
        originalUrl: '/resource/fhir/medicationstatement?subject.identifier=10107V395912',
        headers: {
            host: 'localhost:8888'
        },
        protocol: 'http'
    };
    var fhirBundle = MedStatementObjects.buildBundle(jdsInput.data.items, req, jdsInput.data.totalItems);

    it('bundle results correctly', function() {
        expect(fhirBundle.resourceType).to.equal('Bundle');
        expect(fhirBundle.type).to.equal('collection');
        expect(fhirBundle.id).to.not.be.undefined();
        expect(fhirBundle.link).to.not.be.undefined();
        expect(fhirBundle.link.length).to.equal(1);
        expect(fhirBundle.link[0].relation).to.equal('self');
        expect(fhirBundle.link[0].url).to.equal('http://localhost:8888/resource/fhir/medicationstatement?subject.identifier=10107V395912');
        expect(fhirBundle.total).to.equal(2);
        expect(fhirBundle.entry).to.not.be.undefined();
        expect(fhirBundle.entry.length).to.equal(2);
    });

    // 'Medication Statement' Object

    describe(':: MedicationStatement', function() {
        var jdsSingle = singleRecord.data.items[0];
        var fhirItems = MedStatementObjects.convertToFhir(singleRecord.data.items, req);
        var fhirItem = fhirItems[0];

        it('sets the resourceType correctly', function() {
            expect(fhirItem.resourceType).to.equal('MedicationStatement');
        });

        it('sets the resourceType correctly', function() {
            expect(fhirItem.status).to.equal(map.getmedStatusName(jdsSingle.medStatusName));
        });

        it('sets patient reference correctly', function() {
            expect(fhirItem.patient.reference).to.equal('Patient/' + req._pid);
        });

        it('sets an identifier correctly', function() {
            expect(fhirItem.identifier).not.to.be.undefined();
            expect(fhirItem.identifier.value).to.eql(jdsSingle.uid);
            expect(fhirItem.identifier.system).to.eql('urn:oid:2.16.840.1.113883.6.233');
        });

        it('sets an information source correctly', function() {
            expect(fhirItem.informationSource).not.to.be.undefined();
            expect(fhirItem.informationSource.reference).to.eql('Practitioner/' + jdsSingle.orders[0].providerUid);
        });

        it('sets wasNotGiven correctly', function() {
            expect(fhirItem.wasNotGiven).not.to.be.undefined();
            expect(fhirItem.wasNotGiven).to.eql(false);
        });

        it('sets effectivePeriod correctly', function() {
            expect(fhirItem.effectivePeriod).not.to.be.undefined();
        });

        it('sets note correctly', function() {
            expect(fhirItem.note).to.equal(jdsSingle.summary);
        });

        it('constructs a proper dosage object', function() {

            var dosage = jdsSingle.dosages[0];
            expect(fhirItem.dosage.text).to.equal(dosage.summary);

            expect(fhirItem.dosage.schedule).not.to.be.undefined();

            var schedule = fhirItem.dosage.schedule;
            expect(schedule).not.to.be.undefined();
            expect(schedule.repeat.frequency).to.equal(dosage.scheduleFreq);
            expect(schedule.code.text).to.equal(dosage.scheduleName);
            expect(schedule.code.coding[0].code).to.equal(dosage.scheduleName);
            expect(schedule.code.coding[0].display).to.equal(dosage.scheduleName);

            var route = fhirItem.dosage.route;
            expect(route).not.to.be.undefined();
            expect(route.text).to.equal(map.getrouteNameDesc(dosage.routeName));
            expect(route.coding[0].code).to.equal(dosage.routeName);
            expect(route.coding[0].display).to.equal(map.getrouteNameDesc(dosage.routeName));
            expect(route.coding[0].system).to.equal('urn:oid:2.16.840.1.113883.6.233');

            expect(fhirItem.dosage.quantity).not.to.be.undefined();
            expect(fhirItem.dosage.quantity.value).to.equal(parseInt(dosage.dose));
            expect(fhirItem.dosage.quantity.units).to.equal(dosage.units);

        });

        // Nested 'Medication' Object

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
                expect(fhirItem.medication.display).to.equal(jdsSingle.name);
            });

            it('constructs a proper Medication object', function() {
                expect(med.name).to.equal(jdsSingle.name);
                expect(med.code.text).to.equal(jdsSingle.codes[0].code + '/' + jdsSingle.codes[0].display);
                expect(med.code.coding[0].code).to.equal(jdsSingle.codes[0].code);
                expect(med.code.coding[0].display).to.equal(jdsSingle.codes[0].display);
                expect(med.code.coding[0].system).to.equal(jdsSingle.codes[0].system);
                expect(med.product.form.text).to.equal(jdsSingle.productFormName);
                expect(med.product.ingredient[0].item.display).to.equal(jdsSingle.products[0].ingredientName);
            });

            it('sets substance reference correctly', function() {
                expect(substance).to.not.be.undefined();
                expect(med.product.ingredient[0].item.reference).to.equal('#' + substance.id);
            });

            it('constructs a proper Substance object', function() {
                var product = jdsSingle.products[0];
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

    });

});
