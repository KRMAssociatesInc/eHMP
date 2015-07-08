/*jslint node: true */
/*jshint -W098 */
'use strict';

var request = require('request');
var _ = require('underscore');
var qb = require('../utils/uribuilder/uriBuilder');

var port = '8888' || process.env.RDK_PORT;
var host = 'localhost' || process.env.RDK_HOST;
var resourceDirectoryUrl = 'http://' + host + ':' + port + '/resourcedirectory';

/* 
in general, probably not good practice to have a chained 
set of tests like this, but I will do so to
perform a smoke test against various services
*/

describe('Resource Server (smoke-test)', function(test) {
    var resourceDirectory;

    // it('has a resource directory', function() {
    //     var resourceDirectoryResult;

    //     runs(function() {
    //         request(resourceDirectoryUrl, function(error, response, body) {
    //             if (error) {
    //                 resourceDirectoryResult = {};
    //                 resourceDirectoryResult.error = error;
    //             } else {
    //                 console.log('status code:' + response.statusCode);
    //                 resourceDirectoryResult = {};
    //                 resourceDirectoryResult.error = error;
    //                 resourceDirectoryResult.response = response;
    //                 resourceDirectoryResult.body = body;
    //             }
    //         });
    //     });

    //     waitsFor(function() {
    //         return (resourceDirectoryResult);
    //     }, 'http resource directory returns any result', 5000);

    //     runs(function() {
    //         expect(resourceDirectoryResult.error).toBeFalsy();
    //         expect(resourceDirectoryResult.response.statusCode).toBe(200);
    //         resourceDirectory = {};
    //         resourceDirectory.links = JSON.parse(resourceDirectoryResult.body).link;
    //         resourceDirectory.findByTitle = function(title) {
    //             return _.find(this.links, function(link) {
    //                 return title === link.title;
    //             });
    //         };
    //     });
    // });

    var patientSearchLink;
    // it('resource directory contains link to patient search', function() {
    //     patientSearchLink = resourceDirectory.findByTitle('patient-search-full-name');
    //     expect(patientSearchLink).toBeDefined();
    // });

    // it('resource directory does not contain link to under water basket weaving', function() {
    //     expect(resourceDirectory.findByTitle('under-water-basket-weaving')).toBeUndefined();
    // });

    var testPatient;
    // it('able to perform patient search', function() {
    //     var searchCriteria = 'eight';
    //     var testPatientName = 'EIGHT,PATIENT';
    //     var expectedTestPatientPid = '10108';
    //     //http://localhost:9898/patient-search?fullName=eig&itemsPerPage=20
    //     var patientSearchUrl = qb.fromUri(patientSearchLink.href).query('fullName', 'eight').build();

    //     var patientSearchResult;
    //     runs(function() {
    //         request(patientSearchUrl, function(error, response, body) {
    //             if (error) {
    //                 patientSearchResult = {};
    //                 patientSearchResult.error = error;
    //             } else {
    //                 patientSearchResult = {};
    //                 patientSearchResult.error = error;
    //                 patientSearchResult.response = response;
    //                 patientSearchResult.body = body;
    //             }
    //         }).auth('9E7A;pu1234', 'pu1234!!');
    //     });

    //     waitsFor(function() {
    //         return (patientSearchResult);
    //     }, 'patient search result returns', 5000);

    //     runs(function() {
    //         expect(patientSearchResult.error).toBeFalsy();
    //         expect(patientSearchResult.response.statusCode).toBe(200);

    //         var patientSearchResultData = JSON.parse(patientSearchResult.body).data.items;
    //         expect(patientSearchResultData.length).toBe(10);

    //         testPatient = _.find(patientSearchResultData, function(patient) {
    //             return testPatientName === patient.fullName;
    //         });

    //         expect(testPatient).toBeDefined();
    //         expect(testPatient.pid).toBe(expectedTestPatientPid);
    //     });
    // });

    // it('able to retrieve allergies for patient', function() {
    //     var allergiesUrl = qb.fromUri(resourceDirectory.findByTitle('patient-record-allergy').path).query('pid', testPatient.pid).build();

    //     var allergiesResult;
    //     runs(function() {
    //         request(allergiesUrl, function(error, response, body) {
    //             if (error) {
    //                 allergiesResult = {};
    //                 allergiesResult.error = error;
    //             } else {
    //                 allergiesResult = {};
    //                 allergiesResult.error = error;
    //                 allergiesResult.response = response;
    //                 allergiesResult.body = body;
    //             }
    //         });
    //     });

    //     waitsFor(function() {
    //         return (allergiesResult);
    //     }, 'allergies result returns', 5000);

    //     runs(function() {
    //         var testAllergyUid = 'urn:va:allergy:DOD:0000000003:1000000340';
    //         var testAllergySummary = 'Penicillins';
    //         expect(allergiesResult.error).toBeFalsy();
    //         expect(allergiesResult.response.statusCode).toBe(200);

    //         var allergiesResultData = JSON.parse(allergiesResult.body).data.items;
    //         expect(allergiesResultData.length).toBe(5);

    //         var testAllergy = _.find(allergiesResultData, function(allergy) {
    //             return testAllergyUid === allergy.uid;
    //         });

    //         expect(testAllergy).toBeDefined();
    //         expect(testAllergy.summary).toBe(testAllergySummary);
    //     });
    // });
});
