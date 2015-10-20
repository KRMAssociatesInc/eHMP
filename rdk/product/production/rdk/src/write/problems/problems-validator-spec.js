'use strict';

var _ = require('underscore');
var ProblemsValidator = require('./problems-validator').ProblemsValidator;

describe('Problems input validator', function () {


    describe ('Problems valid input', function () {

        it ('patient IEN is present', function () {
            var input = {
                "MST" : "No",
                "comments": [ "test comment one", "test comment two"],
                "dateOfOnset": "20141113",
                "dateRecorded": "20141113",
                "enteredBy": "USER,PANORAMA",
                "enteredByIEN": "10000000226",
                "headOrNeckCancer": "No",
                "lexiconCode": "",
                "patientIEN": "100615",
                "patientName": "EIGHT,OUTPATIENT",
                "problemName": "soven test",
                "problemText": "soven test",
                "providerIEN": "10000000226",
                "recordingProvider": "USER,PANORAMA",
                "responsibleProvider": "USER,PANORAMA",
                "responsibleProviderIEN": "10000000226",
                "serviceConnected": "64^AUDIOLOGY",
                "status": "A^ACTIVE",
                "userIEN": "11010V543403"
            };

            var validator = new ProblemsValidator(input);
            expect(validator.isValid()).to.equal(true);
        });

        it ('patient name is present', function () {
            var input = {
                "MST" : "No",
                "comments": [ "test comment one", "test comment two"],
                "dateOfOnset": "20141113",
                "dateRecorded": "20141113",
                "enteredBy": "USER,PANORAMA",
                "enteredByIEN": "10000000226",
                "headOrNeckCancer": "No",
                "lexiconCode": "",
                "patientIEN": "100615",
                "patientName": "EIGHT,OUTPATIENT",
                "problemName": "soven test",
                "problemText": "soven test",
                "providerIEN": "10000000226",
                "recordingProvider": "USER,PANORAMA",
                "responsibleProvider": "USER,PANORAMA",
                "responsibleProviderIEN": "10000000226",
                "serviceConnected": "64^AUDIOLOGY",
                "status": "A^ACTIVE",
                "userIEN": "11010V543403"
            };

            var validator = new ProblemsValidator(input);
            expect(validator.isValid()).to.equal(true);
        });

        it ('missing patient IEN and problem name', function () {
            var input = {
                "MST" : "No",
                "comments": [ "test comment one", "test comment two"],
                "dateOfOnset": "20141113",
                "dateRecorded": "20141113",
                "enteredBy": "USER,PANORAMA",
                "enteredByIEN": "10000000226",
                "headOrNeckCancer": "No",
                "lexiconCode": "",
                "patientName": "EIGHT,OUTPATIENT",
                "problemText": "soven test",
                "providerIEN": "10000000226",
                "recordingProvider": "USER,PANORAMA",
                "responsibleProvider": "USER,PANORAMA",
                "responsibleProviderIEN": "10000000226",
                "serviceConnected": "64^AUDIOLOGY",
                "status": "A^ACTIVE",
                "userIEN": "11010V543403"
            };

            var validator = new ProblemsValidator(input);
            expect(validator.isValid()).to.equal(false);
            expect(_.size(validator.getErrors())).eql(2);
            var errors = validator.getErrors();
            errors = errors.join(';');
            expect(errors).eql('patient IEN is missing;problem name is missing');
        });

        it ('missing status', function () {
            var input ={
                "MST" : "No",
                "comments": [ "test comment one", "test comment two"],
                "dateOfOnset": "20141113",
                "dateRecorded": "20141113",
                "enteredBy": "USER,PANORAMA",
                "enteredByIEN": "10000000226",
                "headOrNeckCancer": "No",
                "lexiconCode": "",
                "patientIEN": "100615",
                "patientName": "EIGHT,OUTPATIENT",
                "problemName": "soven test",
                "problemText": "soven test",
                "providerIEN": "10000000226",
                "recordingProvider": "USER,PANORAMA",
                "responsibleProvider": "USER,PANORAMA",
                "responsibleProviderIEN": "10000000226",
                "serviceConnected": "64^AUDIOLOGY",
                "userIEN": "11010V543403"
            };

            var validator = new ProblemsValidator(input);
            expect(validator.isValid()).to.equal(false);
            expect(_.size(validator.getErrors())).eql(1);
        });

        it ('missing provider IEN input', function () {
            var input = {
                "MST" : "No",
                "comments": [ "test comment one", "test comment two"],
                "dateOfOnset": "20141113",
                "dateRecorded": "20141113",
                "enteredBy": "USER,PANORAMA",
                "enteredByIEN": "10000000226",
                "headOrNeckCancer": "No",
                "lexiconCode": "",
                "patientIEN": "100615",
                "patientName": "EIGHT,OUTPATIENT",
                "problemName": "soven test",
                "problemText": "soven test",
                "recordingProvider": "USER,PANORAMA",
                "responsibleProvider": "USER,PANORAMA",
                "responsibleProviderIEN": "10000000226",
                "serviceConnected": "64^AUDIOLOGY",
                "status": "A^ACTIVE",
                "userIEN": "11010V543403"
            };

            var validator = new ProblemsValidator(input);
            expect(validator.isValid()).to.equal(false);
            expect(_.size(validator.getErrors())).eql(1);
        });

        it ('user IEN is present', function () {
            var input = {
                "MST" : "No",
                "comments": [ "test comment one", "test comment two"],
                "dateOfOnset": "20141113",
                "dateRecorded": "20141113",
                "enteredBy": "USER,PANORAMA",
                "enteredByIEN": "10000000226",
                "headOrNeckCancer": "No",
                "lexiconCode": "",
                "patientIEN": "100615",
                "patientName": "EIGHT,OUTPATIENT",
                "problemName": "soven test",
                "problemText": "soven test",
                "providerIEN": "10000000226",
                "recordingProvider": "USER,PANORAMA",
                "responsibleProvider": "USER,PANORAMA",
                "responsibleProviderIEN": "10000000226",
                "serviceConnected": "64^AUDIOLOGY",
                "status": "A^ACTIVE",
                "userIEN": "11010V543403"
            };

            var validator = new ProblemsValidator(input);
            expect(validator.isValid()).to.equal(true);
        });
    });
});
