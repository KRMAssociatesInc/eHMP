'use strict';
var Educations = require('./educations-resource');
var EducationsIn = require('./educations-resource-spec-data').data;
var jdsInput = EducationsIn.jdsData;

describe('Educations FHIR Resource', function() {
    it('Verifies that resource is parameters are configured correctly', function() {
        var config = Educations.getResourceConfig()[0];
        var params = config.parameters;
        expect(params.get).not.to.be.undefined();
        expect(params.get['subject.identifier']).not.to.be.undefined();
        expect(params.get['subject.identifier'].required).to.be.truthy();
    });
    it('Verifies correct resource name and path', function() {
        var config = Educations.getResourceConfig()[0];
        expect(config.name).to.eql('educations');
        expect(config.path).to.eql('');
    });
});

describe('Educations FHIR conversion methods', function() {
    var req = {
        '_pid': '9E7A;253',
        originalUrl: '/fhir/educations?subject.identifier=11016V630869',
        headers: {
            host: 'localhost:8888'
        },
        protocol: 'http'
    };
    var fhirBundle = Educations.buildBundle(jdsInput.data.items, req, jdsInput.data.totalItems);

    it('bundle results correctly', function() {
        expect(fhirBundle.resourceType).to.eql('Bundle');
        expect(fhirBundle.type).to.eql('collection');
        expect(fhirBundle.id).not.to.be.undefined();
        expect(fhirBundle.link).not.to.be.undefined();
        expect(fhirBundle.link.length).to.eql(1);
        expect(fhirBundle.link[0].relation).to.eql('self');
        expect(fhirBundle.link[0].url).to.eql('http://localhost:8888/fhir/educations?subject.identifier=11016V630869');
        expect(fhirBundle.total).to.eql(99);
        expect(fhirBundle.entry).not.to.be.undefined();
        expect(fhirBundle.entry.length).to.eql(2);
    });

    describe(':: Educations', function() {
        var fhirItem = Educations.createItem(jdsInput.data.items[0], req._pid);

        it('sets the resourceType correctly', function() {
            expect(fhirItem.resourceType).to.eql('Procedure');
        });
        it('sets identifier correctly', function() {
            expect(fhirItem.identifier).not.to.be.undefined();
            expect(fhirItem.identifier.length).to.eql(1);
            expect(fhirItem.identifier[0].value).to.eql(jdsInput.data.items[0].uid);
            expect(fhirItem.identifier[0].system).to.eql('http://vistacore.us/fhir/id/uid');
        });
        it('sets patient reference correctly', function() {
            expect(fhirItem.patient.reference).to.eql('Patient/' + req._pid);
        });
        it('sets other fields correctly', function() {
            expect(fhirItem.text).not.to.be.undefined();
            expect(fhirItem.status).not.to.be.undefined();
            expect(fhirItem.type).not.to.be.undefined();
            expect(fhirItem.encounter).not.to.be.undefined();
            expect(fhirItem.location).not.to.be.undefined();
            expect(fhirItem.outcome).not.to.be.undefined();
        });
    });
});
