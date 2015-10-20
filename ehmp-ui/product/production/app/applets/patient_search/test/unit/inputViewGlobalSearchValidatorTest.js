/*jslint node: true, nomen: true, unparam: true */
/*global jquery, $, _, define, Marionette, jqm, describe, it, expect, beforeEach, spyOn */
'use strict';

define([
    'jquery',
    'backbone',
    'marionette',
    'jasminejquery',
    'app/applets/patient_search/utils/globalSearchParametersValidator'
], function($, Backbone, Marionette, jasminejquery, validatorUtil) {

    var testGlobalSearchValidatorData = {
        'validLastName': "ABCDEFGHIJKLMNOPQRSTUVWXYZ,-\' ",
        'invalidLastName1': "abc",
        'invalidLastName2': "ABC&",
        'validFirstName': "ABCDEFGHIJKLMNOPQRSTUVWXYZ,-\' ",
        'invalidFirstName1': "abc",
        'invalidFirstName2': "ABC&",
        'validDOB1': "01/02/2013",
        'validDOB2': "1/2/2013",
        'invalidDOB1': "abc",
        'invalidDOB2': "11122013",
        'invalidDOB3': "122013",
        'validSSN1': "123-45-6789",
        'validSSN2': "123456789",
        'invalidSSN1': "123-45-678",
        'invalidSSN2': "123-45-AAAA"
    };

    var testValidatorData = {
        'name.last': '',
        'name.first': '',
        'ssn': '',
        'date.birth': ''
    };

    beforeEach(function() {
            testValidatorData['name.last'] = '';
            testValidatorData['name.first'] = '';
            testValidatorData.ssn = '';
            testValidatorData['date.birth'] = '';
        });

    //Tests for .validateGlobalSearchData() (valid data)
    describe("Determine if regex validator accepts data that should be valid", function() {
        it("Should return success (valid last name)", function() {
            testValidatorData['name.last'] = testGlobalSearchValidatorData.validLastName;
            expect(validatorUtil.validateGlobalSearchParameterFormatting(testValidatorData)).toBe("success");
        });
        it("Should return success (valid first name", function() {
            testValidatorData['name.first'] = testGlobalSearchValidatorData.validFirstName;
            expect(validatorUtil.validateGlobalSearchParameterFormatting(testValidatorData)).toBe("success");
        });
        it("Should return success (valid DOB 1)", function() {
            testValidatorData['date.birth'] = testGlobalSearchValidatorData.validDOB1;
            expect(validatorUtil.validateGlobalSearchParameterFormatting(testValidatorData)).toBe("success");
        });
        it("Should return success (valid DOB 2)", function() {
            testValidatorData['date.birth'] = testGlobalSearchValidatorData.validDOB2;
            expect(validatorUtil.validateGlobalSearchParameterFormatting(testValidatorData)).toBe("success");
        });
        it("Should return success (valid SSN 1)", function() {
            testValidatorData.ssn = testGlobalSearchValidatorData.validSSN1;
            expect(validatorUtil.validateGlobalSearchParameterFormatting(testValidatorData)).toBe("success");
        });
        it("Should return success (valid SSN 2)", function() {
            testValidatorData.ssn = testGlobalSearchValidatorData.validSSN2;
            expect(validatorUtil.validateGlobalSearchParameterFormatting(testValidatorData)).toBe("success");
        });
    });

    //Tests for .validateGlobalSearchData() (invalid data)
    describe("Determine if regex validator rejects data that should be invalid", function() {
        it("Should return nameFormatFailure (invalid last name 1)", function() {
            testValidatorData['name.last'] = testGlobalSearchValidatorData.invalidLastName1;
            expect(validatorUtil.validateGlobalSearchParameterFormatting(testValidatorData)).toBe("nameFormatFailure");
        });
        it("Should return nameFormatFailure (invalid last name 2)", function() {
            testValidatorData['name.last'] = testGlobalSearchValidatorData.invalidLastName2;
            expect(validatorUtil.validateGlobalSearchParameterFormatting(testValidatorData)).toBe("nameFormatFailure");
        });
        it("Should return nameFormatFailure (invalid first name 1)", function() {
            testValidatorData['name.first'] = testGlobalSearchValidatorData.invalidFirstName1;
            expect(validatorUtil.validateGlobalSearchParameterFormatting(testValidatorData)).toBe("nameFormatFailure");
        });
        it("Should return nameFormatFailure (invalid first name 2)", function() {
            testValidatorData['name.first'] = testGlobalSearchValidatorData.invalidFirstName2;
            expect(validatorUtil.validateGlobalSearchParameterFormatting(testValidatorData)).toBe("nameFormatFailure");
        });
        it("Should return dobFormatFailure (invalid DOB 1)", function() {
            testValidatorData['date.birth'] = testGlobalSearchValidatorData.invalidDOB1;
            expect(validatorUtil.validateGlobalSearchParameterFormatting(testValidatorData)).toBe("dobFormatFailure");
        });
        it("Should return dobFormatFailure (invalid DOB 2)", function() {
            testValidatorData['date.birth'] = testGlobalSearchValidatorData.invalidDOB2;
            expect(validatorUtil.validateGlobalSearchParameterFormatting(testValidatorData)).toBe("dobFormatFailure");
        });
        it("Should return dobFormatFailure (invalid SSN 1)", function() {
            testValidatorData.ssn = testGlobalSearchValidatorData.invalidSSN1;
            expect(validatorUtil.validateGlobalSearchParameterFormatting(testValidatorData)).toBe("ssnFormatFailure");
        });
        it("Should return dobFormatFailure (invalid SSN 2)", function() {
            testValidatorData.ssn = testGlobalSearchValidatorData.invalidSSN2;
            expect(validatorUtil.validateGlobalSearchParameterFormatting(testValidatorData)).toBe("ssnFormatFailure");
        });
    });

    //Tests for .validateGlobalSearchData() (valid configurations of search parameters)
    describe("Determine if the search parameters validator recognizes valid combinations of search parameters (last name required, at least one other search term required)", function() {
        it("Should return success (last name + first name)", function() {
            testValidatorData['name.last'] = testGlobalSearchValidatorData.validLastName;
            testValidatorData['name.first'] = testGlobalSearchValidatorData.validFirstName;
            expect(validatorUtil.validateGlobalSearchParameterConfiguration(testValidatorData)).toBe("success");
        });
        it("Should return success (last name + DOB)", function() {
            testValidatorData['name.last'] = testGlobalSearchValidatorData.validLastName;
            testValidatorData['date.birth'] = testGlobalSearchValidatorData.validDOB;
            expect(validatorUtil.validateGlobalSearchParameterConfiguration(testValidatorData)).toBe("success");
        });
        it("Should return success (last name + SSN)", function() {
            testValidatorData['name.last'] = testGlobalSearchValidatorData.validLastName;
            testValidatorData.ssn = testGlobalSearchValidatorData.validSSN;
            expect(validatorUtil.validateGlobalSearchParameterConfiguration(testValidatorData)).toBe("success");
        });
        it("Should return success (last name + first name + DOB)", function() {
            testValidatorData['name.last'] = testGlobalSearchValidatorData.validLastName;
            testValidatorData['name.first'] = testGlobalSearchValidatorData.validFirstName;
            testValidatorData['date.birth'] = testGlobalSearchValidatorData.validDOB;
            expect(validatorUtil.validateGlobalSearchParameterConfiguration(testValidatorData)).toBe("success");
        });
        it("Should return success (last name + first name + SSN)", function() {
            testValidatorData['name.last'] = testGlobalSearchValidatorData.validLastName;
            testValidatorData['name.first'] = testGlobalSearchValidatorData.validFirstName;
            testValidatorData.ssn = testGlobalSearchValidatorData.validSSN;
            expect(validatorUtil.validateGlobalSearchParameterConfiguration(testValidatorData)).toBe("success");
        });
        it("Should return success (last name + DOB + SSN)", function() {
            testValidatorData['name.last'] = testGlobalSearchValidatorData.validLastName;
            testValidatorData['date.birth'] = testGlobalSearchValidatorData.validDOB;
            testValidatorData.ssn = testGlobalSearchValidatorData.validSSN;
            expect(validatorUtil.validateGlobalSearchParameterConfiguration(testValidatorData)).toBe("success");
        });
        it("Should return success (last name + first name + DOB + SSN)", function() {
            testValidatorData['name.last'] = testGlobalSearchValidatorData.validLastName;
            testValidatorData['name.first'] = testGlobalSearchValidatorData.validFirstName;
            testValidatorData['date.birth'] = testGlobalSearchValidatorData.validDOB;
            testValidatorData.ssn = testGlobalSearchValidatorData.validSSN;
            expect(validatorUtil.validateGlobalSearchParameterConfiguration(testValidatorData)).toBe("success");
        });
    });

    //Tests for .validateGlobalSearchData() (invalid configurations of search parameters)
    describe("Determine if the search parameters validator recognizes invalid combinations of search parameters", function() {
        it("Should return false (no search parameters)", function() {
            expect(validatorUtil.validateGlobalSearchParameterConfiguration(testValidatorData)).toBe("lastNameRequiredFailure");
        });
        it("Should return false (last name)", function() {
            testValidatorData['name.last'] = testGlobalSearchValidatorData.validLastName;
            expect(validatorUtil.validateGlobalSearchParameterConfiguration(testValidatorData)).toBe("twoFieldsRequiredFailure");
        });
        it("Should return false (first name)", function() {
            testValidatorData['name.first'] = testGlobalSearchValidatorData.validFirstName;
            expect(validatorUtil.validateGlobalSearchParameterConfiguration(testValidatorData)).toBe("lastNameRequiredFailure");
        });
        it("Should return false (DOB)", function() {
            testValidatorData['date.birth'] = testGlobalSearchValidatorData.validDOB;
            expect(validatorUtil.validateGlobalSearchParameterConfiguration(testValidatorData)).toBe("lastNameRequiredFailure");
        });
        it("Should return false (SSN)", function() {
            testValidatorData['date.birth'] = testGlobalSearchValidatorData.validSSN;
            expect(validatorUtil.validateGlobalSearchParameterConfiguration(testValidatorData)).toBe("lastNameRequiredFailure");
        });
        it("Should return false (first name + DOB)", function() {
            testValidatorData['name.first'] = testGlobalSearchValidatorData.validFirstName;
            testValidatorData['date.birth'] = testGlobalSearchValidatorData.validDOB;
            expect(validatorUtil.validateGlobalSearchParameterConfiguration(testValidatorData)).toBe("lastNameRequiredFailure");
        });
        it("Should return false (first name + SSN)", function() {
            testValidatorData['name.first'] = testGlobalSearchValidatorData.validFirstName;
            testValidatorData.ssn = testGlobalSearchValidatorData.validSSN;
            expect(validatorUtil.validateGlobalSearchParameterConfiguration(testValidatorData)).toBe("lastNameRequiredFailure");
        });
        it("Should return false (DOB + SSN)", function() {
            testValidatorData['date.birth'] = testGlobalSearchValidatorData.validDOB;
            testValidatorData.ssn = testGlobalSearchValidatorData.validSSN;
            expect(validatorUtil.validateGlobalSearchParameterConfiguration(testValidatorData)).toBe("lastNameRequiredFailure");
        });
        it("Should return false (first name + DOB + SSN)", function() {
            testValidatorData['name.first'] = testGlobalSearchValidatorData.validFirstName;
            testValidatorData['date.birth'] = testGlobalSearchValidatorData.validDOB;
            testValidatorData.ssn = testGlobalSearchValidatorData.validSSN;
            expect(validatorUtil.validateGlobalSearchParameterConfiguration(testValidatorData)).toBe("lastNameRequiredFailure");
        });
    });

});
