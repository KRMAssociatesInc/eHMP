'use strict';

var _ = require('underscore');
var allergyResource = require('./allergy-intolerance-resource');
var inputValue = require('./allergy-intolerance-resource-spec-data').inputValue;
var fhirUtils = require('../common/utils/fhir-converter');
var rdk = require('../../core/rdk');
var nullchecker = rdk.utils.nullchecker;

function nop() {}

function createParams(_count, code, date) {
    return {
        _count: _count,
        code: code,
        date: date
    };
}

describe('AllergyIntolerance FHIR Resource', function() {

    describe('FHIR DSTU2 Mapping', function() {

        var req = {
            'pid': '10107V395912',
            originalUrl: '/fhir/allergyintolerance?subject.identifier=10107V395912',
            headers: {
                host: 'localhost:8888'
            },
            protocol: 'http'
        };

        var vprAllergies = inputValue.data.items;
        var fhirEntries = allergyResource.getFhirItems(inputValue, req);

        it('verifies that VPR test data exists', function() {
            expect(vprAllergies).to.not.be.undefined();
        });

        it('verifies that given a valid VPR Allergy Resource converts to a defined FHIR AllergyIntolerance Resource object', function() {
            expect(fhirEntries).to.not.be.undefined();
        });

        //------------------------------------------------------------
        //FOR EACH VPR AllergyIntolerance found, do certain attribute checks.
        //------------------------------------------------------------
        //CHECK Fhir mapped attributes
        _.each(vprAllergies, function(vprA) {

            it('verifies that each VPR Allergy Resource has a coresponding FHIR AllergyIntolerance Resource in the collection with the same uid', function() {
                var fhirAs = _.filter(fhirEntries, function(a) {
                    return a.resource.identifier[0].value === vprA.uid;
                });
                expect(fhirAs).to.not.be.undefined();

                //CHECKING Fhir attributes validity for each Fhir AllergyIntolerance resource item.
                _.each(fhirAs, function(fhirA) {
                    allergyIntoleranceResource(fhirA, vprA);
                });
            });
        });
    }); //end-describe('FHIR DSTU2 Mapping'

}); //end-describe('Vitals


function allergyIntoleranceResource(fhirAResoure, vprA) {
    var fhirA = fhirAResoure.resource;
    if (fhirA !== undefined) {
        describe('found FHIR AllergyIntolerance coresponds to the original VPR Allergy Resource', function() {

          //CHECKING ENTERED DATETIME
          it('verifies that the entered datetime information from VPR Allergy Resource coresponds to the recordedDate from the FHIR Allergy Resource', function() {
              expect(fhirA.recordedDate.replace('-00:00', '')).to.equal(fhirUtils.convertToFhirDateTime(vprA.entered));
          });

          //CHECKING REQUIRED PATIENT ID
          it('verifies that the pid from VPR Allergy Resource coresponds to the patient reference from the FHIR Allergy Resource', function() {
              expect(fhirA.patient.reference).to.equal('Patient/'+vprA.pid);
          });

          //CHECKING REQUIRED SUBSTANCE CODING
          if (nullchecker.isNotNullish(vprA.drugClasses) && vprA.drugClasses.length > 0) {
              it('verifies that the drugClasses coding from VPR Allergy Resource coresponds to the substance coding from the FHIR Allergy Resource', function() {
                  expect(fhirA.substance.coding[0].code).to.equal(vprA.drugClasses[0].code);
              });
          } else {
              it('verifies that the drugClasses coding from VPR Allergy Resource coresponds to the substance coding from the FHIR Allergy Resource', function() {
                  expect(fhirA.substance.coding[0].code).to.equal(vprA.codes[0].code);
              });
          }

          //CHECKING EVENTs
          it('verified that the allergy events from VPR Vitals Resource coresponds to the allergy events from the FHIR Vitals Resource', function() {
              expect(fhirA.event).to.not.be.undefined();
              expect(fhirA.event[0].substance.coding[0].code).to.equal(vprA.products[0].vuid);
              expect(fhirA.event[0].substance.coding[0].display).to.equal(vprA.products[0].name);
              expect(fhirA.event[0].manifestation.coding[0].code).to.equal(vprA.reactions[0].vuid);
              expect(fhirA.event[0].manifestation.coding[0].display).to.equal(vprA.reactions[0].name);
          });

          //CHECKING EXTENSIONS .. should always have a 'kind' extension
          it('verified that the known un-mappable attributes from VPR Vitals Resource coresponds to the from the extension attributes from FHIR Vitals Resource', function() {
              expect(fhirA.extension).to.not.be.undefined();

              _.each(fhirA.extension, function(fhirExt) {
                  if (fhirExt.url === 'http://vistacore.us/fhir/extensions/algyInt#kind') {
                      expect(fhirExt.valueString).to.equal(vprA.kind);
                      return;
                  }
              });

          });

        }); //end-describe
    }
}
