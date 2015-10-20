'use strict';

var _ = require('underscore');
var ReferralRequestResource = require('./referral-request-resource');
var referralRequest = require('./referral-request');
var inputValue = require('./referral-request-resource-spec-data').inputValue;
var singleRecord = inputValue.data.items[0];
var fhirUtils = require('../common/utils/fhir-converter');

var req = {
    '_pid': '9E7A;253',
    query: {
        'subject.identifier': '9E7A;253'
    },
    headers: {
        host: 'localhost:8888'
    },
    protocol: 'http',
    param: function() {
        return '9E7A;253';
    },
    originalUrl: '/fhir/ReferralRequest?subject.identifier=9E7A;253'
};

function statusToFhirStatus(status) {
    var jdsRecord = _.clone(singleRecord);
    jdsRecord.statusName = status;
    return referralRequest.convertToReferralRequest(jdsRecord, req).status;
}

describe('ReferralRequest FHIR Resource', function() {
    var config = ReferralRequestResource.getResourceConfig()[0];
    var params = config.parameters;
    expect(params.get).to.not.be.undefined();
    expect(params.get['subject.identifier']).to.not.be.undefined();
    expect(params.get['subject.identifier'].required).to.be.truthy();
    expect(params.get.start).to.not.be.undefined();
    expect(params.get.start.required).to.be.falsy();
    expect(params.get.limit).to.not.be.undefined();
    expect(params.get.limit.required).to.be.falsy();
});

describe('ReferralRequest FHIR conversion methods', function() {
    var vprConsultations = inputValue.data.items;
    var fhirBundle = referralRequest.convertToFhir(inputValue, req);
    var fhirItems = fhirBundle.entry;

    it('bundle results correctly', function() {
        expect(fhirBundle.resourceType).to.equal('Bundle');
        expect(fhirBundle.type).to.equal('collection');
        expect(fhirBundle.id).to.not.be.undefined();
        expect(fhirBundle.link).to.not.be.undefined();
        expect(fhirBundle.link.length).to.equal(1);
        expect(fhirBundle.link[0].relation).to.equal('self');
        expect(fhirBundle.link[0].url).to.equal('http://localhost:8888/fhir/ReferralRequest?subject.identifier=9E7A;253');
        expect(fhirBundle.total).to.equal(35);
        expect(fhirBundle.entry).to.not.be.undefined();
        expect(fhirBundle.entry.length).to.equal(6);
    });

    _.each(vprConsultations, function(vprItem) {
        describe(':: ReferralRequest ::', function() {
            var entry = _.find(fhirItems, function(fItem) {
                return fItem.resource.identifier.value === vprItem.uid;
            });
            expect(entry).to.not.be.undefined();
            var fhirItem = entry.resource;
            expect(fhirItem).to.not.be.undefined();

            it('sets id and resourceType correctly', function() {
                expect(fhirItem.resourceType).to.equal('ReferralRequest');
                expect(fhirItem.id).to.not.be.undefined();
            });
            it('sets status correctly', function() {
                expect(statusToFhirStatus('ACTIVE')).to.equal('active');
                expect(statusToFhirStatus('CANCELLED')).to.equal('cancelled');
                expect(statusToFhirStatus('EXPIRED')).to.equal('cancelled');
                expect(statusToFhirStatus('COMPLETE')).to.equal('completed');
                expect(statusToFhirStatus('SCHEDULED')).to.equal('requested');
                expect(statusToFhirStatus('-anything-else-')).to.equal('draft'); // test the default case
                expect(statusToFhirStatus('')).to.equal('draft'); // test the default case
            });
            it('sets identifier correctly', function() {
                expect(fhirItem.identifier).to.not.be.undefined();
                expect(fhirItem.identifier.system).to.equal('urn:oid:2.16.840.1.113883.6.233');
                expect(fhirItem.identifier.value).to.equal(vprItem.uid);
            });
            it('sets type correctly', function() {
                expect(fhirItem.type).to.not.be.undefined();
                expect(fhirItem.type.text).to.equal(vprItem.consultProcedure);
            });
            it('sets specialty correctly', function() {
                expect(fhirItem.specialty).to.not.be.undefined();
                expect(fhirItem.specialty.text).to.equal(vprItem.service);
            });
            it('sets priority correctly', function() {
                expect(fhirItem.priority).to.not.be.undefined();
                expect(fhirItem.priority.text).to.equal(vprItem.urgency);
            });
            it('sets patient correctly', function() {
                expect(fhirItem.patient).to.not.be.undefined();
                expect(fhirItem.patient.reference).to.equal('Patient/' + vprItem.pid);
            });
            it('sets requester correctly', function() {
                expect(fhirItem.requester).to.not.be.undefined();
                expect(fhirItem.requester.reference).to.equal('Provider/' + vprItem.providerUid);
            });
            it('sets recipient correctly', function() {
                expect(fhirItem.recipient).to.not.be.undefined();
                expect(fhirItem.recipient.length).to.equal(vprItem.activity.length);
                // there should be a recipient entry for every activity
                _.forEach(fhirItem.recipient, function(recipient) {
                    expect(recipient.display).to.not.be.undefined();
                    var responsible = _.find(vprItem.activity, function(activity) {
                        return activity.responsible === recipient.display;
                    });
                    expect(responsible).to.not.be.undefined();
                });
            });
            it('sets dateSent correctly', function() {
                expect(fhirItem.dateSent).to.equal(fhirUtils.convertToFhirDateTime(vprItem.dateTime));
            });
            it('sets reason correctly', function() {
                expect(fhirItem.reason).to.not.be.undefined();
                expect(fhirItem.reason.text).to.equal(vprItem.reason);
            });
            it('sets serviceRequested correctly', function() {
                expect(fhirItem.serviceRequested).to.not.be.undefined();
                expect(fhirItem.serviceRequested.text).to.equal(vprItem.service);
            });
        });
    });
});
