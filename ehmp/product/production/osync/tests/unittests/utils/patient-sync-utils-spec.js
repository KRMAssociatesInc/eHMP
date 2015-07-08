'use strict';

require('../../../env-setup');
var log = require(global.OSYNC_UTILS + 'dummy-logger');
var patientSyncUtils = require(global.OSYNC_UTILS + 'patient-sync-utils');

function validateAppointmentsError(rpcResponse, errorMsg) {
    parseAndValidateAppointments(rpcResponse, true, errorMsg);
}

function validateAdmissionsError(rpcResponse, errorMsg) {
    parseAndValidateAdmissions(rpcResponse, true, errorMsg);
}

function validateAppointmentsSuccess(response, index, dfn, date, locationName, locationIen) {
    expect(response.length).toBeGreaterThan(index);
    expect(response[index].dfn).toBe(dfn);
    expect(response[index].date).toBe(date);
    expect(response[index].locationName).toBe(locationName);
    expect(response[index].locationIen).toBe(locationIen);
}

function validateAdmissionsSuccess(response, index, dfn, date, locationName, roomBed, locationIen) {
    expect(response.length).toBeGreaterThan(index);
    expect(response[index].dfn).toBe(dfn);
    expect(response[index].date).toBe(date);
    expect(response[index].locationName).toBe(locationName);
    expect(response[index].roomBed).toBe(roomBed);
    expect(response[index].locationIen).toBe(locationIen);
}

function parseAndValidateAppointments(rpcResponse, expectError, errorMsg) {
    var errorOccurred = false;
    var response = null;
    try {
        errorOccurred = false;
        response = patientSyncUtils.parseRpcResponseAppointments(rpcResponse);
    }
    catch (e) {
        errorOccurred = true;
        if (expectError === true) {
            expect(e).toBe(errorMsg);
        }
        else {
            expect(e).toBeNull(); //Since Jasmine doesn't have a "fail" method use a bogus expectation to print out the error.
        }
    }

    expect(errorOccurred).toBe(expectError);
    return response;
}

function parseAndValidateAdmissions(rpcResponse, expectError, errorMsg) {
    var errorOccurred = false;
    var response = null;
    try {
        errorOccurred = false;
        response = patientSyncUtils.parseRpcResponseAdmissions(rpcResponse);
    }
    catch (e) {
        errorOccurred = true;
        if (expectError === true) {
            expect(e).toBe(errorMsg);
        }
        else {
            expect(e).toBeNull(); //Since Jasmine doesn't have a "fail" method use a bogus expectation to print out the error.
        }
    }

    expect(errorOccurred).toBe(expectError);
    return response;
}

describe('unit test to validate patient-sync-utils parse the RPC response correctly', function() {
    beforeEach(function() {
    });

    it("should throw an error when Appointments RPC doesn't return any data", function () {
        runs(function () {
            validateAppointmentsError(null, "The RPC didn't return any data.");
            validateAppointmentsError("", "The RPC didn't return any data.");
        });
    });

    it("should throw an error when Admissions RPC doesn't return any data", function () {
        runs(function () {
            validateAdmissionsError(null, "The RPC didn't return any data.");
            validateAdmissionsError("", "The RPC didn't return any data.");
        });
    });

    it("should throw an error when Appointments RPC doesn't return correct data", function () {
        runs(function () {
            validateAppointmentsError("^^", "The RPC returned data but was missing elements.");
            validateAppointmentsError("^^^", "The RPC returned empty data.");
            validateAppointmentsError("^B^C^D", "The RPC returned data missing the DFN field.");
            validateAppointmentsError("A^^C^D", "The RPC returned data missing the DATE of event (appt or admit) field.");
            validateAppointmentsError("A^B^^D", "The RPC returned data missing the location name field.");
            validateAppointmentsError("A^B^C^", "The RPC returned data missing the location IEN field.");
        });
    });

    it("should throw an error when Appointments RPC doesn't return correct data on the second line of data", function () {
        runs(function () {
            validateAppointmentsError("A^B^C^D\n^^", "The RPC returned data but was missing elements.");
            validateAppointmentsError("A^B^C^D\n^^^", "The RPC returned empty data.");
            validateAppointmentsError("A^B^C^D\n^B^C^D", "The RPC returned data missing the DFN field.");
            validateAppointmentsError("A^B^C^D\nA^^C^D", "The RPC returned data missing the DATE of event (appt or admit) field.");
            validateAppointmentsError("A^B^C^D\nA^B^^D", "The RPC returned data missing the location name field.");
            validateAppointmentsError("A^B^C^D\nA^B^C^", "The RPC returned data missing the location IEN field.");
        });
    });

    it("should throw an error when Admissions RPC doesn't return correct data", function () {
        runs(function () {
            validateAdmissionsError("^^", "The RPC returned data but was missing elements.");
            validateAdmissionsError("^^^^", "The RPC returned empty data.");
            validateAdmissionsError("^B^C^D^E", "The RPC returned data missing the DFN field.");
            validateAdmissionsError("A^^C^D^E", "The RPC returned data missing the DATE of event (appt or admit) field.");
            validateAdmissionsError("A^B^^D^E", "The RPC returned data missing the location name field.");
            validateAdmissionsError("A^B^C^D^", "The RPC returned data missing the location IEN field.");
        });
    });

    it("should throw an error when Admissions RPC doesn't return correct data on the second line of data", function () {
        runs(function () {
            validateAdmissionsError("A^B^C^D^E\n^^", "The RPC returned data but was missing elements.");
            validateAdmissionsError("A^B^C^D^E\n^^^^", "The RPC returned empty data.");
            validateAdmissionsError("A^B^C^D^E\n^B^C^D^E", "The RPC returned data missing the DFN field.");
            validateAdmissionsError("A^B^C^D^E\nA^^C^D^E", "The RPC returned data missing the DATE of event (appt or admit) field.");
            validateAdmissionsError("A^B^C^D^E\nA^B^^D^E", "The RPC returned data missing the location name field.");
            validateAdmissionsError("A^B^C^D^E\nA^B^C^D^", "The RPC returned data missing the location IEN field.");
        });
    });

    it('should parse Appointments RPC correctly', function () {
        runs(function () {
            var response = parseAndValidateAppointments("A^B^C^D", false);
            validateAppointmentsSuccess(response, 0, "A", "B", "C", "D");
        });
    });

    it('should parse multiline Appointments RPC correctly', function () {
        runs(function () {
            var response = parseAndValidateAppointments("A^B^C^D\nE^F^G^H\nI^J^K^L", false);
            validateAppointmentsSuccess(response, 0, "A", "B", "C", "D");
            validateAppointmentsSuccess(response, 1, "E", "F", "G", "H");
            validateAppointmentsSuccess(response, 2, "I", "J", "K", "L");
        });
    });

    it('should parse Admissions RPC correctly', function () {
        runs(function () {
            var response = parseAndValidateAdmissions("A^B^C^D^E", false);
            validateAdmissionsSuccess(response, 0, "A", "B", "C", "D", "E");
        });
    });

    it('should parse multiline Admissions RPC correctly', function () {
        runs(function () {
            var response = parseAndValidateAdmissions("A^B^C^D^E\nF^G^H^I^J\nK^L^M^N^O", false);
            validateAdmissionsSuccess(response, 0, "A", "B", "C", "D", "E");
            validateAdmissionsSuccess(response, 1, "F", "G", "H", "I", "J");
            validateAdmissionsSuccess(response, 2, "K", "L", "M", "N", "O");
        });
    });
});

