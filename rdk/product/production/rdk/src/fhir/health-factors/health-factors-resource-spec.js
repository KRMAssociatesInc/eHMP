'use strict';
var _ = require('underscore');
var HealthFactorsResource = require('./health-factors-resource');
var fhirUtils = require('../common/utils/fhir-converter');
var input = require('./health-factors-resource-spec-data');

describe('HealthFactors FHIR Resource', function() {
    var req = {
        '_pid': '9E7A;253',
        originalUrl: '/fhir/healthfactors?subject.identifier=9E7A;253',
        headers: {
            host: 'localhost:8888'
        },
        protocol: 'http'
    };

    var vprFactors = input.inputValue.data.items;
    var fhirFactors = HealthFactorsResource.getFhirItems(input.inputValue, req);

    it('verifies that given a valid VPR HealthFactors Resource converts to a defined FHIR HealthFactors Resource object', function() {
        expect(fhirFactors).not.to.be.undefined();
    });

    //------------------------------------------------------------
    //FOR EACH VPR HealthFactor found, do certain attribute checks
    //------------------------------------------------------------
    _.each(vprFactors, function(aVprFactor) {
        it('verifies that each VPR HealthFactors Resource has a coresponding FHIR HealthFactors Resource in the collection with the same uid', function() {

            var fhirRes = _.find(fhirFactors, function(rr) {
                return rr.resource.identifier[0].value === aVprFactor.uid;
            });

            expect(fhirRes).not.to.be.undefined();

            if (fhirRes !== undefined) {
                describe('Factor resource attributes', function() {
                    //CHECKING coding
                    expect(fhirRes.resource.code.coding[0].display).to.eql(aVprFactor.name);

                    //CHECKING status
                    expect(fhirRes.resource.status).to.eql('final');

                    //CHECKING pid vs patient .. may not need cause we did identifier
                    //expect(fhirRes.resource.subject.reference).to.eql('Patient/253');

                    //CHECK appliesDateTime vs stampTime
                    it('verifies that the healh factor entered date from VPR HealthFactor Resource corresponds to the one from the FHIR HealthFactor Resource', function() {
                        expect(fhirRes.resource.appliesDateTime).to.eql(fhirUtils.convertToFhirDateTime(aVprFactor.entered));
                    });

                    //CHECK performer vs Facility
                    expect(fhirRes.resource.performer[0].display).to.eql(aVprFactor.facilityName);
                });

                //CHECK contained
                describe('Contained Resources', function() {
                    it('verifies that the Organization from the VPR HealthFactor Resource exists in the contained resources from the FHIR HealthFactor Resource', function() {
                        var resOrganization = _.find(fhirRes.resource.contained, function(res) {
                            return res.resourceType === 'Organization';
                        });
                        expect(resOrganization).not.to.be.undefined();

                        if (resOrganization !== undefined && aVprFactor.facilityName !== undefined || aVprFactor.facilityCode !== undefined) {
                            expect(resOrganization.id).not.to.be.undefined();
                            expect(resOrganization.identifier[0].value).to.eql(aVprFactor.facilityCode);
                            expect(resOrganization.name).to.eql(aVprFactor.facilityName);
                        }
                    });
                });
            } //end-if (fhirRes

        }); //end-it('verifies

    }); //end-for-each

});
